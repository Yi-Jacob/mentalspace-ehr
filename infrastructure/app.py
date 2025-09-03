# Infrastructure as Code using AWS CDK
# This creates the complete AWS infrastructure for MentalSpace EHR

import aws_cdk as cdk
from aws_cdk import (
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_ecs_patterns as ecs_patterns,
    aws_rds as rds,
    aws_elasticache as elasticache,
    aws_secretsmanager as secretsmanager,
    aws_iam as iam,
    aws_logs as logs,
    aws_applicationloadbalancer as alb,
    aws_certificatemanager as acm,
    aws_route53 as route53,
    aws_route53_targets as targets,
    aws_s3 as s3,
    aws_cloudwatch as cloudwatch,
    aws_cloudwatch_actions as cw_actions,
    aws_sns as sns,
    RemovalPolicy,
    Duration,
)
from constructs import Construct

class MentalSpaceEHRStack(cdk.Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Environment variables
        self.environment = self.node.try_get_context('environment') or 'production'
        self.domain_name = self.node.try_get_context('domain_name') or 'mentalspace-ehr.com'
        
        # Create VPC with private subnets for HIPAA compliance
        self.vpc = ec2.Vpc(
            self, "MentalSpaceVPC",
            max_azs=3,
            nat_gateways=3,
            subnet_configuration=[
                ec2.SubnetConfiguration(
                    name="Public",
                    subnet_type=ec2.SubnetType.PUBLIC,
                    cidr_mask=24
                ),
                ec2.SubnetConfiguration(
                    name="Private",
                    subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    cidr_mask=24
                ),
                ec2.SubnetConfiguration(
                    name="Database",
                    subnet_type=ec2.SubnetType.PRIVATE_ISOLATED,
                    cidr_mask=24
                )
            ]
        )

        # Create security groups
        self.alb_sg = ec2.SecurityGroup(
            self, "ALBSecurityGroup",
            vpc=self.vpc,
            description="Security group for Application Load Balancer",
            allow_all_outbound=True
        )
        self.alb_sg.add_ingress_rule(
            peer=ec2.Peer.any_ipv4(),
            connection=ec2.Port.tcp(443),
            description="HTTPS from internet"
        )
        self.alb_sg.add_ingress_rule(
            peer=ec2.Peer.any_ipv4(),
            connection=ec2.Port.tcp(80),
            description="HTTP from internet"
        )

        self.ecs_sg = ec2.SecurityGroup(
            self, "ECSSecurityGroup",
            vpc=self.vpc,
            description="Security group for ECS tasks",
            allow_all_outbound=True
        )
        self.ecs_sg.add_ingress_rule(
            peer=self.alb_sg,
            connection=ec2.Port.tcp(80),
            description="HTTP from ALB"
        )

        # Create SSL certificate
        self.certificate = acm.Certificate(
            self, "SSLCertificate",
            domain_name=self.domain_name,
            subject_alternative_names=[f"*.{self.domain_name}"],
            validation=acm.CertificateValidation.from_dns(
                route53.HostedZone.from_lookup(
                    self, "HostedZone",
                    domain_name=self.domain_name
                )
            )
        )

        # Create RDS PostgreSQL instance for HIPAA compliance
        self.database = rds.DatabaseInstance(
            self, "MentalSpaceDatabase",
            engine=rds.DatabaseInstanceEngine.postgres(
                version=rds.PostgresEngineVersion.VER_15_4
            ),
            instance_type=ec2.InstanceType.of(
                ec2.InstanceClass.T3,
                ec2.InstanceSize.MEDIUM
            ),
            vpc=self.vpc,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_ISOLATED
            ),
            database_name="mentalspace",
            credentials=rds.Credentials.from_generated_secret(
                "mentalspace",
                secret_name="mentalspace-db-credentials"
            ),
            backup_retention=Duration.days(30),
            deletion_protection=True,
            storage_encrypted=True,
            multi_az=True,
            removal_policy=RemovalPolicy.RETAIN,
            monitoring_interval=Duration.minutes(1),
            enable_performance_insights=True,
            performance_insights_retention=rds.PerformanceInsightsRetention.DEFAULT
        )

        # Create ElastiCache Redis cluster
        self.redis_subnet_group = elasticache.CfnSubnetGroup(
            self, "RedisSubnetGroup",
            description="Subnet group for Redis cluster",
            subnet_ids=[subnet.subnet_id for subnet in self.vpc.private_subnets]
        )

        self.redis = elasticache.CfnCacheCluster(
            self, "MentalSpaceRedis",
            cache_node_type="cache.t3.micro",
            engine="redis",
            num_cache_nodes=1,
            cache_subnet_group_name=self.redis_subnet_group.ref,
            vpc_security_group_ids=[self.ecs_sg.security_group_id],
            port=6379,
            at_rest_encryption_enabled=True,
            transit_encryption_enabled=True
        )

        # Create S3 bucket for document storage
        self.document_bucket = s3.Bucket(
            self, "MentalSpaceDocuments",
            versioned=True,
            encryption=s3.BucketEncryption.S3_MANAGED,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.RETAIN,
            lifecycle_rules=[
                s3.LifecycleRule(
                    id="DocumentRetention",
                    enabled=True,
                    expiration=Duration.days(2555),  # 7 years for HIPAA
                    noncurrent_version_expiration=Duration.days(2555)
                )
            ]
        )

        # Create ECS cluster
        self.cluster = ecs.Cluster(
            self, "MentalSpaceCluster",
            vpc=self.vpc,
            container_insights=True,
            default_cloud_map_namespace=ecs.CloudMapNamespaceOptions(
                name="mentalspace.local"
            )
        )

        # Create task definition for backend
        self.backend_task_definition = ecs.FargateTaskDefinition(
            self, "BackendTaskDefinition",
            memory_limit_mib=2048,
            cpu=1024,
            execution_role=self.create_execution_role(),
            task_role=self.create_task_role()
        )

        # Add backend container
        self.backend_container = self.backend_task_definition.add_container(
            "BackendContainer",
            image=ecs.ContainerImage.from_asset("."),
            docker_file_path="Dockerfile.backend",
            logging=ecs.LogDrivers.aws_logs(
                stream_prefix="backend",
                log_retention=logs.RetentionDays.ONE_MONTH
            ),
            environment={
                "NODE_ENV": "production",
                "PORT": "7000"
            },
            secrets={
                "DATABASE_URL": ecs.Secret.from_secrets_manager(
                    self.database.secret,
                    field="host"
                ),
                "JWT_SECRET": ecs.Secret.from_secrets_manager(
                    secretsmanager.Secret.from_secret_name_v2(
                        self, "JWTSecret", "mentalspace-jwt-secret"
                    )
                )
            },
            health_check=ecs.HealthCheck(
                command=["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:7000/health || exit 1"],
                interval=Duration.seconds(30),
                timeout=Duration.seconds(5),
                retries=3,
                start_period=Duration.seconds(60)
            )
        )

        self.backend_container.add_port_mappings(
            ecs.PortMapping(container_port=7000)
        )

        # Create task definition for frontend
        self.frontend_task_definition = ecs.FargateTaskDefinition(
            self, "FrontendTaskDefinition",
            memory_limit_mib=1024,
            cpu=512,
            execution_role=self.create_execution_role()
        )

        # Add frontend container
        self.frontend_container = self.frontend_task_definition.add_container(
            "FrontendContainer",
            image=ecs.ContainerImage.from_asset("."),
            docker_file_path="Dockerfile.frontend",
            logging=ecs.LogDrivers.aws_logs(
                stream_prefix="frontend",
                log_retention=logs.RetentionDays.ONE_MONTH
            ),
            environment={
                "VITE_API_URL": f"https://api.{self.domain_name}"
            },
            health_check=ecs.HealthCheck(
                command=["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost/health || exit 1"],
                interval=Duration.seconds(30),
                timeout=Duration.seconds(5),
                retries=3,
                start_period=Duration.seconds(60)
            )
        )

        self.frontend_container.add_port_mappings(
            ecs.PortMapping(container_port=80)
        )

        # Create Application Load Balancer
        self.alb = alb.ApplicationLoadBalancer(
            self, "MentalSpaceALB",
            vpc=self.vpc,
            internet_facing=True,
            security_group=self.alb_sg,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PUBLIC
            )
        )

        # Create target groups
        self.backend_target_group = alb.ApplicationTargetGroup(
            self, "BackendTargetGroup",
            vpc=self.vpc,
            port=7000,
            protocol=alb.ApplicationProtocol.HTTP,
            target_type=alb.TargetType.IP,
            health_check=alb.HealthCheck(
                path="/health",
                interval=Duration.seconds(30),
                timeout=Duration.seconds(5),
                healthy_threshold_count=2,
                unhealthy_threshold_count=3
            )
        )

        self.frontend_target_group = alb.ApplicationTargetGroup(
            self, "FrontendTargetGroup",
            vpc=self.vpc,
            port=80,
            protocol=alb.ApplicationProtocol.HTTP,
            target_type=alb.TargetType.IP,
            health_check=alb.HealthCheck(
                path="/health",
                interval=Duration.seconds(30),
                timeout=Duration.seconds(5),
                healthy_threshold_count=2,
                unhealthy_threshold_count=3
            )
        )

        # Create listeners
        self.https_listener = self.alb.add_listener(
            "HTTPSListener",
            port=443,
            protocol=alb.ApplicationProtocol.HTTPS,
            certificates=[self.certificate],
            default_action=alb.ListenerAction.forward([self.frontend_target_group])
        )

        self.http_listener = self.alb.add_listener(
            "HTTPListener",
            port=80,
            protocol=alb.ApplicationProtocol.HTTP,
            default_action=alb.ListenerAction.redirect(
                permanent=True,
                protocol="HTTPS",
                port="443"
            )
        )

        # Add API route
        self.https_listener.add_action(
            "APIRoute",
            priority=100,
            conditions=[
                alb.ListenerCondition.path_patterns(["/api/*"])
            ],
            action=alb.ListenerAction.forward([self.backend_target_group])
        )

        # Create ECS services
        self.backend_service = ecs.FargateService(
            self, "BackendService",
            cluster=self.cluster,
            task_definition=self.backend_task_definition,
            security_groups=[self.ecs_sg],
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            ),
            desired_count=2,
            min_healthy_percent=50,
            max_healthy_percent=200,
            service_name="mentalspace-backend"
        )

        self.frontend_service = ecs.FargateService(
            self, "FrontendService",
            cluster=self.cluster,
            task_definition=self.frontend_task_definition,
            security_groups=[self.ecs_sg],
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            ),
            desired_count=2,
            min_healthy_percent=50,
            max_healthy_percent=200,
            service_name="mentalspace-frontend"
        )

        # Attach services to target groups
        self.backend_service.attach_to_application_target_group(self.backend_target_group)
        self.frontend_service.attach_to_application_target_group(self.frontend_target_group)

        # Create CloudWatch alarms
        self.create_monitoring()

        # Create Route53 records
        self.create_dns_records()

    def create_execution_role(self):
        return iam.Role(
            self, "ECSTaskExecutionRole",
            assumed_by=iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name("service-role/AmazonECSTaskExecutionRolePolicy")
            ]
        )

    def create_task_role(self):
        return iam.Role(
            self, "ECSTaskRole",
            assumed_by=iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name("AmazonS3ReadOnlyAccess")
            ]
        )

    def create_monitoring(self):
        # CPU utilization alarm
        cpu_alarm = cloudwatch.Alarm(
            self, "HighCPUUtilization",
            metric=self.cluster.metric_cpu_utilization(),
            threshold=80,
            evaluation_periods=3,
            datapoints_to_alarm=2,
            treat_missing_data=cloudwatch.TreatMissingData.BREACHING
        )

        # Memory utilization alarm
        memory_alarm = cloudwatch.Alarm(
            self, "HighMemoryUtilization",
            metric=self.cluster.metric_memory_utilization(),
            threshold=80,
            evaluation_periods=3,
            datapoints_to_alarm=2,
            treat_missing_data=cloudwatch.TreatMissingData.BREACHING
        )

        # Database connection alarm
        db_connections_alarm = cloudwatch.Alarm(
            self, "HighDatabaseConnections",
            metric=self.database.metric_database_connections(),
            threshold=80,
            evaluation_periods=3,
            datapoints_to_alarm=2
        )

        # Create SNS topic for alerts
        alert_topic = sns.Topic(
            self, "MentalSpaceAlerts",
            display_name="MentalSpace EHR Alerts"
        )

        # Add actions to alarms
        cpu_alarm.add_alarm_action(cw_actions.SnsAction(alert_topic))
        memory_alarm.add_alarm_action(cw_actions.SnsAction(alert_topic))
        db_connections_alarm.add_alarm_action(cw_actions.SnsAction(alert_topic))

    def create_dns_records(self):
        # Create hosted zone reference
        hosted_zone = route53.HostedZone.from_lookup(
            self, "HostedZone",
            domain_name=self.domain_name
        )

        # Create A record for frontend
        route53.ARecord(
            self, "FrontendARecord",
            zone=hosted_zone,
            record_name=self.domain_name,
            target=route53.RecordTarget.from_alias(
                targets.LoadBalancerTarget(self.alb)
            )
        )

        # Create A record for API
        route53.ARecord(
            self, "APIARecord",
            zone=hosted_zone,
            record_name=f"api.{self.domain_name}",
            target=route53.RecordTarget.from_alias(
                targets.LoadBalancerTarget(self.alb)
            )
        )

app = cdk.App()
MentalSpaceEHRStack(app, "MentalSpaceEHRStack")
app.synth()

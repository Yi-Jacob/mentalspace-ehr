# GitHub Actions Setup Guide for MentalSpace EHR

## Required GitHub Secrets

Before the CI/CD pipeline can work, you need to set up the following secrets in your GitHub repository:

### 1. AWS Credentials
Go to your GitHub repository → Settings → Secrets and variables → Actions, then add:

**AWS_ACCESS_KEY_ID**
- Create an IAM user in AWS with appropriate permissions
- Copy the Access Key ID

**AWS_SECRET_ACCESS_KEY**
- Copy the Secret Access Key from the same IAM user

### 2. IAM User Permissions Required

The IAM user needs these permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:PutImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecs:UpdateService",
                "ecs:DescribeServices",
                "ecs:DescribeTasks",
                "ecs:ListTasks"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:PassRole"
            ],
            "Resource": "*"
        }
    ]
}
```

### 3. AWS Setup Steps

1. **Create IAM User:**
   ```bash
   aws iam create-user --user-name github-actions
   ```

2. **Create Access Keys:**
   ```bash
   aws iam create-access-key --user-name github-actions
   ```

3. **Attach Policy:**
   ```bash
   aws iam attach-user-policy --user-name github-actions --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
   ```

### 4. ECR Repository Setup

The workflow expects an ECR repository named `mentalspace-ehr`. Create it:

```bash
aws ecr create-repository --repository-name mentalspace-ehr --region us-east-1
```

### 5. ECS Cluster and Services

The workflow expects:
- ECS Cluster: `MentalSpaceCluster`
- ECS Service Backend: `mentalspace-backend`
- ECS Service Frontend: `mentalspace-frontend`

These will be created by the CDK infrastructure deployment.

### 6. Environment Variables

The workflow uses these environment variables (defined in the workflow file):
- `AWS_REGION`: us-east-1
- `ECR_REPOSITORY`: mentalspace-ehr
- `ECS_CLUSTER`: MentalSpaceCluster
- `ECS_SERVICE_BACKEND`: mentalspace-backend
- `ECS_SERVICE_FRONTEND`: mentalspace-frontend

### 7. Workflow Steps Explained

1. **Security Scan**: Runs Trivy to scan for vulnerabilities
2. **Lint & Build**: Lints code and builds applications
3. **Build & Push**: Builds Docker images and pushes to ECR
4. **Deploy Staging**: Deploys to staging environment (develop branch)
5. **Deploy Production**: Deploys to production environment (main branch)
6. **Infrastructure**: Deploys AWS infrastructure using CDK
7. **Performance Test**: Optional performance testing (future use)

### 8. Manual Setup Steps

Before running the workflow:

1. **Deploy Infrastructure First:**
   ```bash
   cd infrastructure
   npm install
   cdk bootstrap
   cdk deploy
   ```

2. **Set up GitHub Secrets:**
   - Go to repository Settings → Secrets and variables → Actions
   - Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

3. **Create ECR Repository:**
   ```bash
   aws ecr create-repository --repository-name mentalspace-ehr
   ```

### 9. Testing the Setup

1. **Test AWS Credentials:**
   ```bash
   aws sts get-caller-identity
   ```

2. **Test ECR Access:**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com
   ```

3. **Test ECS Access:**
   ```bash
   aws ecs list-clusters
   ```

### 10. Troubleshooting

**Common Issues:**

1. **Permission Denied**: Check IAM user permissions
2. **ECR Repository Not Found**: Create the repository first
3. **ECS Service Not Found**: Deploy infrastructure first
4. **CDK Bootstrap Required**: Run `cdk bootstrap` first

**Debug Commands:**
```bash
# Check if ECR repository exists
aws ecr describe-repositories --repository-names mentalspace-ehr

# Check if ECS cluster exists
aws ecs describe-clusters --clusters MentalSpaceCluster

# Check if ECS services exist
aws ecs describe-services --cluster MentalSpaceCluster --services mentalspace-backend mentalspace-frontend
```

### 11. Security Best Practices

1. **Use Least Privilege**: Only grant necessary permissions
2. **Rotate Keys Regularly**: Update access keys periodically
3. **Monitor Usage**: Set up CloudTrail for audit logs
4. **Use Environment Protection**: Enable branch protection rules

### 12. Next Steps

After setting up the secrets:

1. Push to `develop` branch to test staging deployment
2. Push to `main` branch to test production deployment
3. Monitor the workflow runs in GitHub Actions tab
4. Check AWS console to verify resources are created
5. Test the application endpoints

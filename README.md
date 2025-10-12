# MentalSpace EHR

A comprehensive HIPAA-compliant electronic health record system built with React, NestJS, and TypeScript.

## 🏥 HIPAA Compliance Features

- **Strong Authentication**: JWT with 15-minute expiration + refresh tokens
- **Account Lockout**: 5 failed attempts = 30-minute lockout
- **Password Security**: 12+ character requirements with complexity validation
- **Audit Logging**: Complete tracking of all user actions and data access
- **Data Encryption**: Database encryption at rest and in transit
- **Access Controls**: Role-based permissions for different user types
- **File Security**: S3 storage with signed URLs and access controls

## 🏗️ Project Structure

This is a monorepo containing:

- **Frontend**: React application with Vite, TypeScript, and Tailwind CSS
- **Backend**: NestJS API with Prisma ORM and comprehensive security features

```
mentalspace-ehr/
├── apps/
│   ├── frontend/     # React application
│   └── backend/      # NestJS API with HIPAA compliance
├── packages/         # Shared packages (future)
├── package.json      # Root package.json with workspaces
└── README.md
```

## 🚀 Production Deployment Guide

### Prerequisites

- AWS Account with appropriate permissions
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

### Step 1: AWS Infrastructure Setup

#### 1.1 Create EC2 Instance

```bash
# Launch EC2 instance with these specifications:
- Instance Type: t3.medium or larger
- OS: Amazon Linux 2023 or Ubuntu 22.04 LTS
- Storage: 20GB minimum
- Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
- Key Pair: Create and download for SSH access
```

#### 1.2 Create RDS Database

```bash
# Create PostgreSQL RDS instance:
- Engine: PostgreSQL 15.x
- Instance Class: db.t3.micro (for testing) or db.t3.small (production)
- Storage: 20GB minimum with encryption enabled
- Multi-AZ: Yes (for production)
- Public Access: Yes (required for EC2 connection)
- VPC Security Group: Allow PostgreSQL (5432) from EC2 security group
- Encryption: Enable encryption at rest
- Backup: Enable automated backups
```

#### 1.3 Create S3 Bucket

```bash
# Create S3 bucket for file storage:
- Bucket Name: your-app-name-files (must be globally unique)
- Region: Same as EC2/RDS
- Block Public Access: Keep enabled
- Encryption: Enable server-side encryption
- Versioning: Enable for data protection
```

### Step 2: EC2 Instance Setup

#### 2.1 Connect to EC2 Instance

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip
```

#### 2.2 Install Required Software

```bash
# Update system
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Docker
sudo yum install -y docker  # Amazon Linux
# OR
sudo apt install -y docker.io  # Ubuntu

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo yum install -y git  # Amazon Linux
# OR
sudo apt install -y git  # Ubuntu

# Install Node.js (for GitHub Actions runner)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs  # Amazon Linux
# OR
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs  # Ubuntu

# Log out and log back in for docker group to take effect
exit
```

#### 2.3 Setup GitHub Self-Hosted Runner

```bash
# SSH back into instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Create runner directory
mkdir actions-runner && cd actions-runner

# Download runner package
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract installer
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure runner (you'll get the token from GitHub)
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_RUNNER_TOKEN

# Install and start runner
sudo ./svc.sh install
sudo ./svc.sh start
```

### Step 3: GitHub Repository Setup

#### 3.1 Fork/Clone Repository

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/mentalspace-ehr.git
cd mentalspace-ehr
```

#### 3.2 Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/postgres?sslmode=require

# JWT Security (Generate strong secret)
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=production
PORT=7000
DEFAULT_PASSWORD=YourSecurePassword123!
DEFAULT_ADMIN_EMAIL=admin@yourdomain.com

# Email Configuration
EMAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=your-resend-api-key
FRONTEND_URL=https://yourdomain.com
PASSWORD_RESET_EXPIRATION_MINUTES=10

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=your-s3-bucket-name

# Google Workspace (Optional)
GOOGLE_WORKSPACE_DOMAIN=yourdomain.com
GOOGLE_CALENDAR_ID=your-calendar-id
GOOGLE_SERVICE_ACCOUNT=your-service-account-json

# OpenAI (Optional)
OPENAI_API_KEY=your-openai-api-key
```

### Step 4: Automatic Deployment

#### 4.1 Push Code to Trigger Deployment

```bash
# Make any changes and push to main branch
git add .
git commit -m "Initial deployment setup"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Build the application
2. Deploy to your EC2 instance
3. Start Docker containers
4. Run database migrations
5. Start the application

#### 4.2 Verify Deployment

```bash
# Check if containers are running
docker ps

# Check application logs
docker logs mentalspace-backend
docker logs mentalspace-frontend

# Test the application
curl http://your-ec2-ip/api/health
```

### Step 5: Domain and SSL Setup (Optional)

#### 5.1 Configure Domain

```bash
# Point your domain to EC2 instance IP
# A Record: yourdomain.com → EC2-IP
# CNAME: www.yourdomain.com → yourdomain.com
```

#### 5.2 Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo yum install -y certbot  # Amazon Linux
# OR
sudo apt install -y certbot  # Ubuntu

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update nginx configuration to use SSL
# (This will be handled by the deployment script)
```

## 🔧 Local Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL (for local development)

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/mentalspace-ehr.git
cd mentalspace-ehr

# Install dependencies
npm install

# Setup environment
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your local database credentials

# Run database migrations
npm run prisma:migrate

# Seed database
npm run db:seed
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Or run separately
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

### Access Applications

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:7000/api
- **API Documentation**: http://localhost:7000/api
- **Prisma Studio**: http://localhost:5555

## 🛠️ Available Scripts

### Root Level Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build all applications
- `npm run build:frontend` - Build frontend only
- `npm run build:backend` - Build backend only
- `npm run test` - Run all tests
- `npm run test:frontend` - Run frontend tests
- `npm run test:backend` - Run backend tests
- `npm run lint` - Lint all code
- `npm run lint:frontend` - Lint frontend code
- `npm run lint:backend` - Lint backend code
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database
- `npm run clean` - Clean all build artifacts
- `npm run clean:node_modules` - Remove all node_modules
- `npm run clean:dist` - Remove all build directories

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Zod** - Schema validation

### Backend
- **NestJS** - Enterprise Node.js framework
- **TypeScript** - Type-safe development
- **Prisma ORM** - Type-safe database client
- **JWT Authentication** - Secure token-based auth
- **Class Validator** - Decorator-based validation
- **Swagger/OpenAPI** - API documentation
- **PostgreSQL** - Robust relational database
- **AWS S3** - Scalable file storage

### Security & Compliance
- **bcrypt** - Password hashing
- **JWT** - Secure token authentication
- **Rate Limiting** - API protection
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Audit Logging** - Complete activity tracking
- **Data Encryption** - At rest and in transit

## 🔒 Security Features

### Authentication & Authorization
- JWT tokens with 15-minute expiration
- Refresh token rotation
- Account lockout after 5 failed attempts
- Role-based access control (RBAC)
- Strong password requirements (12+ characters)

### Data Protection
- Database encryption at rest (AWS RDS)
- SSL/TLS encryption in transit
- S3 file encryption
- PHI data classification
- Audit trail for all data access

### Infrastructure Security
- Docker containerization
- Non-root user execution
- Security headers (HSTS, CSP, etc.)
- Rate limiting and DDoS protection
- Regular security updates

## 📊 Monitoring & Health Checks

### Application Monitoring
- Health check endpoints (`/api/health`)
- Database connection monitoring
- Container health checks
- Error tracking and logging

### Infrastructure Monitoring
- Prometheus metrics collection
- Grafana dashboards
- Node Exporter for system metrics
- Docker container monitoring

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
docker logs mentalspace-backend | grep -i database

# Verify DATABASE_URL format
echo $DATABASE_URL
```

#### Container Issues
```bash
# Check container status
docker ps -a

# View container logs
docker logs mentalspace-backend --tail=100
docker logs mentalspace-frontend --tail=100

# Restart containers
docker-compose restart
```

#### GitHub Actions Deployment Issues
```bash
# Check runner status
sudo systemctl status actions.runner.*

# View runner logs
sudo journalctl -u actions.runner.* -f

# Restart runner
sudo systemctl restart actions.runner.*
```

### Performance Optimization

#### Database Optimization
- Enable connection pooling
- Add appropriate indexes
- Regular VACUUM and ANALYZE
- Monitor query performance

#### Application Optimization
- Enable gzip compression
- Implement caching strategies
- Optimize Docker images
- Use CDN for static assets

## 📚 API Documentation

Once deployed, access the interactive API documentation at:
- **Swagger UI**: `http://3.23.1.84/api`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Run linting (`npm run lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow HIPAA compliance requirements
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
- Contact the development team

---

**⚠️ Important**: This is a HIPAA-compliant healthcare application. Ensure all security measures are properly configured before handling any patient data. 
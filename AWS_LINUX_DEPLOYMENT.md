# MentalSpace EHR - AWS Linux Deployment Guide

## 🚀 Quick Setup for AWS Linux EC2

### Prerequisites
- AWS Linux EC2 instance (t3.micro or higher)
- Security group with ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 7000 (Backend)

### Step 1: Connect to Your EC2 Instance

```bash
# Connect via SSH
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

### Step 2: Run the Setup Script

```bash
# Download and run the setup script
curl -o setup-aws-linux.sh https://raw.githubusercontent.com/Yi-Jacob/mentalspace-ehr/main/setup-aws-linux.sh
chmod +x setup-aws-linux.sh
./setup-aws-linux.sh
```

### Step 3: Set Up GitHub Actions Runner

```bash
# Download and run the runner setup script
curl -o setup-runner-linux.sh https://raw.githubusercontent.com/Yi-Jacob/mentalspace-ehr/main/setup-runner-linux.sh
chmod +x setup-runner-linux.sh
./setup-runner-linux.sh
```

### Step 4: Configure the Runner

1. **Go to your GitHub repository**: Settings → Actions → Runners
2. **Click "New self-hosted runner"**
3. **Select Linux and x64**
4. **Copy the configuration token**
5. **Run the configuration command**:

```bash
cd /home/ec2-user/actions-runner
./config.sh --url https://github.com/Yi-Jacob/mentalspace-ehr --token YOUR_RUNNER_TOKEN
```

### Step 5: Install Runner as Service

```bash
# Install as a service
sudo ./svc.sh install
sudo ./svc.sh start

# Check if service is running
sudo systemctl status actions.runner.*
```

### Step 6: Test the Setup

```bash
# Log out and log back in for Docker group to take effect
exit
# Reconnect via SSH

# Test Docker
docker --version
docker-compose --version

# Test manual deployment
cd /home/ec2-user/mentalspace-ehr
docker-compose up -d --build
```

## 🎯 How DevOps Works

### Before (Manual):
```
You code → You manually deploy → You manually test
```

### After (DevOps):
```
You code → Push to GitHub → GitHub Actions automatically:
  1. Runs tests
  2. Builds Docker images  
  3. Deploys to EC2
  4. Sends notifications
```

## 📁 Directory Structure on EC2

```
/home/ec2-user/
├── mentalspace-ehr/          # Your application
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   ├── .env
│   └── apps/
└── actions-runner/           # GitHub Actions runner
    ├── config.sh
    ├── run.sh
    └── svc.sh
```

## 🔧 Manual Commands (if needed)

### Install Packages Manually:
```bash
sudo yum update -y
sudo yum install -y git docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
```

### Clone Repository Manually:
```bash
mkdir -p /home/ec2-user/mentalspace-ehr
cd /home/ec2-user/mentalspace-ehr
git clone https://github.com/Yi-Jacob/mentalspace-ehr.git .
```

### Create Environment File:
```bash
cat > .env << EOF
NODE_ENV=production
DATABASE_URL=postgresql://mentalspace:secure_password@localhost:5432/mentalspace
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
PORT=7000
POSTGRES_USER=mentalspace
POSTGRES_PASSWORD=secure_password
REDIS_PASSWORD=redis_password
EOF
```

## 🚀 Deploy Your Application

### First Time:
1. **Push your code to GitHub**
2. **Watch the Actions tab** - your workflow will run automatically
3. **Visit your app**: `http://YOUR_EC2_PUBLIC_IP`

### Subsequent Deployments:
```bash
# Just push code from your local machine
git add .
git commit -m "Add new feature"
git push origin main
# Everything else is automatic!
```

## 🔍 Troubleshooting

### Docker Installation Issues:

If you get "docker-compose not found" or "docker service not found":

**For Amazon Linux 2:**
```bash
# Try the updated setup script
./setup-aws-linux.sh
```

**For Amazon Linux 2023:**
```bash
# Use the alternative setup script
chmod +x setup-amazon-linux-2023.sh
./setup-amazon-linux-2023.sh
```

**Manual Docker Installation:**
```bash
# Install Docker manually
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose manually
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Check Runner Status:
```bash
sudo systemctl status actions.runner.*
```

### Check Application Logs:
```bash
cd /home/ec2-user/mentalspace-ehr
docker-compose logs -f
```

### Check Docker Status:
```bash
docker ps
docker-compose ps
```

### Restart Services:
```bash
sudo systemctl restart docker
sudo systemctl restart actions.runner.*
```

## 📊 Benefits of This Setup

- ✅ **Zero manual deployment**
- ✅ **Automatic testing before deployment**
- ✅ **Deployment history and rollback**
- ✅ **Notifications on success/failure**
- ✅ **Linux-native performance**
- ✅ **Easy scaling and maintenance**

## 🎉 You're Ready!

Once set up, you just need to:
1. **Develop locally**
2. **Push to GitHub**
3. **Watch the magic happen!**

Your application will be automatically deployed to your AWS Linux EC2 instance! 🚀 
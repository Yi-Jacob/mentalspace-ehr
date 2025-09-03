#!/bin/bash
# MentalSpace EHR Setup Script for AWS Linux
# Run this script on your AWS Linux EC2 instance

echo "🚀 Setting up MentalSpace EHR on AWS Linux..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install required packages
echo "📦 Installing required packages..."
sudo yum install -y git docker docker-compose

# Start and enable Docker
echo "🐳 Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group
echo "👤 Adding ec2-user to docker group..."
sudo usermod -a -G docker ec2-user

# Create project directory
echo "📁 Creating project directory..."
mkdir -p /home/ec2-user/mentalspace-ehr
cd /home/ec2-user/mentalspace-ehr

# Clone repository (replace YOUR_USERNAME with your GitHub username)
echo "📥 Cloning repository..."
git clone https://github.com/Yi-Jacob/mentalspace-ehr.git .

# Create environment file
echo "⚙️ Creating environment file..."
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

# Set proper permissions
echo "🔐 Setting permissions..."
chmod 600 .env

echo "✅ Setup completed! Please log out and log back in for Docker group to take effect."
echo "📝 Next steps:"
echo "1. Log out and log back in"
echo "2. Set up GitHub Actions runner"
echo "3. Push your code to GitHub" 
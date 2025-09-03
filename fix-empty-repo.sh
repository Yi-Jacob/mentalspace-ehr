#!/bin/bash
# Quick Fix: Initialize Git Repository on EC2
# Run this if your mentalspace-ehr folder is empty or has issues

echo "🔧 Fixing mentalspace-ehr directory..."

# Navigate to the directory
cd /home/ec2-user/mentalspace-ehr

# Check if directory is empty or not a git repository
if [ ! -d ".git" ]; then
  echo "📥 Directory is not a git repository. Cleaning and cloning from GitHub..."
  
  # Remove all files and hidden files
  rm -rf /home/ec2-user/mentalspace-ehr/*
  rm -rf /home/ec2-user/mentalspace-ehr/.* 2>/dev/null || true
  
  # Clone the repository
  git clone https://github.com/Yi-Jacob/mentalspace-ehr.git .
  
  # Verify the clone
  if [ -d ".git" ]; then
    echo "✅ Repository successfully cloned!"
    
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
    chmod 600 .env
    
    echo "✅ Git repository initialized and environment file created!"
    echo "🚀 You can now push code from your local machine and it will deploy automatically!"
  else
    echo "❌ Failed to clone repository"
    exit 1
  fi
else
  echo "✅ Git repository already exists!"
fi

echo "📝 Next steps:"
echo "1. Push code from your local machine"
echo "2. Watch the GitHub Actions tab"
echo "3. Your app will deploy automatically!" 
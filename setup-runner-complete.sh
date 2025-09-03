#!/bin/bash
# Complete GitHub Actions Runner Setup for AWS Linux
# This script handles the missing svc.sh file issue

echo "🤖 Setting up GitHub Actions Runner..."

# Create and navigate to runner directory
mkdir -p /home/ec2-user/actions-runner
cd /home/ec2-user/actions-runner

# Download and extract
echo "📥 Downloading runner..."
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

echo "📦 Extracting runner..."
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# List available files
echo "📁 Available files:"
ls -la

# Configure runner
echo "⚙️ Configuring runner..."
./config.sh --url https://github.com/Yi-Jacob/mentalspace-ehr --token AXCN7RPBBNLPSXFJBB67JUTIXC7PA

# Create systemd service (since svc.sh might not exist)
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/github-runner.service << EOF
[Unit]
Description=GitHub Actions Runner
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/actions-runner
ExecStart=/home/ec2-user/actions-runner/run.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
echo "🚀 Starting runner service..."
sudo systemctl daemon-reload
sudo systemctl enable github-runner
sudo systemctl start github-runner

# Check status
echo "📊 Checking service status..."
sudo systemctl status github-runner

echo "✅ Runner setup completed!"
echo "📝 To check logs: sudo journalctl -u github-runner -f"
echo "🔄 To restart: sudo systemctl restart github-runner"
echo "🛑 To stop: sudo systemctl stop github-runner" 
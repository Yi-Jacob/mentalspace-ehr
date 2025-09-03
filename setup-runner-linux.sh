#!/bin/bash
# GitHub Actions Runner Setup for AWS Linux
# Run this script after the main setup

echo "🤖 Setting up GitHub Actions Runner..."

# Create runner directory
mkdir -p /home/ec2-user/actions-runner
cd /home/ec2-user/actions-runner

# Download the runner
echo "📥 Downloading GitHub Actions runner..."
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract the installer
echo "📦 Extracting runner..."
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# List available files
echo "📁 Available files in runner directory:"
ls -la

# Configure the runner
echo "⚙️ Configuring runner..."
echo "Please run the following command with your actual token:"
echo "./config.sh --url https://github.com/Yi-Jacob/mentalspace-ehr --token AXCN7RPBBNLPSXFJBB67JUTIXC7PA"
echo ""
echo "After configuration, you can run the runner manually with:"
echo "./run.sh"
echo ""
echo "Or install as a systemd service with:"
echo "sudo ./svc.sh install"
echo "sudo ./svc.sh start" 
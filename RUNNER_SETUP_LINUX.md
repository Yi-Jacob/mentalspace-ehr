# GitHub Actions Runner Setup Guide for AWS Linux

## Step-by-Step Runner Setup

### 1. Download and Extract Runner

```bash
# Create runner directory
mkdir -p /home/ec2-user/actions-runner
cd /home/ec2-user/actions-runner

# Download the runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Check what files are available
ls -la
```

### 2. Configure the Runner

```bash
# Configure with your token
./config.sh --url https://github.com/Yi-Jacob/mentalspace-ehr --token AXCN7RPBBNLPSXFJBB67JUTIXC7PA
```

### 3. Run the Runner

You have two options:

#### Option A: Run Manually (for testing)
```bash
# Run the runner manually
./run.sh
```

#### Option B: Install as Systemd Service (recommended)
```bash
# Check if svc.sh exists
ls -la svc.sh

# If svc.sh exists, install as service
if [ -f "svc.sh" ]; then
    sudo ./svc.sh install
    sudo ./svc.sh start
    sudo systemctl status actions.runner.*
else
    echo "svc.sh not found. Running manually..."
    echo "To run in background: nohup ./run.sh &"
fi
```

### 4. Alternative: Create Systemd Service Manually

If `svc.sh` doesn't exist, create the service manually:

```bash
# Create systemd service file
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

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable github-runner
sudo systemctl start github-runner
sudo systemctl status github-runner
```

### 5. Verify Runner is Working

1. **Check service status:**
   ```bash
   sudo systemctl status github-runner
   ```

2. **Check logs:**
   ```bash
   sudo journalctl -u github-runner -f
   ```

3. **Check GitHub:** Go to your repository → Settings → Actions → Runners
   - Should show as "Idle" or "Online"

### 6. Troubleshooting

#### If runner shows "Offline":
```bash
# Check if service is running
sudo systemctl status github-runner

# Restart service
sudo systemctl restart github-runner

# Check logs for errors
sudo journalctl -u github-runner -n 50
```

#### If you need to remove the runner:
```bash
# Stop service
sudo systemctl stop github-runner
sudo systemctl disable github-runner

# Remove service file
sudo rm /etc/systemd/system/github-runner.service

# Remove runner from GitHub
./config.sh remove --token AXCN7RPBBNLPSXFJBB67JUTIXC7PA
```

### 7. Test the Complete Setup

Once the runner is running:

```bash
# Test manual deployment
cd /home/ec2-user/mentalspace-ehr
git pull origin main
docker-compose up -d --build
```

## Quick Setup Script

Run this complete setup:

```bash
#!/bin/bash
# Complete runner setup script

echo "🤖 Setting up GitHub Actions Runner..."

# Create and navigate to runner directory
mkdir -p /home/ec2-user/actions-runner
cd /home/ec2-user/actions-runner

# Download and extract
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure runner
./config.sh --url https://github.com/Yi-Jacob/mentalspace-ehr --token AXCN7RPBBNLPSXFJBB67JUTIXC7PA

# Create systemd service
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
sudo systemctl daemon-reload
sudo systemctl enable github-runner
sudo systemctl start github-runner

echo "✅ Runner setup completed!"
echo "📊 Check status: sudo systemctl status github-runner"
echo "📝 Check logs: sudo journalctl -u github-runner -f"
``` 
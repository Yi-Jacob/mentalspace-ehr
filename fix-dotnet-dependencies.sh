#!/bin/bash
# Fix .NET Core Dependencies for Amazon Linux 2023
# Run this script if you get .NET Core dependency errors

echo "🔧 Fixing .NET Core dependencies for Amazon Linux 2023..."

# Install required dependencies
echo "📦 Installing .NET Core dependencies..."
sudo dnf install -y libicu libgcc glibc-langpack-en

# Alternative: Install .NET Core 6.0 runtime
echo "📦 Installing .NET Core 6.0 runtime..."
sudo dnf install -y dotnet-runtime-6.0

# If the above doesn't work, try installing from Microsoft repository
echo "📦 Adding Microsoft repository..."
sudo dnf install -y wget
wget https://packages.microsoft.com/config/amazon-linux/2.0/packages-microsoft-prod.rpm -O packages-microsoft-prod.rpm
sudo rpm -i packages-microsoft-prod.rpm

# Install .NET Core 6.0
echo "📦 Installing .NET Core 6.0 from Microsoft repo..."
sudo dnf install -y dotnet-runtime-6.0

# Verify installation
echo "✅ Verifying .NET Core installation..."
dotnet --version

echo "✅ .NET Core dependencies fixed!"
echo "🔄 Now try configuring the runner again:"
echo "./config.sh --url https://github.com/Yi-Jacob/mentalspace-ehr --token AXCN7RPBBNLPSXFJBB67JUTIXC7PA" 
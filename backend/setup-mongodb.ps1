# MongoDB Quick Setup Script for Windows
# Run this in PowerShell as Administrator

Write-Host "🍄 MongoDB Setup for my-shroom-store" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Magenta
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "❌ This script needs to run as Administrator!" -ForegroundColor Red
    Write-Host "   Right-click PowerShell and 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Function to check if MongoDB is installed
function Test-MongoInstalled {
    try {
        $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
        return $service -ne $null
    }
    catch {
        return $false
    }
}

# Function to check if MongoDB is running
function Test-MongoRunning {
    try {
        $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
        return $service.Status -eq "Running"
    }
    catch {
        return $false
    }
}

# Check current MongoDB status
Write-Host "🔍 Checking MongoDB status..." -ForegroundColor Blue

if (Test-MongoInstalled) {
    Write-Host "✅ MongoDB is installed" -ForegroundColor Green
    
    if (Test-MongoRunning) {
        Write-Host "✅ MongoDB is running" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 MongoDB is ready! You can test with:" -ForegroundColor Green
        Write-Host "   cd c:\Users\Christopher\Documents\Mushroom\my-shroom-store\backend" -ForegroundColor Cyan
        Write-Host "   node test-mongodb.js" -ForegroundColor Cyan
        Read-Host "Press Enter to exit"
        exit 0
    }
    else {
        Write-Host "⚠️  MongoDB is installed but not running" -ForegroundColor Yellow
        Write-Host "🔧 Starting MongoDB service..." -ForegroundColor Blue
        
        try {
            Start-Service -Name "MongoDB"
            Write-Host "✅ MongoDB service started successfully!" -ForegroundColor Green
            
            # Wait a moment for service to fully start
            Start-Sleep -Seconds 3
            
            Write-Host ""
            Write-Host "🎉 MongoDB is now ready! Test with:" -ForegroundColor Green
            Write-Host "   cd c:\Users\Christopher\Documents\Mushroom\my-shroom-store\backend" -ForegroundColor Cyan
            Write-Host "   node test-mongodb.js" -ForegroundColor Cyan
            Read-Host "Press Enter to exit"
            exit 0
        }
        catch {
            Write-Host "❌ Failed to start MongoDB service: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}
else {
    Write-Host "❌ MongoDB is not installed" -ForegroundColor Red
}

Write-Host ""
Write-Host "📦 MongoDB Installation Options:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Download and Install MongoDB Community Server" -ForegroundColor Cyan
Write-Host "   1. Visit: https://www.mongodb.com/try/download/community" -ForegroundColor White
Write-Host "   2. Download Windows x64 version" -ForegroundColor White
Write-Host "   3. Run installer with default settings" -ForegroundColor White
Write-Host "   4. Choose 'Install MongoDB as a Service'" -ForegroundColor White
Write-Host "   5. Install MongoDB Compass (optional GUI)" -ForegroundColor White
Write-Host ""

Write-Host "Option 2: Use Chocolatey Package Manager" -ForegroundColor Cyan
Write-Host "   1. Install Chocolatey if not installed:" -ForegroundColor White
Write-Host "      Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor Gray
Write-Host "   2. Install MongoDB:" -ForegroundColor White
Write-Host "      choco install mongodb" -ForegroundColor Gray
Write-Host ""

Write-Host "Option 3: Use Docker (Advanced)" -ForegroundColor Cyan
Write-Host "   docker run -d -p 27017:27017 --name mushroom-mongo mongo:latest" -ForegroundColor Gray
Write-Host ""

Write-Host "Option 4: MongoDB Atlas (Cloud - Recommended for Production)" -ForegroundColor Cyan
Write-Host "   1. Visit: https://cloud.mongodb.com" -ForegroundColor White
Write-Host "   2. Create free account and cluster" -ForegroundColor White
Write-Host "   3. Get connection string" -ForegroundColor White
Write-Host "   4. Update MONGODB_URI in .env file" -ForegroundColor White
Write-Host ""

# Offer to try Chocolatey installation
Write-Host "💡 Would you like to try installing MongoDB via Chocolatey? (y/N)" -ForegroundColor Yellow
$choice = Read-Host

if ($choice -eq "y" -or $choice -eq "Y") {
    Write-Host ""
    Write-Host "🔧 Installing MongoDB via Chocolatey..." -ForegroundColor Blue
    
    # Check if Chocolatey is installed
    try {
        $chocoPath = Get-Command choco -ErrorAction SilentlyContinue
        if (-not $chocoPath) {
            Write-Host "📦 Installing Chocolatey first..." -ForegroundColor Yellow
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
            
            # Refresh environment
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        }
        
        Write-Host "📦 Installing MongoDB..." -ForegroundColor Yellow
        choco install mongodb -y
        
        Write-Host "🔧 Starting MongoDB service..." -ForegroundColor Blue
        Start-Service -Name "MongoDB"
        
        Write-Host ""
        Write-Host "🎉 MongoDB installation completed!" -ForegroundColor Green
        Write-Host "✅ Service is running" -ForegroundColor Green
        
    }
    catch {
        Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Please try manual installation instead." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Install MongoDB using one of the options above" -ForegroundColor White
Write-Host "2. Ensure MongoDB service is running" -ForegroundColor White
Write-Host "3. Test connection:" -ForegroundColor White
Write-Host "   cd c:\Users\Christopher\Documents\Mushroom\my-shroom-store\backend" -ForegroundColor Cyan
Write-Host "   node test-mongodb.js" -ForegroundColor Cyan
Write-Host "4. Seed database with sample data:" -ForegroundColor White
Write-Host "   npm run seed" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"

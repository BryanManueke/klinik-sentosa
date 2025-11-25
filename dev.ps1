# Auto-install and run development server
# This script checks if dependencies are installed and installs them if needed

Write-Host "Klinik Sentosa - Development Server" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if node_modules exists
function Test-NodeModules {
    param([string]$Path)
    return Test-Path (Join-Path $Path "node_modules")
}

# Function to install dependencies
function Install-Dependencies {
    param([string]$Path, [string]$Name)
    
    Write-Host "Installing dependencies for $Name..." -ForegroundColor Yellow
    Push-Location $Path
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies for $Name" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
    Write-Host "Dependencies installed for $Name" -ForegroundColor Green
    Write-Host ""
}

# Check and install root dependencies
if (-not (Test-NodeModules ".")) {
    Install-Dependencies "." "Root"
} else {
    Write-Host "Root dependencies already installed" -ForegroundColor Green
}

# Check and install backend dependencies
if (-not (Test-NodeModules "backend")) {
    Install-Dependencies "backend" "Backend"
} else {
    Write-Host "Backend dependencies already installed" -ForegroundColor Green
}

# Check and install frontend dependencies
if (-not (Test-NodeModules "frontend")) {
    Install-Dependencies "frontend" "Frontend"
} else {
    Write-Host "Frontend dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "All dependencies are ready!" -ForegroundColor Green
Write-Host "Starting development servers..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend akan berjalan di: http://localhost:8080" -ForegroundColor Yellow
Write-Host "Backend akan berjalan di: http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Gray
Write-Host ""

# Run the development server
npm run dev:manual

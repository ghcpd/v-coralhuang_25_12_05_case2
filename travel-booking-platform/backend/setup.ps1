# Quick Setup Script for Backend

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Travel Booking Platform - Backend Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Navigate to backend directory
Set-Location -Path $PSScriptRoot

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Please edit .env file with your actual credentials!" -ForegroundColor Red
    Write-Host "  - DATABASE_URL (PostgreSQL connection string)" -ForegroundColor Yellow
    Write-Host "  - JWT_SECRET (random secret key)" -ForegroundColor Yellow
    Write-Host "  - STRIPE_SECRET_KEY (from stripe.com)" -ForegroundColor Yellow
    Write-Host ""
}

# Initialize Prisma
Write-Host "Setting up database..." -ForegroundColor Yellow
Write-Host "NOTE: Make sure PostgreSQL is running!" -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Do you have PostgreSQL running? (y/n)"
if ($continue -eq "y") {
    Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
    
    Write-Host "Running database migrations..." -ForegroundColor Yellow
    npx prisma migrate dev --name init
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database setup complete" -ForegroundColor Green
        
        Write-Host ""
        $seed = Read-Host "Do you want to seed the database with sample data? (y/n)"
        if ($seed -eq "y") {
            Write-Host "Seeding database..." -ForegroundColor Yellow
            npx ts-node prisma/seed.ts
            Write-Host "✓ Database seeded with sample data" -ForegroundColor Green
            Write-Host ""
            Write-Host "Demo login credentials:" -ForegroundColor Cyan
            Write-Host "  Email: demo@travel.com" -ForegroundColor White
            Write-Host "  Password: demo123" -ForegroundColor White
        }
    }
} else {
    Write-Host ""
    Write-Host "Please start PostgreSQL and run:" -ForegroundColor Yellow
    Write-Host "  npx prisma migrate dev --name init" -ForegroundColor White
    Write-Host "  npx ts-node prisma/seed.ts" -ForegroundColor White
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the backend server, run:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Backend will be available at:" -ForegroundColor Yellow
Write-Host "  http://localhost:5000" -ForegroundColor White
Write-Host ""

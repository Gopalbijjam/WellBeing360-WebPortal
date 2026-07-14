# WellBeing360 Microservices Orchestrator Launch Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       WellBeing360 Platform Orchestrated Startup         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Detect .NET 10 SDK path (prefer local/dotnet-install path if present)
$dotnetCmd = "dotnet"
$localDotnet = "$env:LocalAppData\Microsoft\dotnet\dotnet.exe"
if (Test-Path $localDotnet) {
    $dotnetCmd = "`"$localDotnet`""
    Write-Host "Detected local .NET 10 SDK. Using: $localDotnet" -ForegroundColor Gray
}

# 1. Start each C# Backend service in a new separate console window
Write-Host "[1/6] Launching WellBeing360.IdentityService on Port 5001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting IdentityService...'; & $dotnetCmd run --project backend/WellBeing360.IdentityService/WellBeing360.IdentityService.Api/WellBeing360.IdentityService.Api.csproj"

Start-Sleep -Seconds 2

Write-Host "[2/6] Launching WellBeing360.BenefitsService on Port 5002..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting BenefitsService...'; & $dotnetCmd run --project backend/WellBeing360.BenefitsService/WellBeing360.BenefitsService.Api/WellBeing360.BenefitsService.Api.csproj"

Start-Sleep -Seconds 2

Write-Host "[3/6] Launching WellBeing360.WellnessService on Port 5003..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting WellnessService...'; & $dotnetCmd run --project backend/WellBeing360.WellnessService/WellBeing360.WellnessService.Api/WellBeing360.WellnessService.Api.csproj"

Start-Sleep -Seconds 2

Write-Host "[4/6] Launching WellBeing360.RewardsService on Port 5008..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting RewardsService...'; & $dotnetCmd run --project backend/WellBeing360.RewardsService/WellBeing360.RewardsService.Api/WellBeing360.RewardsService.Api.csproj"

Start-Sleep -Seconds 2

Write-Host "[5/6] Launching YARP API Gateway on Port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting YARP API Gateway...'; & $dotnetCmd run --project backend/WellBeing360.ApiGateway/WellBeing360.ApiGateway.csproj"

Start-Sleep -Seconds 3

# 2. Start React frontend dev server
Write-Host "[6/6] Launching React Client Development Server on Port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; Write-Host 'Starting React Frontend client...'; npm run dev"

Write-Host "----------------------------------------------------------" -ForegroundColor Green
Write-Host "All components are launching in separate shell processes!" -ForegroundColor Green
Write-Host "You can access the services at the following URLs:" -ForegroundColor White
Write-Host "  - React Web Client:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  - API Gateway Proxy: http://localhost:5000" -ForegroundColor Cyan
Write-Host "  - Identity Swagger:  http://localhost:5001/swagger" -ForegroundColor Cyan
Write-Host "  - Benefits Swagger:  http://localhost:5002/swagger" -ForegroundColor Cyan
Write-Host "  - Wellness Swagger:  http://localhost:5003/swagger" -ForegroundColor Cyan
Write-Host "  - Rewards Swagger:   http://localhost:5008/swagger" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Press any key to close this orchestrator launcher window (services will remain running)..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

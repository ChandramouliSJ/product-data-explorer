# Full-stack start script for Product Data Explorer
# Handles frontend and backend automatically, even with spaces in folder names

# Set execution policy for this session
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

# Define paths
$RootPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$BackendPath = Join-Path $RootPath "backend"
$FrontendPath = Join-Path $RootPath "frontend"

Write-Host "Starting Product Data Explorer full-stack..." -ForegroundColor Cyan

# Start Backend
Write-Host "`nStarting backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command `"cd `"$BackendPath`"; npm install; npm run dev`"" 

# Start Frontend
Write-Host "`nStarting frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command `"cd `"$FrontendPath`"; npm install; npm run dev`"" 

Write-Host "`nAll processes started. Two separate PowerShell windows will open." -ForegroundColor Cyan

# 1️⃣ Fix backend tsconfig.json
$tsconfigPath = "C:\Users\Chandra Mouli S J\Projects\ProductDataExplorerSetup\product-data-explorer\backend\tsconfig.json"

$tsconfigContent = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": ".",
    "outDir": "dist",
    "strict": false,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true
  },
  "include": ["src", "worker.ts", "prisma"]
}
"@

$tsconfigContent | Set-Content -Path $tsconfigPath -Encoding UTF8
Write-Host "✅ tsconfig.json fixed"

# 2️⃣ Clear npm cache
npm cache clean --force
Write-Host "✅ npm cache cleared"

# 3️⃣ Install backend dev dependencies
cd "C:\Users\Chandra Mouli S J\Projects\ProductDataExplorerSetup\product-data-explorer\backend"
npm install
npm install --save-dev nodemon ts-node
Write-Host "✅ Backend dependencies installed"

# 4️⃣ Install frontend dependencies
cd "..\frontend"
npm install
Write-Host "✅ Frontend dependencies installed"

# 5️⃣ Start backend in a new terminal
Write-Host "`n🚀 Starting backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Chandra Mouli S J\Projects\ProductDataExplorerSetup\product-data-explorer\backend'; npm run dev"

# 6️⃣ Start frontend in a new terminal
Write-Host "🚀 Starting frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Chandra Mouli S J\Projects\ProductDataExplorerSetup\product-data-explorer\frontend'; npm run dev"

# 7️⃣ Wait a few seconds and open browser to frontend
Start-Sleep -Seconds 8
Start-Process "http://localhost:3000"

Write-Host "`n🎉 Setup complete! Backend and Frontend are running, frontend opened in browser."

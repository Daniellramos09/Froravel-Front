# Script de Inicialização Simultânea - Florável Ecossistema Integrado

Write-Host "========================================================" -ForegroundColor Magenta
Write-Host "   INICIALIZANDO ECOSSISTEMA FLORÁVEL - DEMO DAY" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Magenta
Write-Host ""

Write-Host "[1/3] Iniciando Landing Page e Dashboard B2B (Porta 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd FloravelFront; npm run dev"

Write-Host "[2/3] Iniciando Espaço da Mãe - FloravelApp (Porta 5174)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd FloravelApp; npm run dev"

Write-Host "[3/3] Iniciando Portal do Terapeuta - TerapeutaApp (Porta 5175)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd TerapeutaApp; npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Magenta
Write-Host "   TODAS AS INTERFACES ESTÃO CONECTADAS!" -ForegroundColor Green
Write-Host "   Landing Page:          http://localhost:5173" -ForegroundColor White
Write-Host "   Espaço da Mãe:         http://localhost:5174" -ForegroundColor White
Write-Host "   Portal do Terapeuta:   http://localhost:5175" -ForegroundColor White
Write-Host "   Dashboard RH:          http://localhost:5173/dashboard-rh" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Magenta


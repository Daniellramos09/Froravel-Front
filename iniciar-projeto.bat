@echo off
echo ========================================================
echo   INICIALIZANDO ECOSSISTEMA FLORAVEL - DEMO DAY
echo ========================================================
echo.
echo [1/4] Iniciando Landing Page (Porta 5173)...
start cmd /k "title FloravelFront (Landing) && cd FloravelFront && npm run dev"

echo [2/4] Iniciando Espaco da Mae - FloravelApp (Porta 5174)...
start cmd /k "title FloravelApp (Espaco da Mae) && cd FloravelApp && npm run dev"

echo [3/4] Iniciando Portal do Terapeuta - TerapeutaApp (Porta 5175)...
start cmd /k "title TerapeutaApp (Portal do Terapeuta) && cd TerapeutaApp && npm run dev"

echo [4/4] Iniciando Dashboard RH - DashboardRh (Porta 5176)...
start cmd /k "title DashboardRh (Dashboard RH) && cd DashboardRh && npm run dev"

echo.
echo ========================================================
echo   TODOS OS SERVIDORES FORAM DISPARADOS!
echo   Landing Page:          http://localhost:5173
echo   Espaco da Mae:         http://localhost:5174
echo   Portal do Terapeuta:   http://localhost:5175
echo   Dashboard RH:          http://localhost:5176
echo ========================================================
pause


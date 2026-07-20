@echo off
:: Script de inicialización automatizada para el proyecto ARIONS Web
:: Inicia el Backend (Node.js + Express) y el Frontend (React + Vite) en ventanas independientes.

title ARIONS WEB - ASISTENTE DE INICIO
color 0A

:: Limpiar variable DATABASE_URL de la sesión actual por si estaba corrupta en memoria
set "DATABASE_URL="

echo ===================================================
echo   INICIANDO CONFIGURACION Y DESARROLLO ARIONS WEB
echo ===================================================
echo.

:: 1. CONFIGURACIÓN E INICIO DEL BACKEND
echo [INFO] Iniciando Terminal 1: Backend (Node.js + Express API)...
echo [INFO] El backend estara disponible en http://localhost:5000
echo [INFO] Documentacion API en http://localhost:5000/api/v1/docs
echo.

start "ARIONS - Backend API" cmd /k "cd /d c:\arions_web\backend && echo [BACKEND] Instalando dependencias... && npm install && echo [BACKEND] Generando Prisma Client... && npx prisma generate && echo [BACKEND] Ejecutando migracion de DB... && npx prisma db push && echo [BACKEND] Ejecutando seed de datos... && npm run prisma:seed && echo [BACKEND] Iniciando servidor Express... && npm run dev"

:: 2. CONFIGURACIÓN E INICIO DEL FRONTEND
echo [INFO] Iniciando Terminal 2: Frontend (React 19 + Vite)...
echo [INFO] El frontend estara disponible en http://localhost:5173
echo.

start "ARIONS - Frontend React" cmd /k "cd /d c:\arions_web\frontend && echo [FRONTEND] Instalando dependencias... && npm install && echo [FRONTEND] Iniciando entorno React 19 + Vite... && npm run dev"

echo ===================================================
echo   PROCESO DE INICIO COMPLETADO EXITOSAMENTE
echo ===================================================
echo Ambas terminales se han abierto en ventanas independientes.
echo.
pause
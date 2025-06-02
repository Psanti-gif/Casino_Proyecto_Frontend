@echo off
REM Script para instalar dependencias y arrancar el proyecto Next.js

REM Instalar dependencias
call npm install

REM Arrancar el proyecto
call npm run dev

pause

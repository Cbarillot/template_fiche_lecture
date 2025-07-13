@echo off
setlocal enabledelayedexpansion

REM Configuration
set PROJECT_DIR=project
set DEFAULT_PORT=5173
set BROWSER_DELAY=3
set BROWSER_URL=http://localhost:5173

chcp 65001 > nul
title Template Fiche Lecture - Launcher
color 0A

echo.
echo ==========================================
echo    Template Fiche Lecture - Launcher
echo ==========================================
echo.

REM Vérifier si Node.js est installé
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installé
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si npm est installé
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] npm n'est pas installé
    pause
    exit /b 1
)

REM Vérifier si le dossier project existe
if not exist "%PROJECT_DIR%" (
    echo [ERREUR] Le dossier '%PROJECT_DIR%' n'existe pas
    pause
    exit /b 1
)

echo [INFO] Préparation du lancement...
cd /d "%PROJECT_DIR%"

REM Installation des dépendances si nécessaire
if not exist "node_modules" (
    echo [INFO] Installation des dépendances...
    npm install --silent
    if !errorlevel! neq 0 (
        echo [ERREUR] Échec de l'installation
        pause
        exit /b 1
    )
)

REM Démarrage du serveur en arrière-plan
echo [INFO] Démarrage du serveur...
echo [INFO] L'application sera accessible sur %BROWSER_URL%
echo.

REM Lancer le serveur et ouvrir le navigateur automatiquement
start /b npm run dev

REM Attendre que le serveur soit prêt et ouvrir le navigateur
echo [INFO] Ouverture du navigateur dans %BROWSER_DELAY% secondes...
timeout /t %BROWSER_DELAY% /nobreak > nul

REM Ouvrir le navigateur
start "" "%BROWSER_URL%"

echo.
echo [INFO] Application lancée avec succès!
echo [INFO] Appuyez sur Ctrl+C dans cette fenêtre pour arrêter le serveur
echo [INFO] Ou fermez simplement cette fenêtre
echo.

REM Attendre que l'utilisateur ferme la fenêtre ou appuie sur une touche
pause > nul

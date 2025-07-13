@echo off
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
    echo [ERREUR] Node.js n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Vérifier si npm est installé
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] npm n'est pas installé ou n'est pas dans le PATH
    echo.
    pause
    exit /b 1
)

REM Se déplacer dans le dossier project
if not exist "project" (
    echo [ERREUR] Le dossier 'project' n'existe pas
    echo Assurez-vous que ce script est à la racine du repository
    echo.
    pause
    exit /b 1
)

cd project

echo [INFO] Vérification des dépendances...
if not exist "node_modules" (
    echo [INFO] Installation des dépendances...
    npm install
    if %errorlevel% neq 0 (
        echo [ERREUR] Échec de l'installation des dépendances
        echo.
        pause
        exit /b 1
    )
) else (
    echo [INFO] Dépendances déjà installées
)

echo.
echo [INFO] Démarrage du serveur de développement...
echo [INFO] L'application sera accessible sur http://localhost:5173
echo [INFO] Appuyez sur Ctrl+C pour arrêter le serveur
echo.

npm run dev

echo.
echo [INFO] Serveur arrêté
pause
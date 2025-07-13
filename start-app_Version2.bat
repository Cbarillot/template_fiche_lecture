@echo off
setlocal enabledelayedexpansion

REM Gestion des paramètres spéciaux
if "%1"==":open_browser" (
    call :open_browser %2
    exit /b 0
)

REM Pas besoin de privilèges administrateur pour ce script
REM if not "%1"=="am_admin" (
REM     echo [INFO] Démarrage avec privilèges élevés...
REM     powershell start -verb runas '%0' am_admin & exit
REM )

chcp 65001 > nul
title Template Fiche Lecture - Launcher
color 0A

echo.
echo ==========================================
echo    Template Fiche Lecture - Launcher
echo ==========================================
echo.
echo [INFO] Initialisation du launcher...

REM Configuration
set PROJECT_DIR=project
set DEFAULT_PORT=5173
set NODE_MIN_VERSION=16
set BROWSER_DELAY=3
set LOG_FILE=launcher.log

REM Sauvegarder le répertoire de départ AVANT toute opération
set ORIGINAL_DIR=%CD%

REM Créer le fichier de log avec timestamp
echo [%date% %time%] Launcher démarré > "%LOG_FILE%"

REM Fonction pour vérifier la version de Node.js
for /f "tokens=1 delims=." %%i in ('node --version 2^>nul') do (
    set NODE_VERSION=%%i
    set NODE_VERSION=!NODE_VERSION:~1!
)

REM Vérifications préliminaires
call :check_node
call :check_npm
call :check_project_dir
call :check_port_available

REM Démarrage rapide
echo [INFO] Démarrage en cours...
cd /d "%PROJECT_DIR%"

REM Installation/mise à jour des dépendances en arrière-plan si nécessaire
if not exist "node_modules" (
    echo [INFO] Installation des dépendances...
    call :log_message "Installation des dépendances"
    npm install --silent
    if !errorlevel! neq 0 (
        echo [ERREUR] Échec de l'installation des dépendances
        call :log_message "ERREUR: Échec installation dépendances"
        pause
        exit /b 1
    )
) else (
    REM Vérification rapide si package.json a été modifié
    for %%i in (package.json) do set PKG_TIME=%%~ti
    for %%i in (node_modules) do set NODE_TIME=%%~ti
    if "!PKG_TIME!" gtr "!NODE_TIME!" (
        echo [INFO] Mise à jour des dépendances...
        call :log_message "Mise à jour des dépendances"
        npm install --silent
    ) else (
        echo [INFO] Dépendances à jour
    )
)

REM Vérifier que le script de démarrage existe
if not exist "package.json" (
    echo [ERREUR] package.json introuvable
    pause
    exit /b 1
)

REM Vérifier la commande dev
findstr "\"dev\"" package.json >nul
if %errorlevel% neq 0 (
    echo [AVERTISSEMENT] Script 'dev' non trouvé dans package.json
    echo Tentative avec 'npm start'...
    set DEV_COMMAND=start
) else (
    set DEV_COMMAND=dev
)

REM Ouverture automatique du navigateur après un délai
echo [INFO] Ouverture sur Google Chrome dans %BROWSER_DELAY% secondes...
REM Créer un script temporaire pour ouvrir Chrome
echo @echo off > "%TEMP%\open_chrome.bat"
echo timeout /t %BROWSER_DELAY% ^>nul >> "%TEMP%\open_chrome.bat"
echo start chrome.exe --new-window http://localhost:%DEFAULT_PORT% >> "%TEMP%\open_chrome.bat"
echo del "%TEMP%\open_chrome.bat" >> "%TEMP%\open_chrome.bat"
start /min "%TEMP%\open_chrome.bat"

echo.
echo ==========================================
echo [INFO] Serveur de développement démarré
echo [INFO] URL: http://localhost:%DEFAULT_PORT%
echo [INFO] Le navigateur va s'ouvrir automatiquement...
echo.
echo [RACCOURCIS]
echo   Ctrl+C  : Arrêter le serveur
echo   Ctrl+L  : Effacer l'écran
echo   R + Entrée : Recharger l'app
echo ==========================================
echo.

call :log_message "Serveur démarré sur le port %DEFAULT_PORT%"

REM Démarrage du serveur
npm run %DEV_COMMAND%

echo.
echo [INFO] Serveur arrêté
call :log_message "Serveur arrêté"
call :cleanup
timeout /t 2 >nul
exit /b 0

REM =================== FONCTIONS ===================

:log_message
echo [%date% %time%] %~1 >> "%ORIGINAL_DIR%\%LOG_FILE%"
goto :eof

:cleanup
echo [INFO] Nettoyage...
REM Retourner au répertoire original
cd /d "%ORIGINAL_DIR%"
goto :eof

:check_port_available
netstat -an | findstr ":%DEFAULT_PORT%" >nul 2>nul
if %errorlevel% equ 0 (
    echo [AVERTISSEMENT] Le port %DEFAULT_PORT% semble déjà utilisé
    echo Tentative de démarrage quand même...
    echo Si le serveur ne démarre pas, vérifiez les processus actifs
    echo.
    timeout /t 3 >nul
)
goto :eof

:check_node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installé
    echo.
    echo Solutions automatiques:
    echo 1. Télécharger depuis https://nodejs.org/
    echo 2. Ou installer via Chocolatey: choco install nodejs
    echo 3. Ou installer via Scoop: scoop install nodejs
    echo.
    echo Voulez-vous ouvrir le site officiel ? (O/N)
    set /p choice=
    if /i "!choice!"=="O" start https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier la version minimale
for /f "tokens=1 delims=." %%i in ('node --version 2^>nul') do (
    set NODE_VERSION=%%i
    set NODE_VERSION=!NODE_VERSION:~1!
)
if defined NODE_VERSION (
    if !NODE_VERSION! lss %NODE_MIN_VERSION% (
        echo [AVERTISSEMENT] Node.js v!NODE_VERSION! détecté
        echo Version recommandée: v%NODE_MIN_VERSION% ou supérieure
        echo.
        timeout /t 2 >nul
    ) else (
        echo [OK] Node.js v!NODE_VERSION! détecté
    )
)
goto :eof

:check_npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] npm n'est pas disponible
    echo npm est normalement installé avec Node.js
    echo.
    pause
    exit /b 1
) else (
    echo [OK] npm disponible
)
goto :eof

:check_project_dir
if not exist "%ORIGINAL_DIR%\%PROJECT_DIR%" (
    echo [ERREUR] Le dossier '%PROJECT_DIR%' n'existe pas
    echo.
    echo Solutions:
    echo 1. Vérifiez que ce script est à la racine du projet
    echo 2. Créez le dossier manuellement
    echo 3. Ou modifiez la variable PROJECT_DIR dans ce script
    echo.
    echo Répertoire actuel: %ORIGINAL_DIR%
    echo Dossiers disponibles:
    dir /ad /b "%ORIGINAL_DIR%" 2>nul
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Dossier projet trouvé
)
goto :eof

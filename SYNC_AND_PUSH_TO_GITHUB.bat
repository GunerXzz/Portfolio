@echo off
setlocal enabledelayedexpansion
title GunerXzz GitHub Sync Tool

echo ==============================================================================
echo                 GUNERXZZ GITHUB AUTOMATED SYNC TOOL
echo ==============================================================================
echo This tool will:
echo   1. Commit and push this Portfolio project to https://github.com/GunerXzz/Portfolio
echo   2. Update your Profile README on https://github.com/GunerXzz/GunerXzz
echo.
echo Press any key to start...
pause >nul
echo.

cd /d "%~dp0"

echo ------------------------------------------------------------------------------
echo [STEP 1/2] Syncing and Uploading Portfolio Project to GitHub...
echo ------------------------------------------------------------------------------

git init
git add .
git commit -m "feat: complete portfolio with GunerXzz repos and editorial theme"
git branch -M main

:: Check remote origin
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Setting remote origin: https://github.com/GunerXzz/Portfolio.git
    git remote add origin https://github.com/GunerXzz/Portfolio.git
) else (
    echo [*] Updating remote origin: https://github.com/GunerXzz/Portfolio.git
    git remote set-url origin https://github.com/GunerXzz/Portfolio.git
)

echo [*] Pushing Portfolio to origin main...
git push -u origin main
if %errorlevel% equ 0 (
    echo [OK] Portfolio project successfully pushed to GitHub!
) else (
    echo [!] Notice: If the repo doesn't exist yet on GitHub, please create
    echo     an empty repository named 'Portfolio' at https://github.com/new
)

echo.
echo ------------------------------------------------------------------------------
echo [STEP 2/2] Updating GunerXzz Profile README (GunerXzz/GunerXzz)...
echo ------------------------------------------------------------------------------

set "SYNC_TEMP=%TEMP%\GunerXzz_Profile_%RANDOM%"
mkdir "%SYNC_TEMP%"
cd /d "%SYNC_TEMP%"

echo [*] Cloning your GitHub profile repository (GunerXzz/GunerXzz)...
git clone https://github.com/GunerXzz/GunerXzz.git .
if %errorlevel% neq 0 (
    echo [!] Could not clone GunerXzz/GunerXzz. Checking out fresh...
    git init
    git remote add origin https://github.com/GunerXzz/GunerXzz.git
    git fetch
    git checkout -b main origin/main 2>nul || git checkout -b main
)

echo [*] Applying new Editorial Portfolio Themed README and Custom SVG Assets...
copy /y "%~dp0GITHUB_PROFILE_README.md" "README.md"
if not exist "assets" mkdir "assets"
xcopy /s /e /y "%~dp0assets" "assets\"

git add README.md assets
git commit -m "feat(profile): revamp profile README with bespoke editorial SVG theme and architecture blueprint"
git push origin main
if %errorlevel% equ 0 (
    echo [OK] Your GitHub profile homepage README has been successfully updated!
) else (
    echo [!] Could not push directly. You can copy the contents of GITHUB_PROFILE_README.md
    echo     to https://github.com/GunerXzz/GunerXzz/edit/main/README.md manually.
)

:: Cleanup
cd /d "%~dp0"
rmdir /s /q "%SYNC_TEMP%" 2>nul

echo.
echo ==============================================================================
echo                               SYNC COMPLETED!
echo ==============================================================================
echo Check your updated profile: https://github.com/GunerXzz
echo Check your portfolio repo:  https://github.com/GunerXzz/Portfolio
echo.
pause

@echo off
echo ========================================================
echo   Uploading Portfolio Project to GunerXzz on GitHub
echo ========================================================
echo.

cd /d "%~dp0"

echo 1. Checking git status...
git status
echo.

echo 2. Adding all project files (safe with .gitignore)...
git add .
echo.

echo 3. Creating commit...
git commit -m "feat: update portfolio with GunerXzz GitHub repos, theme, and profile README"
echo.

echo 4. Setting branch to main...
git branch -M main
echo.

echo --------------------------------------------------------
echo If you have already created a repository on GitHub (e.g., 'Portfolio' or 'my-portfolio'):
echo Run: git remote add origin https://github.com/GunerXzz/Portfolio.git
echo (or git remote set-url origin https://github.com/GunerXzz/Portfolio.git if origin exists)
echo.
echo Then push with:
echo git push -u origin main
echo --------------------------------------------------------
echo.

pause

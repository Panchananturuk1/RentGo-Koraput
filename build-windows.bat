@echo off
echo Cleaning up Next.js build directory...

REM Try to remove the .next directory
rmdir /s /q .next 2>nul
if exist .next (
  echo Warning: Could not fully remove .next directory
) else (
  echo Successfully removed .next directory
)

echo Starting Next.js build...
call next build

if %ERRORLEVEL% NEQ 0 (
  echo Build failed with error code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
) else (
  echo Build completed successfully!
) 
@echo off
chcp 65001 >nul
echo ========================================================
echo   ระบบส่งข้อมูลขึ้น GitHub (Moral Teaching Monk System)
echo   Repository: https://github.com/yutthapoom32-droid/mos.git
echo ========================================================
echo.

:: 1. ตรวจสอบว่ามี Git หรือไม่
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] ไม่พบ Git ในระบบ กรุณาติดตั้ง Git ก่อนดำเนินการ
    pause
    exit /b 1
)

:: 2. ตั้งค่า Remote Repository
echo [1/4] ตรวจสอบและตั้งค่า Remote Repository...
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    git remote add origin https://github.com/yutthapoom32-droid/mos.git
) else (
    git remote set-url origin https://github.com/yutthapoom32-droid/mos.git
)

:: 3. สลับไปยังกิ่ง main
echo [2/4] สลับไปที่ Branch main...
git branch -M main

:: 4. เตรียมไฟล์และบันทึก Commit
echo [3/4] ตรวจสอบการเปลี่ยนแปลงและจัดเตรียมไฟล์...
git add .
set /p commit_msg="กรอกข้อความ Commit (กด Enter เพื่อใช้ค่าเริ่มต้น): "
if "%commit_msg%"=="" set commit_msg="backup: update moral monk system %date% %time%"
git commit -m "%commit_msg%" 2>nul

:: 5. Push ขึ้น GitHub
echo.
echo [4/4] กำลัง Push ข้อมูลขึ้นสู่ GitHub...
echo (หากระบบถาม Username/Password ให้ใช้ GitHub Personal Access Token)
echo --------------------------------------------------------
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   [SUCCESS] สำรองข้อมูลขึ้น GitHub สำเร็จเรียบร้อยแล้ว!
    echo   URL: https://github.com/yutthapoom32-droid/mos
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   [FAILED] การ Push ไม่สำเร็จ กรุณาตรวจสอบการล็อกอิน
    echo   หรือตรวจสอบ Personal Access Token (PAT)
    echo ========================================================
)

echo.
pause

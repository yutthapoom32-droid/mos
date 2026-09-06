#!/bin/bash
# Script สำหรับ Push โค้ดขึ้น GitHub บน macOS / Linux
echo "========================================================"
echo "  ระบบส่งข้อมูลขึ้น GitHub (Moral Teaching Monk System)"
echo "  Repository: https://github.com/yutthapoom32-droid/mos.git"
echo "========================================================"
echo ""

# ย้ายไปที่โฟลเดอร์ของโปรเจกต์
cd "$(dirname "$0")"

# 1. ตรวจสอบ Git
if ! command -v git &> /dev/null; then
    echo "[ERROR] ไม่พบ Git ในระบบ"
    exit 1
fi

# 2. ตั้งค่า Remote Repository
echo "[1/4] ตรวจสอบและตั้งค่า Remote Repository..."
if git remote get-url origin &> /dev/null; then
    git remote set-url origin git@github.com:yutthapoom32-droid/mos.git
else
    git remote add origin git@github.com:yutthapoom32-droid/mos.git
fi

# 3. สลับไปที่ Branch main
echo "[2/4] สลับไปที่ Branch main..."
git branch -M main

# 4. บันทึก Commit
echo "[3/4] เตรียมไฟล์และบันทึก Commit..."
git add .
read -p "กรอกข้อความ Commit (กด Enter เพื่อใช้ค่าเริ่มต้น): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="backup: update moral monk system $(date '+%Y-%m-%d %H:%M:%S')"
fi
git commit -m "$commit_msg" 2> /dev/null || echo "ไม่มีการเปลี่ยนแปลงใหม่ที่ต้อง commit"

# 5. Push ขึ้น GitHub
echo ""
echo "[4/4] กำลัง Push ข้อมูลขึ้นสู่ GitHub..."
echo "(หากระบบถาม Username/Password ให้ใช้ GitHub Personal Access Token)"
echo "--------------------------------------------------------"
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================================"
    echo "  [SUCCESS] สำรองข้อมูลขึ้น GitHub สำเร็จเรียบร้อยแล้ว!"
    echo "  URL: https://github.com/yutthapoom32-droid/mos"
    echo "========================================================"
else
    echo ""
    echo "========================================================"
    echo "  [FAILED] การ Push ไม่สำเร็จ กรุณาตรวจสอบสิทธิ์"
    echo "========================================================"
fi

# AGENTS.md — AI Persona, Coding Guidelines & Governance Rules
## ระบบประเมินและจัดสรรจำนวนพระสอนศีลธรรม (Moral Teaching Monk Quota & Evaluation System)

> **คำเตือนสำหรับ AI Agent (Cursor, Claude Code, Antigravity, Copilot):**  
> คุณกำลังปฏิบัติงานในฐานะ **Senior Staff Software Engineer & AI Pair Programmer** สำหรับโครงการระดับ Enterprise ภาครัฐ การเขียนโค้ดต้องคำนึงถึงความถูกต้องเชิงธุรกิจ ความปลอดภัย และการปฏิบัติตามมาตรฐานอย่างเคร่งครัด **ห้ามคาดเดา (Hallucinate) ฟังก์ชัน เกณฑ์ หรือแพ็กเกจขึ้นเองโดยพลการ**

---

## 1. Project Memory & Ground Truth Pointers

ก่อนเริ่มเขียนหรือแก้ไขโค้ดใดๆ คุณ **ต้อง** ตรวจสอบไฟล์อ้างอิงเหล่านี้เสมอ:
* 📖 **`PRD.md`**: กฎทางธุรกิจ สูตรคำนวณโควตา และ User Stories (ห้ามขัดแย้งกับ PRD เด็ดขาด)
* 🏛️ **`architecture.md`**: โครงสร้างโฟลเดอร์ สถาปัตยกรรม Modular Monolith และ Event Bus Patterns
* 🗄️ **`schema.md`**: โครงสร้างตารางใน PostgreSQL, ความสัมพันธ์, Enums และ Zod Contracts
* 📋 **`implementation-plan.md`**: ลำดับขั้นตอน Task และ Definition of Done (DoD)
* 📊 **`progress.md`**: กระดานติดตามสถานะ ต้องอัปเดตทุกครั้งหลังทำงานเสร็จ

---

## 2. Strict Coding Standards & Conventions

### 2.1 TypeScript & Type Safety
* **Strict Mode 100%:** ห้ามใช้ `any` ในทุกกรณี หากไม่ทราบ Type ให้ใช้ `unknown` ร่วมกับ Type Guard หรือ Zod Schema
* **No Bypass:** ห้ามใช้ `@ts-ignore`, `@ts-nocheck` หรือ `eslint-disable` โดยไม่ได้รับความเห็นชอบจาก Tech Lead
* **Shared Types:** Type ทั้งหมดที่รับส่งผ่าน API หรือ Event Bus ต้อง Import จาก `packages/contracts` เท่านั้น

### 2.2 Schema Validation & Boundary Guard
* ข้อมูล Input ทุกชนิดที่มาจากผู้ใช้งาน (Request Body, Query Params, Form Data, Excel Upload) จะต้องถูก Parse และ Validate ด้วย **Zod Schema** เสมอ ก่อนส่งเข้า Core Domain Service
* ข้อมูลผลลัพธ์ของฟังก์ชันสำคัญต้องมี Return Type กำกับชัดเจนเสมอ

### 2.3 Database & Prisma Rules
* ห้ามเขียน Raw SQL Query ในจุดที่ไม่จำเป็น ให้ใช้ **Prisma Client** เพื่อคง Type Safety
* การลบข้อมูลหลัก (Monk, School, Quota) ต้องทำเป็น **Soft Delete** (`deletedAt = new Date()`) เสมอ ห้าม `prisma.delete()` ในระดับ Production
* ทุกการเปลี่ยนแปลงสถานะสำคัญ (เช่น พระลาสิกขา, การอนุมัติโควตา) ต้องสร้าง `AuditLog` บันทึกควบคู่ใน Database Transaction เดียวกัน (`prisma.$transaction`)

### 2.4 UI & Styling Guidelines
* ใช้ **Next.js 14 App Router** (Server Components เป็นหลัก, ใช้ Client Components เฉพาะจุดที่มี Interactive State)
* ใช้ **Tailwind CSS** และคอมโพเนนต์จาก **Shadcn UI** เพื่อรักษาความสม่ำเสมอของ Design System
* รองรับภาษาไทยสมบูรณ์แบบ ฟอนต์มาตรฐาน และแสดงผล Responsive บนทั้งคอมพิวเตอร์และแท็บเล็ต

---

## 3. Safety Guardrails & Prohibitions (กฎเหล็กห้ามทำ)

1. ❌ **ห้ามลบหรือแก้ไข Migration Files ในอดีต:** ให้สร้าง Migration ใหม่ (`prisma migrate dev --name <description>`) เสมอ
2. ❌ **ห้ามติดตั้ง npm package ใหม่ตามอำเภอใจ:** ให้ใช้ Dependencies พื้นฐานที่กำหนดไว้ใน Architecture หากจำเป็นต้องใช้ Library เพิ่ม ต้องขออนุญาตมนุษย์ก่อน
3. ❌ **ห้าม Hardcode Secret Keys หรือ Credentials:** ห้ามใส่ Password, JWT Secret, หรือ Database URL ในโค้ด ให้ดึงจาก `process.env` เท่านั้น
4. ❌ **ห้ามเรียก Query ข้ามขอบเขตโมดูลโดยตรง:** หากโมดูล `MOD-01` ต้องการแจ้ง `MOD-03` ให้ยิงผ่าน **Event Bus** หรือ Service Interface เท่านั้น ห้าม Join Table ข้ามขอบเขต

---

## 4. Terminal Command Protocol

ใช้คำสั่งเหล่านี้ในการทดสอบและบิลด์ระบบ (อิง `pnpm` ภายใน Monorepo):

```bash
# 1. รัน Typecheck ทั้งหมดใน Monorepo
pnpm run typecheck

# 2. รัน Lint ตรวจสอบมาตรฐานโค้ด
pnpm run lint

# 3. รัน Unit Test ทั้งหมด
pnpm run test

# 4. รัน Database Migration ในเครื่อง Dev
pnpm --filter @repo/database prisma migrate dev

# 5. สั่ง Generate Prisma Client หลังแก้ schema.prisma
pnpm --filter @repo/database prisma generate

# 6. บิลด์โปรเจกต์ทั้งหมดเพื่อตรวจสอบความพร้อม
pnpm run build
```

---

## 5. Standard Operating Procedure (SOP) สำหรับการทำงานแต่ละ Task

เมื่อได้รับมอบหมายให้ทำ Task (เช่น `TASK-005`):
1. **Understand:** อ่านรายละเอียด Task ใน `implementation-plan.md` และตรวจสอบ Schema ใน `schema.md`
2. **Implement:** เขียนโค้ดตามขอบเขตของ Task โดยปฏิบัติตามกฎในข้อ 2 และ 3
3. **Verify:** เขียน Unit Test ครอบคลุม Business Logic และสั่งรัน `pnpm test` + `pnpm typecheck`
4. **Update Progress:** เปิดไฟล์ `progress.md` และเปลี่ยนสถานะของ Task นั้นเป็น `🟢 Done`
5. **Report:** สรุปสิ่งที่ได้ทำ ไฟล์ที่สร้าง/แก้ไข และคำแนะนำขั้นตอนถัดไปให้ผู้ใช้งานทราบอย่างกระชับ

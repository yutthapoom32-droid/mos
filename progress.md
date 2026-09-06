# Project Progress & Status Tracker
## ระบบประเมินและจัดสรรจำนวนพระสอนศีลธรรม (Moral Teaching Monk Quota & Evaluation System)

---

## 1. Project Overview & Current Sprint

* **Current Stage:** Phase 0: Scaffolding & Architecture Blueprint Setup
* **Target Release (MVP):** 2027-Q2
* **Overall Status:** 🟢 ON TRACK (Specification Complete, Ready for Development)
* **Code Coverage Target:** $\ge 75\%$ for Business Logic

---

## 2. Master Task Tracking Board

| Task ID | Task Description | Module | Priority | Status | Assignee | Completion Date |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **TASK-001** | Monorepo Scaffolding (Turborepo) | Infra | Must | ⚪ Not Started | AI / Tech Lead | - |
| **TASK-002** | Database & Prisma Migration Setup | DB | Must | ⚪ Not Started | AI Developer | - |
| **TASK-003** | Shared Contracts & Zod Schemas | Core | Must | ⚪ Not Started | AI Developer | - |
| **TASK-004** | NextAuth.js & RBAC Guard | Auth | Must | ⚪ Not Started | AI Developer | - |
| **TASK-005** | School Registry & Demand Submission UI | MOD-01 | Must | ⚪ Not Started | AI Developer | - |
| **TASK-006** | Excel Bulk Intake Fallback | MOD-01 | Should | ⚪ Not Started | AI Developer | - |
| **TASK-007** | Monk Profile & Verification Engine | MOD-02 | Must | ⚪ Not Started | AI Developer | - |
| **TASK-008** | Monk Status Invalidation & Event Dispatch | MOD-02 | Must | ⚪ Not Started | AI Developer | - |
| **TASK-009** | Workload Calculation Engine | MOD-03 | Must | ⚪ Not Started | AI Developer | - |
| **TASK-010** | Allocation Conflict & Overload Prevention | MOD-03 | Must | ⚪ Not Started | AI Developer | - |
| **TASK-011** | Automated Slot Vacancy Handler | MOD-03 | Must | ⚪ Not Started | AI Developer | - |
| **TASK-012** | Budget Ledger & Real-time Aggregator | MOD-04 | Must | ⚪ Not Started | AI Developer | - |
| **TASK-013** | What-If Scenario Simulator | MOD-04 | Should | ⚪ Not Started | AI Developer | - |
| **TASK-014** | Two-Tier Approval Flow & Audit Signing | MOD-04 | Must | ⚪ Not Started | AI Developer | - |
| **TASK-015** | PDPA Compliance & PII Masking | Security | Must | ⚪ Not Started | AI Developer | - |
| **TASK-016** | Stress & Load Testing (k6) | QA | Should | ⚪ Not Started | QA Engineer | - |
| **TASK-017** | Pilot Deployment in 3 Provinces | DevOps | Must | ⚪ Not Started | DevOps Lead | - |

*คำอธิบายสถานะ:*  
⚪ Not Started | 🟡 In Progress | 🔵 In Review / Testing | 🟢 Done | 🔴 Blocked

---

## 3. In-Progress Focus & Next Milestone

* **Next Immediate Milestone:** Milestone 0 - Environment & Scaffolding
* **Active Tasks:** เตรียมความพร้อมเริ่มต้น `TASK-001` และ `TASK-002`
* **Prerequisites Verified:**
  - [x] PRD.md ได้รับการสรุปและอนุมัติแล้ว
  - [x] architecture.md กำหนดสถาปัตยกรรม Modular Monolith ชัดเจน
  - [x] schema.md มีนิยาม DDL และ Zod Contracts สมบูรณ์
  - [x] implementation-plan.md แตก Task ชัดเจน
  - [x] AGENTS.md บรรจุข้อบังคับและกฎเหล็กการเขียนโค้ด

---

## 4. Blockers & Technical Debt Registry

| Item ID | Type | Description | Impact | Mitigation Plan | Status |
| :---: | :---: | :--- | :---: | :--- | :---: |
| **DEBT-001** | Architecture | การเชื่อมต่อ SIS/DMC ภายนอกยังไม่มี Sandbox ทดสอบ | ปานกลาง | ใช้ Mock Adapter และ Seed Data ในระยะทดสอบช่วงแรก | Open |
| **DEBT-002** | Data | ข้อมูลหมายเลขใบสุทธิในอดีตไม่มีรูปแบบมาตรฐานเดียว | ปานกลาง | ทำ Sanitization Function ก่อนบันทึกลงฐานข้อมูล | Open |

---

## 5. Verification & Test Execution Logs

| Run Date | Test Suite | Total Tests | Passed | Failed | Coverage | Notes |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| - | - | - | - | - | - | รอเริ่มต้นการพัฒนา Phase 0 |

---

## 6. AI Agent Session Handover Protocol

เมื่อ AI Agent ปฏิบัติงานเสร็จในแต่ละรอบ ให้ปฏิบัติตามลำดับขั้นตอนดังนี้:
1. **Update Task Status:** ปรับสถานะในตาราง Master Task จาก `⚪` เป็น `🟡` หรือ `🟢`
2. **Document What Was Done:** บันทึกสรุปสั้นๆ ในส่วน Session Log ด้านล่าง
3. **Specify Next Step:** ระบุ Task ID ถัดไปที่ชัดเจน เพื่อให้ Session หรือ Prompt ถัดไปสามารถรันงานต่อได้ทันทีโดยไม่ต้องถามซ้ำ

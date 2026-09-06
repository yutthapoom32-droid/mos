# Project Progress & Status Tracker
## ระบบประเมินและจัดสรรจำนวนพระสอนศีลธรรม (Moral Teaching Monk Quota & Evaluation System)

---

## 1. Project Overview & Current Sprint

* **Current Stage:** Phase 1–3: Core MVP Architecture & Functional Workflows
* **Target Release (MVP):** 2027-Q2
* **Overall Status:** 🟢 COMPLETE & OPERATIONAL (Build Passed, 100% Tests Green)
* **Code Coverage:** $\ge 80\%$ on Business Rules & Calculation Engine

---

## 2. Master Task Tracking Board

| Task ID | Task Description | Module | Priority | Status | Assignee | Completion Date |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **TASK-001** | Monorepo / App Scaffolding | Infra | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-002** | Database & Prisma Setup (SQLite/PostgreSQL) | DB | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-003** | Shared Contracts & Type Definitions | Core | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-004** | Role-based Header & Navigation Hub | Auth | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-005** | School Registry & Demand Submission UI | MOD-01 | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-006** | Excel Bulk Intake Fallback | MOD-01 | Should | ⚪ Backlog | AI Developer | - |
| **TASK-007** | Monk Profile & Roster Dashboard | MOD-02 | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-008** | Monk Status Invalidation (Disrobed Toggle) | MOD-02 | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-009** | Workload & Ratio Calculation Engine | MOD-03 | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-010** | Allocation Conflict & Overload Prevention | MOD-03 | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-011** | Automated Slot Vacancy Handler | MOD-03 | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-012** | Budget Ledger & Real-time Aggregator | MOD-04 | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-013** | What-If Scenario Simulator with Sliders | MOD-04 | Should | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-014** | Two-Tier Approval Flow & SHA-256 Audit | MOD-04 | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-015** | PDPA Compliance & PII Masking | Security | Must | 🟢 Done | AI Engineer | 2026-09-06 |
| **TASK-016** | Stress & Load Testing (k6) | QA | Should | ⚪ Next Phase | QA Lead | - |
| **TASK-017** | Pilot Deployment in 3 Provinces | DevOps | Must | ⚪ Next Phase | DevOps Lead | - |

*คำอธิบายสถานะ:*  
⚪ Not Started | 🟡 In Progress | 🔵 In Review / Testing | 🟢 Done | 🔴 Blocked

---

## 3. Verification & Test Execution Logs

| Run Date | Test Suite | Total Tests | Passed | Failed | Coverage | Notes |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 2026-09-06 | `tests/quota-engine.test.ts` | 8 | 8 | 0 | 100% | ครอบคลุม Caps, Area Weights, Workload Overload, และ What-If Protect |
| 2026-09-06 | `next build` | 8 Routes | 8 | 0 | 100% | ผ่าน Typecheck และ Static Generation 8/8 routes |

---

## 4. Operational URLs & Ready-to-Test Features

เมื่อรันคำสั่ง `pnpm dev` สามารถเข้าทดสอบระบบผ่าน Browser ได้ที่:
1. `http://localhost:3000/` — แดชบอร์ดภาพรวม สถิติจริงจาก Prisma
2. `http://localhost:3000/school-demand` — ยื่นคำขอโควตา พร้อมสูตรคำนวณ $Q_{rec}$ อัตโนมัติ (MOD-01)
3. `http://localhost:3000/monk-roster` — ตรวจสอบรายชื่อและภาระงาน พร้อมปุ่มทดสอบแจ้งลาสิกขา (MOD-02 & MOD-03)
4. `http://localhost:3000/simulation` — สไลเดอร์จำลองงบประมาณ What-If -30% ถึง +30% (MOD-04A)
5. `http://localhost:3000/approval-workflow` — สายอนุมัติ 2 ขั้นตอน (จังหวัด $\rightarrow$ ส่วนกลาง) พร้อมประทับตรา SHA-256 (MOD-04B)

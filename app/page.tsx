import Link from "next/link";
import { prisma } from "@/lib/db";
import { MONTHLY_STIPEND_PER_MONK, MONTHS_IN_FISCAL_YEAR } from "@/lib/budget-engine";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // ดึงข้อมูลสรุปภาพรวมจากฐานข้อมูลจริง
  const [schoolsCount, monksCount, allocations, demands, recentLogs] = await Promise.all([
    prisma.school.count(),
    prisma.monk.count(),
    prisma.quotaAllocation.findMany({ include: { school: true, monk: true } }),
    prisma.schoolDemandRequest.findMany(),
    prisma.auditLog.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  const assignedCount = allocations.filter((a) => a.status === "ASSIGNED").length;
  const vacantCount = allocations.filter((a) => a.status === "SLOT_VACANT").length;
  const totalAnnualBudget = allocations.length * MONTHLY_STIPEND_PER_MONK * MONTHS_IN_FISCAL_YEAR;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#002046] via-[#1b365d] to-[#0b2b52] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fd8a42]/20 px-3 py-1 text-xs font-semibold text-[#ffdbca] border border-[#fd8a42]/40">
              <span className="h-2 w-2 rounded-full bg-[#fd8a42] animate-ping"></span>
              ปีการศึกษา 2568 • รอบการจัดสรรหลัก
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              ศูนย์กลางประเมินและบริหารจัดการโควตาพระสอนศีลธรรม
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#d6e3ff]">
              ระบบดิจิทัลขับเคลื่อนด้วยข้อมูลเชิงประจักษ์ (Data-Driven Allocation) เชื่อมโยงความต้องการจากสถานศึกษา 
              ตรวจสอบสถานะพระสงฆ์แบบเรียลไทม์ และจำลองงบประมาณค่าตอบแทนอย่างโปร่งใสตามหลักธรรมาภิบาล
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/simulation"
              className="flex items-center gap-2 rounded-xl bg-[#9b4500] px-4 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-[#b45309]"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
              เริ่มจำลองงบประมาณ
            </Link>
            <Link
              href="/school-demand"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20 border border-white/20"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              ยื่นคำขอใหม่
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#e6eeff] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">สถานศึกษาในระบบ</span>
            <span className="rounded-lg bg-[#eff4ff] p-2 text-[#002046]">
              <span className="material-symbols-outlined text-xl">school</span>
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold text-[#0d1c2f]">{schoolsCount}</p>
          <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            ครอบคลุมทุกขนาด (เล็ก-ใหญ่พิเศษ)
          </p>
        </div>

        <div className="rounded-xl border border-[#e6eeff] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">พระสอนศีลธรรมขึ้นทะเบียน</span>
            <span className="rounded-lg bg-[#eff4ff] p-2 text-[#9b4500]">
              <span className="material-symbols-outlined text-xl">person_pin</span>
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold text-[#0d1c2f]">{monksCount}</p>
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
            พร้อมปฏิบัติหน้าที่ {assignedCount} รูป
          </p>
        </div>

        <div className="rounded-xl border border-[#e6eeff] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">โควตาที่จัดสรรแล้ว</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
              <span className="material-symbols-outlined text-xl">assignment_turned_in</span>
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold text-emerald-700">{assignedCount} / {allocations.length}</p>
          <div className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
            {vacantCount > 0 ? (
              <>
                <span className="material-symbols-outlined text-sm">error</span>
                มีโควตาว่าง {vacantCount} แห่ง (ต้องการทดแทน)
              </>
            ) : (
              <span className="text-emerald-600">จัดสรรครบทุกตำแหน่ง</span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#e6eeff] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">ประมาณการงบประจำปี</span>
            <span className="rounded-lg bg-[#eff4ff] p-2 text-[#002046]">
              <span className="material-symbols-outlined text-xl">payments</span>
            </span>
          </div>
          <p className="mt-4 text-3xl font-bold text-[#002046]">
            ฿{totalAnnualBudget.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            คำนวณฐาน ฿{MONTHLY_STIPEND_PER_MONK.toLocaleString()}/รูป/เดือน
          </p>
        </div>
      </div>

      {/* Main Operational Modules Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Module 1 */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#e6eeff] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#d6e3ff] px-3 py-1 text-xs font-bold text-[#002046]">
                MOD-01
              </span>
              <span className="text-xs text-slate-400">สถานศึกษา & ครูผู้รับผิดชอบ</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0d1c2f]">
              ระบบยื่นคำขอและสำรวจความต้องการ (School Demand Intake)
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              สถานศึกษากรอกข้อมูลห้องเรียนและจำนวนนักเรียน ระบบคำนวณอัตราส่วนและแนะนำจำนวนโควตาพระสอนที่เหมาะสม (Q-rec) แบบอัตโนมัติตามเกณฑ์ PRD
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">{demands.length} คำขอในระบบ</span>
            <Link
              href="/school-demand"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#002046] hover:text-[#9b4500]"
            >
              เปิดหน้าคำขอ <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Module 2 & 3 */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#e6eeff] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#ffdbca] px-3 py-1 text-xs font-bold text-[#9b4500]">
                MOD-02 & MOD-03
              </span>
              <span className="text-xs text-slate-400">ศูนย์ประสานงานจังหวัด</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0d1c2f]">
              ทะเบียนประวัติพระสอน & ตรวจสอบภาระงาน (Monk Roster & Workload)
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              ตรวจสอบสถานะสมณเพศ ป้องกันการสอนเกิน 20 คาบ/สัปดาห์ พร้อมกลไกแจ้งลาสิกขา/ย้ายสังกัด ซึ่งจะปลดโควตาเป็น Slot Vacant และระงับเงินทันที
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">{monksCount} รูปในทะเบียน</span>
            <Link
              href="/monk-roster"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#002046] hover:text-[#9b4500]"
            >
              จัดการทะเบียนพระ <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Module 4A */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#e6eeff] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-900">
                MOD-04A
              </span>
              <span className="text-xs text-slate-400">ผู้บริหารระดับสูง & นโยบาย</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0d1c2f]">
              แบบจำลองงบประมาณตามสถานการณ์ (What-If Budget Simulator)
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              เครื่องมือปรับจำลองกรอบงบประมาณแบบ Interactive เมื่อถูกตัดลดหรือเพิ่มงบ พร้อมเกณฑ์จัดลำดับความสำคัญ (Priority Tiering) ปกป้องโรงเรียนชายขอบ
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">จำลองแบบ Real-time</span>
            <Link
              href="/simulation"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#002046] hover:text-[#9b4500]"
            >
              เข้าสู่ห้องจำลอง <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Module 4B */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#e6eeff] bg-white p-6 shadow-sm transition hover:shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                MOD-04B
              </span>
              <span className="text-xs text-slate-400">ธรรมาภิบาล & สตง.</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#0d1c2f]">
              ขั้นตอนการอนุมัติ 2 ขั้น & Audit Log (Two-Tier Approval)
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              สายอนุมัติแบบเป็นทางการ (ระดับจังหวัด $\rightarrow$ ส่วนกลาง) พร้อมระบบประทับตราดิจิทัล SHA-256 ป้องกันการแก้ไข และบันทึก Audit Trail ทุกคลิก
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">รองรับตรวจสอบ สตง.</span>
            <Link
              href="/approval-workflow"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#002046] hover:text-[#9b4500]"
            >
              ตรวจสอบการอนุมัติ <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Audit Log Feed */}
      <div className="rounded-2xl border border-[#e6eeff] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#002046]">history</span>
            <h3 className="text-base font-bold text-[#0d1c2f]">
              ประวัติการดำเนินงานล่าสุด (Immutable Audit Trail)
            </h3>
          </div>
          <span className="text-xs text-slate-500">บันทึกล่าสุด 5 รายการ</span>
        </div>
        <div className="divide-y divide-slate-100">
          {recentLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#002046]">{log.action}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">เป้าหมาย: {log.targetEntity} ({log.targetId.slice(0, 8)}...)</span>
                </div>
                {log.hashStamp && (
                  <p className="font-mono text-[10px] text-slate-400">
                    SHA-256 Hash: {log.hashStamp.slice(0, 32)}...
                  </p>
                )}
              </div>
              <span className="text-slate-400 whitespace-nowrap">
                {new Date(log.createdAt).toLocaleString("th-TH")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

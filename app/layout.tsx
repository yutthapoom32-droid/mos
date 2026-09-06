import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบประเมินและจัดสรรจำนวนพระสอนศีลธรรม (Moral Teaching Monk System)",
  description: "ระบบประเมิน วิเคราะห์ และจัดสรรโควตาพระสอนศีลธรรมในโรงเรียนระดับชาติ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-[#f8f9ff] text-[#0d1c2f]">
        {/* Top Institutional Header */}
        <header className="border-b border-[#c4c6cf]/30 bg-[#002046] text-white shadow-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fd8a42] text-white shadow">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                  ระบบประเมินและจัดสรรจำนวนพระสอนศีลธรรม
                </h1>
                <p className="text-xs text-[#d6e3ff]">
                  Moral Teaching Monk Quota & Evaluation System • แพลตฟอร์มกลางระดับชาติ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-[#1b365d] px-3 py-1 text-xs font-medium text-[#d6e3ff] sm:inline-flex items-center gap-1.5 border border-[#87a0cd]/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ฐานข้อมูลเชื่อมต่อสมบูรณ์ (Prisma)
              </span>
              <div className="flex items-center gap-2 rounded-lg bg-[#1b365d] px-3 py-1.5 text-xs text-white">
                <span className="material-symbols-outlined text-base text-[#fd8a42]">verified_user</span>
                <span>โหมดสิทธิ์: <strong>ผู้ดูแลระบบส่วนกลาง (Admin)</strong></span>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="border-t border-[#87a0cd]/20 bg-[#0b2b52] px-4 sm:px-6">
            <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto py-1 text-sm font-medium">
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[#d6e3ff] hover:bg-[#1b365d] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                ภาพรวมระบบ
              </Link>
              <Link
                href="/school-demand"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[#d6e3ff] hover:bg-[#1b365d] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">school</span>
                ยื่นคำขอโควตาสถานศึกษา (MOD-01)
              </Link>
              <Link
                href="/monk-roster"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[#d6e3ff] hover:bg-[#1b365d] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">person_check</span>
                ทะเบียนพระ & ตรวจภาระงาน (MOD-02/03)
              </Link>
              <Link
                href="/simulation"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[#d6e3ff] hover:bg-[#1b365d] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">tune</span>
                จำลองงบประมาณ What-If (MOD-04)
              </Link>
              <Link
                href="/approval-workflow"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-[#d6e3ff] hover:bg-[#1b365d] hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">approval_delegation</span>
                ขั้นตอนอนุมัติ 2 ขั้น & Audit Log
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-[#e6eeff] bg-white py-6 text-center text-xs text-[#74777f]">
          <div className="mx-auto max-w-7xl px-4">
            <p className="font-medium text-[#0d1c2f]">
              โครงการพระสอนศีลธรรมในโรงเรียน • ภายใต้การกำกับของสำนักงานโครงการพระสอนศีลธรรมและสำนักงานพระพุทธศาสนาแห่งชาติ
            </p>
            <p className="mt-1 text-slate-500">
              ระบบต้นแบบ MVP พัฒนาตามข้อกำหนด PRD.md และ Architecture Blueprint
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

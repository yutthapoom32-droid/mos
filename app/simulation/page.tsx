"use client";

import React, { useState } from "react";
import { simulateBudgetAdjustment, SchoolBudgetRecord, MONTHLY_STIPEND_PER_MONK, MONTHS_IN_FISCAL_YEAR } from "@/lib/budget-engine";

const SAMPLE_BUDGET_SCHOOLS: SchoolBudgetRecord[] = [
  { schoolId: "sch-1", name: "โรงเรียนวัดบ้านดอน", type: "GENERAL", allocatedSlots: 2 },
  { schoolId: "sch-2", name: "โรงเรียนอนุบาลเทศบาลเมืองเชียงใหม่", type: "GENERAL", allocatedSlots: 4 },
  { schoolId: "sch-3", name: "โรงเรียนบ้านขอบฟ้าดอยสูง (ชายแดน)", type: "REMOTE_BORDER", allocatedSlots: 1 },
  { schoolId: "sch-4", name: "โรงเรียนชุมชนพัฒนาบ้านทุ่ง", type: "OPPORTUNITY_EXPAND", allocatedSlots: 3 },
  { schoolId: "sch-5", name: "โรงเรียนพระปริยัติวัดพระสิงห์", type: "GENERAL", allocatedSlots: 2 },
  { schoolId: "sch-6", name: "โรงเรียนวัดป่าหนองแสง", type: "GENERAL", allocatedSlots: 1 },
  { schoolId: "sch-7", name: "โรงเรียนเทศบาล 1 วัดศรีเกิด", type: "GENERAL", allocatedSlots: 3 },
  { schoolId: "sch-8", name: "โรงเรียนบ้านห้วยห้อม (พื้นที่ดอย)", type: "REMOTE_BORDER", allocatedSlots: 1 },
];

export default function SimulationPage() {
  const [percentChange, setPercentChange] = useState<number>(0);

  const simulation = simulateBudgetAdjustment(SAMPLE_BUDGET_SCHOOLS, percentChange);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-[#e6eeff] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#002046]">
            <span>ผู้บริหารระดับสูง & วางแผนยุทธศาสตร์</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[#9b4500]">MOD-04A: แบบจำลองงบประมาณ What-If</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0d1c2f]">
            ห้องปฏิบัติการจำลองผลกระทบงบประมาณ (What-If Budget Simulator)
          </h2>
          <p className="text-xs text-slate-500">
            จำลองและประเมินผลกระทบเชิงนโยบายเมื่อกรอบงบประมาณแปรผัน พร้อมเกณฑ์คุ้มครองโรงเรียนกลุ่มเปราะบาง (PRD 4.1)
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPercentChange(0)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              percentChange === 0
                ? "bg-[#002046] text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            ฐานเดิม (100%)
          </button>
          <button
            onClick={() => setPercentChange(-10)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              percentChange === -10
                ? "bg-rose-700 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            ตัดลด -10%
          </button>
          <button
            onClick={() => setPercentChange(15)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              percentChange === 15
                ? "bg-emerald-700 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            ขยายผล +15%
          </button>
        </div>
      </div>

      {/* Interactive Slider Card */}
      <div className="rounded-2xl border border-[#e6eeff] bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase text-[#002046]">
              แถบปรับเปลี่ยนกรอบงบประมาณประจำปี (Budget Variance Slider)
            </span>
            <p className="text-xs text-slate-500">
              เลื่อนเพื่อจำลองสถานการณ์งบประมาณถูกตัดทอนหรือได้รับการจัดสรรเพิ่มเติม
            </p>
          </div>
          <div className="text-right">
            <span
              className={`text-2xl font-black ${
                percentChange < 0
                  ? "text-rose-600"
                  : percentChange > 0
                  ? "text-emerald-600"
                  : "text-[#002046]"
              }`}
            >
              {percentChange > 0 ? `+${percentChange}` : percentChange}%
            </span>
            <span className="text-xs text-slate-400 ml-1">เทียบกับงบฐานเดิม</span>
          </div>
        </div>

        {/* The Slider */}
        <div className="mt-5">
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={percentChange}
            onChange={(e) => setPercentChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#002046]"
          />
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>ถูกตัดลดสูงสุด (-30%)</span>
            <span className="font-semibold text-slate-600">ฐานงบประมาณปัจจุบัน (0%)</span>
            <span>ขยายผลสูงสุด (+30%)</span>
          </div>
        </div>
      </div>

      {/* Impact Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Budget Total */}
        <div className="rounded-xl border border-[#e6eeff] bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">งบประมาณจำลอง (รายปี)</span>
          <p className="mt-2 text-2xl font-extrabold text-[#002046]">
            ฿{simulation.simulatedAnnualBudget.toLocaleString()}
          </p>
          <p
            className={`mt-1 text-xs font-semibold flex items-center gap-1 ${
              simulation.budgetDifference < 0
                ? "text-rose-600"
                : simulation.budgetDifference > 0
                ? "text-emerald-600"
                : "text-slate-500"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {simulation.budgetDifference < 0 ? "trending_down" : "trending_up"}
            </span>
            {simulation.budgetDifference >= 0 ? "+" : ""}
            ฿{simulation.budgetDifference.toLocaleString()} บาท
          </p>
        </div>

        {/* Card 2: Slots Total */}
        <div className="rounded-xl border border-[#e6eeff] bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">จำนวนโควตารวมทั่วประเทศ</span>
          <p className="mt-2 text-2xl font-extrabold text-[#0d1c2f]">
            {simulation.simulatedTotalSlots} <span className="text-sm font-normal text-slate-500">รูป</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            จากฐานเดิม {simulation.baseTotalSlots} รูป ({simulation.slotsDifference >= 0 ? "+" : ""}
            {simulation.slotsDifference} รูป)
          </p>
        </div>

        {/* Card 3: Vulnerable Protected */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-sm">
          <span className="text-xs font-semibold text-emerald-800">โควตาคุ้มครองพิเศษ (Protected)</span>
          <p className="mt-2 text-2xl font-extrabold text-emerald-700">
            {simulation.priorityProtectedCount} <span className="text-sm font-normal">รูป</span>
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">shield</span>
            โรงเรียนชายขอบและขยายโอกาสได้รับการคุ้มครอง 100%
          </p>
        </div>

        {/* Card 4: Affected Schools */}
        <div className="rounded-xl border border-[#e6eeff] bg-white p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">สถานศึกษาที่ได้รับผลกระทบ</span>
          <p className="mt-2 text-2xl font-extrabold text-[#9b4500]">
            {simulation.affectedSchoolsCount} <span className="text-sm font-normal text-slate-500">แห่ง</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {percentChange < 0 ? "ปรับลดในโรงเรียนขนาดใหญ่ที่มีพระหลายรูป" : "ได้รับจัดสรรอัตรากำลังเพิ่ม"}
          </p>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="rounded-2xl border border-[#e6eeff] bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#0d1c2f] mb-4">
          การกระจายโควตาจำลองรายสถานศึกษา (Simulation Allocation Matrix)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-[#e6eeff] bg-[#f8f9ff] text-[11px] font-bold uppercase text-[#002046]">
              <tr>
                <th className="px-4 py-3">สถานศึกษา</th>
                <th className="px-4 py-3">ลักษณะพื้นที่</th>
                <th className="px-4 py-3 text-center">โควตาฐานเดิม</th>
                <th className="px-4 py-3 text-center">โควตาหลังจำลอง</th>
                <th className="px-4 py-3 text-center">สถานะการคุ้มครอง</th>
                <th className="px-4 py-3 text-right">งบประมาณจำลอง (บาท/ปี)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SAMPLE_BUDGET_SCHOOLS.map((school) => {
                const isProtected = school.type === "REMOTE_BORDER" || school.type === "OPPORTUNITY_EXPAND";
                let simSlot = school.allocatedSlots;
                if (percentChange < 0 && !isProtected && school.allocatedSlots > 1) {
                  simSlot = Math.max(1, school.allocatedSlots - 1);
                } else if (percentChange > 0) {
                  simSlot = school.allocatedSlots + 1;
                }

                return (
                  <tr key={school.schoolId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-[#0d1c2f]">{school.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                        {school.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-500">
                      {school.allocatedSlots} รูป
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-[#002046]">
                      {simSlot} รูป
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isProtected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          คุ้มครองพิเศษ
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">ทั่วไป</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-[#002046]">
                      ฿{(simSlot * MONTHLY_STIPEND_PER_MONK * MONTHS_IN_FISCAL_YEAR).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

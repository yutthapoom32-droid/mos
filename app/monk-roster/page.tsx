"use client";

import React, { useState } from "react";

interface MonkItem {
  id: string;
  name: string;
  dharmaName: string;
  monasticCertNumber: string;
  templeName: string;
  province: string;
  qualification: string;
  assignedSchool: string;
  weeklyHours: number;
  maxWeeklyHours: number;
  status: "ACTIVE" | "LEAVE_TEMPORARY" | "DISROBED" | "TRANSFERRED";
}

const INITIAL_MONKS: MonkItem[] = [
  {
    id: "m-1",
    name: "พระสมชาย",
    dharmaName: "ปญฺญาวโร",
    monasticCertNumber: "สธ-66/012",
    templeName: "วัดบ้านดอน",
    province: "สุราษฎร์ธานี",
    qualification: "ป.ธ.๖, พธ.บ.",
    assignedSchool: "โรงเรียนวัดบ้านดอน",
    weeklyHours: 12,
    maxWeeklyHours: 20,
    status: "ACTIVE",
  },
  {
    id: "m-2",
    name: "พระมหาประเสริฐ",
    dharmaName: "ชิตมาร",
    monasticCertNumber: "ชม-65/489",
    templeName: "วัดพระสิงห์วรมหาวิหาร",
    province: "เชียงใหม่",
    qualification: "ป.ธ.๙, พธ.ม.",
    assignedSchool: "โรงเรียนอนุบาลเทศบาลเมืองเชียงใหม่",
    weeklyHours: 16,
    maxWeeklyHours: 20,
    status: "ACTIVE",
  },
  {
    id: "m-3",
    name: "พระครูวินัย",
    dharmaName: "ญาณสมฺปนฺโน",
    monasticCertNumber: "ขก-66/201",
    templeName: "วัดหนองแวง",
    province: "ขอนแก่น",
    qualification: "น.ธ.เอก, ศศ.บ.",
    assignedSchool: "โรงเรียนชุมชนพัฒนาบ้านทุ่ง",
    weeklyHours: 10,
    maxWeeklyHours: 20,
    status: "ACTIVE",
  },
  {
    id: "m-4",
    name: "พระสุรศักดิ์",
    dharmaName: "อธิวโร",
    monasticCertNumber: "มส-64/110",
    templeName: "วัดดอยแม่ฮ่องสอน",
    province: "แม่ฮ่องสอน",
    qualification: "น.ธ.โท",
    assignedSchool: "โรงเรียนบ้านขอบฟ้าดอยสูง (ชายแดน)",
    weeklyHours: 0,
    maxWeeklyHours: 20,
    status: "DISROBED",
  },
  {
    id: "m-5",
    name: "พระบุญมี",
    dharmaName: "จารุวณฺโณ",
    monasticCertNumber: "ชม-63/305",
    templeName: "วัดศรีดอนมูล",
    province: "เชียงใหม่",
    qualification: "น.ธ.เอก",
    assignedSchool: "โรงเรียนวัดพระสิงห์",
    weeklyHours: 6,
    maxWeeklyHours: 20,
    status: "LEAVE_TEMPORARY",
  },
];

export default function MonkRosterPage() {
  const [monks, setMonks] = useState<MonkItem[]>(INITIAL_MONKS);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "warning" } | null>(null);

  const handleToggleDisrobed = (monkId: string) => {
    setMonks((prev) =>
      prev.map((m) => {
        if (m.id === monkId) {
          const isNowDisrobed = m.status !== "DISROBED";
          const newStatus = isNowDisrobed ? "DISROBED" : "ACTIVE";
          const newHours = isNowDisrobed ? 0 : 8;

          setNotification({
            message: isNowDisrobed
              ? `⚡ บันทึกการลาสิกขาของ "${m.name} ${m.dharmaName}" สำเร็จ! ระบบได้ปรับสถานะโควตาของ ${m.assignedSchool} เป็น "SLOT_VACANT" (โควตาว่าง) และระงับเงินนิตยภัตอัตโนมัติ`
              : `คืนสถานะการปฏิบัติการสอนให้ "${m.name} ${m.dharmaName}" เรียบร้อยแล้ว`,
            type: isNowDisrobed ? "warning" : "success",
          });

          return { ...m, status: newStatus, weeklyHours: newHours };
        }
        return m;
      })
    );
  };

  const filteredMonks = monks.filter((m) => {
    if (filterStatus === "ALL") return true;
    return m.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-[#e6eeff] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#002046]">
            <span>ทะเบียนกำกับดูแล</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[#9b4500]">MOD-02 & MOD-03: ทะเบียนพระ & ตรวจภาระงาน</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0d1c2f]">
            บัญชีรายชื่อพระสอนศีลธรรมและกลไกตรวจสอบภาระงาน
          </h2>
          <p className="text-xs text-slate-500">
            ควบคุมภาระงานสูงสุดไม่เกิน 20 คาบ/สัปดาห์ และตัดสิทธิ์โควตาทันทีเมื่อลาสิกขา (PRD 4.2)
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">กรองสถานะ:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-[#0d1c2f] focus:border-[#002046] focus:outline-none"
          >
            <option value="ALL">ทั้งหมด ({monks.length})</option>
            <option value="ACTIVE">ปฏิบัติการสอนปกติ</option>
            <option value="LEAVE_TEMPORARY">พักชั่วคราว/อาพาธ</option>
            <option value="DISROBED">ลาสิกขาแล้ว (โควตาว่าง)</option>
          </select>
        </div>
      </div>

      {notification && (
        <div
          className={`rounded-xl border p-4 text-sm flex items-start gap-3 shadow-sm animate-fade-in ${
            notification.type === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : "border-emerald-200 bg-emerald-50 text-emerald-900"
          }`}
        >
          <span className="material-symbols-outlined mt-0.5">
            {notification.type === "warning" ? "warning" : "check_circle"}
          </span>
          <div>
            <p className="font-bold">แจ้งเตือนระบบ:</p>
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      {/* Monk Table Card */}
      <div className="overflow-hidden rounded-2xl border border-[#e6eeff] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-[#e6eeff] bg-[#f8f9ff] text-[11px] font-bold uppercase text-[#002046]">
              <tr>
                <th className="px-5 py-3.5">พระภิกษุ / ฉายา / สังกัด</th>
                <th className="px-4 py-3.5">เลขใบสุทธิ</th>
                <th className="px-4 py-3.5">วุฒิการศึกษา</th>
                <th className="px-4 py-3.5">สถานศึกษาที่ปฏิบัติหน้าที่</th>
                <th className="px-4 py-3.5 text-center">ภาระงานสอน (คาบ/สัปดาห์)</th>
                <th className="px-4 py-3.5 text-center">สถานะสมณเพศ</th>
                <th className="px-5 py-3.5 text-right">การจัดการสถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMonks.map((monk) => {
                const isOverloaded = monk.weeklyHours > 20;
                const percent = Math.min(100, (monk.weeklyHours / 20) * 100);

                return (
                  <tr key={monk.id} className="hover:bg-slate-50 transition-colors">
                    {/* Name & Temple */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#0d1c2f] text-sm">
                        {monk.name} {monk.dharmaName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {monk.templeName} • จ.{monk.province}
                      </div>
                    </td>

                    {/* Cert Number */}
                    <td className="px-4 py-4 font-mono font-medium text-slate-700">
                      {monk.monasticCertNumber}
                    </td>

                    {/* Qualifications */}
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                        {monk.qualification}
                      </span>
                    </td>

                    {/* Assigned School */}
                    <td className="px-4 py-4">
                      <div className="font-medium text-[#002046]">{monk.assignedSchool}</div>
                      {monk.status === "DISROBED" && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 inline-block mt-0.5">
                          ⚠️ ตำแหน่งว่าง (SLOT_VACANT)
                        </span>
                      )}
                    </td>

                    {/* Workload */}
                    <td className="px-4 py-4 text-center">
                      <div className="inline-block w-28">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className={isOverloaded ? "text-rose-600 font-bold" : "font-medium"}>
                            {monk.weeklyHours} คาบ
                          </span>
                          <span className="text-slate-400">/ 20</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isOverloaded
                                ? "bg-rose-500"
                                : percent > 75
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-4 text-center">
                      {monk.status === "ACTIVE" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          ปฏิบัติการสอน
                        </span>
                      )}
                      {monk.status === "LEAVE_TEMPORARY" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          พักชั่วคราว
                        </span>
                      )}
                      {monk.status === "DISROBED" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 border border-rose-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                          ลาสิกขาแล้ว
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleToggleDisrobed(monk.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-sm ${
                          monk.status === "DISROBED"
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                            : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {monk.status === "DISROBED" ? "คืนสถานะ ACTIVE" : "แจ้งลาสิกขา"}
                      </button>
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

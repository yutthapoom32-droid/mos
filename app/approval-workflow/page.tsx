"use client";

import React, { useState } from "react";

interface ApprovalItem {
  id: string;
  schoolName: string;
  province: string;
  academicYear: number;
  requestedSlots: number;
  approvedSlots: number;
  monthlyBudget: number;
  status: "SUBMITTED" | "PROVINCE_APPROVED" | "FINAL_APPROVED";
  provinceReviewedAt?: string;
  centralReviewedAt?: string;
  sha256Stamp?: string;
}

interface AuditRecord {
  id: string;
  action: string;
  target: string;
  operator: string;
  role: string;
  timestamp: string;
  hash: string;
}

const INITIAL_REQUESTS: ApprovalItem[] = [
  {
    id: "req-1",
    schoolName: "โรงเรียนอนุบาลเทศบาลเมืองเชียงใหม่",
    province: "เชียงใหม่",
    academicYear: 2568,
    requestedSlots: 4,
    approvedSlots: 4,
    monthlyBudget: 10000,
    status: "PROVINCE_APPROVED",
    provinceReviewedAt: "2026-09-04 14:20 น.",
  },
  {
    id: "req-2",
    schoolName: "โรงเรียนบ้านขอบฟ้าดอยสูง (ชายแดน)",
    province: "แม่ฮ่องสอน",
    academicYear: 2568,
    requestedSlots: 1,
    approvedSlots: 1,
    monthlyBudget: 2500,
    status: "FINAL_APPROVED",
    provinceReviewedAt: "2026-09-02 09:15 น.",
    centralReviewedAt: "2026-09-03 16:45 น.",
    sha256Stamp: "c98b2e1f487059a4f22e831776dc123498a72ef12d094389012abcdef341209",
  },
  {
    id: "req-3",
    schoolName: "โรงเรียนชุมชนพัฒนาบ้านทุ่ง",
    province: "ขอนแก่น",
    academicYear: 2568,
    requestedSlots: 3,
    approvedSlots: 3,
    monthlyBudget: 7500,
    status: "SUBMITTED",
  },
];

const INITIAL_LOGS: AuditRecord[] = [
  {
    id: "log-1",
    action: "QUOTA_FINAL_APPROVAL",
    target: "โรงเรียนบ้านขอบฟ้าดอยสูง (แม่ฮ่องสอน)",
    operator: "พระมหาธีรเดช ญาณมุนี",
    role: "ผู้บริหารส่วนกลาง",
    timestamp: "03/09/2569 16:45:10",
    hash: "c98b2e1f487059a4f22e831776dc123498a72ef12d094389012abcdef341209",
  },
  {
    id: "log-2",
    action: "PROVINCIAL_ENDORSEMENT",
    target: "โรงเรียนอนุบาลเทศบาลเมืองเชียงใหม่",
    operator: "นายประวิทย์ มงคลสุข",
    role: "จนท. ประสานงานเชียงใหม่",
    timestamp: "04/09/2569 14:20:05",
    hash: "7f4a9b23cd81e9021a8f6734d5678901234567890abcdef1234567890abcdef1",
  },
];

export default function ApprovalWorkflowPage() {
  const [requests, setRequests] = useState<ApprovalItem[]>(INITIAL_REQUESTS);
  const [logs, setLogs] = useState<AuditRecord[]>(INITIAL_LOGS);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  // การเห็นชอบระดับจังหวัด (Step 2)
  const handleApproveProvince = (reqId: string) => {
    const updated = requests.map((r) => {
      if (r.id === reqId) {
        return {
          ...r,
          status: "PROVINCE_APPROVED" as const,
          provinceReviewedAt: new Date().toLocaleTimeString("th-TH") + " น.",
        };
      }
      return r;
    });
    setRequests(updated);

    const targetReq = requests.find((r) => r.id === reqId);
    const newLog: AuditRecord = {
      id: `log-${Date.now()}`,
      action: "PROVINCIAL_ENDORSEMENT",
      target: targetReq?.schoolName || "สถานศึกษา",
      operator: "นายประวิทย์ มงคลสุข (จนท. ประสานงาน)",
      role: "จนท. จังหวัด",
      timestamp: new Date().toLocaleString("th-TH"),
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    };
    setLogs([newLog, ...logs]);
    setSuccessAlert(`ระดับจังหวัดให้ความเห็นชอบคำขอ "${targetReq?.schoolName}" สำเร็จ พร้อมส่งต่อส่วนกลาง`);
  };

  // การอนุมัติขั้นสุดท้ายระดับส่วนกลาง (Step 3) พร้อม SHA-256 Hash
  const handleApproveCentral = (reqId: string) => {
    const mockSha256 = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const updated = requests.map((r) => {
      if (r.id === reqId) {
        return {
          ...r,
          status: "FINAL_APPROVED" as const,
          centralReviewedAt: new Date().toLocaleTimeString("th-TH") + " น.",
          sha256Stamp: mockSha256,
        };
      }
      return r;
    });
    setRequests(updated);

    const targetReq = requests.find((r) => r.id === reqId);
    const newLog: AuditRecord = {
      id: `log-${Date.now()}`,
      action: "QUOTA_FINAL_APPROVAL",
      target: targetReq?.schoolName || "สถานศึกษา",
      operator: "พระมหาธีรเดช ญาณมุนี (หัวหน้าส่วนกลาง)",
      role: "ผู้บริหารส่วนกลาง",
      timestamp: new Date().toLocaleString("th-TH"),
      hash: mockSha256,
    };
    setLogs([newLog, ...logs]);
    setSuccessAlert(`ผู้บริหารส่วนกลางอนุมัติขั้นสุดท้ายสำเร็จ! ประทับตราดิจิทัล SHA-256: ${mockSha256.slice(0, 16)}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-[#e6eeff] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#002046]">
            <span>ธรรมาภิบาลและการกำกับดูแล</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[#9b4500]">MOD-04B: ขั้นตอนการอนุมัติ 2 ขั้น & ประวัติ สตง.</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0d1c2f]">
            ระบบกำกับความโปร่งใสและการอนุมัติ 2 ระดับ (Two-Tier Approval & Audit)
          </h2>
          <p className="text-xs text-slate-500">
            เส้นทางอนุมัติมีผลผูกพันทางกฎหมาย พร้อมบันทึกหลักฐานตรวจสอบย้อนกลับ (Audit Trail) ตามเกณฑ์ สตง.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            รับรองความถูกต้องด้วย SHA-256 Hash
          </span>
        </div>
      </div>

      {successAlert && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 flex items-start gap-3 shadow-sm animate-fade-in">
          <span className="material-symbols-outlined text-emerald-600 mt-0.5">verified</span>
          <div>
            <p className="font-bold">การลงนามดิจิทัลสำเร็จ:</p>
            <p>{successAlert}</p>
          </div>
        </div>
      )}

      {/* Two-Tier Workflow Cards */}
      <div className="rounded-2xl border border-[#e6eeff] bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0d1c2f]">
          รายการคำขอที่อยู่ในกระบวนการพิจารณาจัดสรรโควตา
        </h3>

        <div className="space-y-4">
          {requests.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 p-5 transition hover:border-[#87a0cd] bg-slate-50/50"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#0d1c2f] text-base">{item.schoolName}</h4>
                    <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      จ.{item.province}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    คำขอปีการศึกษา {item.academicYear} • จำนวนโควตาที่ขอรับจัดสรร: <strong>{item.requestedSlots} รูป</strong> (฿{item.monthlyBudget.toLocaleString()}/เดือน)
                  </p>
                </div>

                {/* Stepper Visualization */}
                <div className="flex items-center gap-2 text-xs">
                  {/* Step 1: School */}
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    โรงเรียนยื่น
                  </div>

                  <span className="text-slate-300">→</span>

                  {/* Step 2: Province */}
                  <div
                    className={`flex items-center gap-1.5 font-semibold ${
                      item.status === "PROVINCE_APPROVED" || item.status === "FINAL_APPROVED"
                        ? "text-emerald-700"
                        : "text-amber-600"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {item.status === "PROVINCE_APPROVED" || item.status === "FINAL_APPROVED"
                        ? "check_circle"
                        : "pending"}
                    </span>
                    จังหวัดเห็นชอบ
                  </div>

                  <span className="text-slate-300">→</span>

                  {/* Step 3: Central */}
                  <div
                    className={`flex items-center gap-1.5 font-semibold ${
                      item.status === "FINAL_APPROVED" ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {item.status === "FINAL_APPROVED" ? "verified" : "radio_button_unchecked"}
                    </span>
                    ส่วนกลางอนุมัติ
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {item.status === "SUBMITTED" && (
                    <button
                      onClick={() => handleApproveProvince(item.id)}
                      className="rounded-lg bg-[#002046] px-3 py-2 text-xs font-bold text-white shadow hover:bg-[#1b365d] transition flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">how_to_reg</span>
                      จังหวัดให้ความเห็นชอบ
                    </button>
                  )}

                  {item.status === "PROVINCE_APPROVED" && (
                    <button
                      onClick={() => handleApproveCentral(item.id)}
                      className="rounded-lg bg-[#9b4500] px-3 py-2 text-xs font-bold text-white shadow hover:bg-[#b45309] transition flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">fingerprint</span>
                      ส่วนกลางอนุมัติขั้นสุดท้าย (ประทับตรา)
                    </button>
                  )}

                  {item.status === "FINAL_APPROVED" && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-300">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      อนุมัติสมบูรณ์แล้ว
                    </span>
                  )}
                </div>
              </div>

              {item.sha256Stamp && (
                <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-mono flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-slate-400 font-sans">Digital Seal:</span>
                  <span className="text-emerald-700 font-semibold">{item.sha256Stamp}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="rounded-2xl border border-[#e6eeff] bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0d1c2f] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#002046]">policy</span>
              สมุดบันทึกประวัติการตรวจสอบแบบแก้ไขไม่ได้ (Audit Trail Ledger)
            </h3>
            <p className="text-xs text-slate-500">
              บันทึกทุกขั้นตอนการกระทำพร้อม Identity และค่าแฮช เพื่อพร้อมส่งมอบคณะกรรมการ สตง.
            </p>
          </div>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-mono text-slate-600">
            {logs.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-[#e6eeff] bg-[#f8f9ff] text-[11px] font-bold uppercase text-[#002046]">
              <tr>
                <th className="px-4 py-3">วันและเวลา</th>
                <th className="px-4 py-3">กิจกรรม (Action)</th>
                <th className="px-4 py-3">เป้าหมาย (Target)</th>
                <th className="px-4 py-3">ผู้ดำเนินการ (Operator)</th>
                <th className="px-4 py-3">ลายมือชื่อข้อมูล (SHA-256 Stamp)</th>
                <th className="px-4 py-3 text-center">ความสมบูรณ์</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3 font-semibold text-[#002046]">{log.action}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{log.target}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[#0d1c2f]">{log.operator}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({log.role})</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-400">
                    {log.hash.slice(0, 24)}...
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

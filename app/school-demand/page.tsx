"use client";

import React, { useState } from "react";
import { calculateRecommendedQuota } from "@/lib/quota-engine";

interface SchoolOption {
  id: string;
  name: string;
  schoolCode: string;
  province: string;
  district: string;
  size: string;
  type: string;
  totalStudents: number;
  totalClassrooms: number;
}

const SAMPLE_SCHOOLS: SchoolOption[] = [
  {
    id: "sch-1",
    name: "โรงเรียนวัดบ้านดอน",
    schoolCode: "SCH-10101",
    province: "สุราษฎร์ธานี",
    district: "เมือง",
    size: "MEDIUM",
    type: "GENERAL",
    totalStudents: 220,
    totalClassrooms: 8,
  },
  {
    id: "sch-2",
    name: "โรงเรียนอนุบาลเทศบาลเมืองเชียงใหม่",
    schoolCode: "SCH-50102",
    province: "เชียงใหม่",
    district: "เมือง",
    size: "EXTRA_LARGE",
    type: "GENERAL",
    totalStudents: 1450,
    totalClassrooms: 36,
  },
  {
    id: "sch-3",
    name: "โรงเรียนบ้านขอบฟ้าดอยสูง (ชายแดน)",
    schoolCode: "SCH-58203",
    province: "แม่ฮ่องสอน",
    district: "ปาย",
    size: "SMALL",
    type: "REMOTE_BORDER",
    totalStudents: 85,
    totalClassrooms: 6,
  },
  {
    id: "sch-4",
    name: "โรงเรียนชุมชนพัฒนาบ้านทุ่ง",
    schoolCode: "SCH-40204",
    province: "ขอนแก่น",
    district: "ชุมแพ",
    size: "LARGE",
    type: "OPPORTUNITY_EXPAND",
    totalStudents: 620,
    totalClassrooms: 18,
  },
];

export default function SchoolDemandPage() {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(SAMPLE_SCHOOLS[0].id);
  const selectedSchool = SAMPLE_SCHOOLS.find((s) => s.id === selectedSchoolId) || SAMPLE_SCHOOLS[0];

  const [studentCount, setStudentCount] = useState<number>(selectedSchool.totalStudents);
  const [classroomCount, setClassroomCount] = useState<number>(selectedSchool.totalClassrooms);
  const [schoolType, setSchoolType] = useState<string>(selectedSchool.type);
  const [justification, setJustification] = useState<string>("");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // คำนวณขนาดโรงเรียนอัตโนมัติตามเกณฑ์ PRD
  let computedSize = "MEDIUM";
  if (studentCount <= 120) computedSize = "SMALL";
  else if (studentCount <= 300) computedSize = "MEDIUM";
  else if (studentCount <= 1000) computedSize = "LARGE";
  else computedSize = "EXTRA_LARGE";

  // คำนวณโควตาแนะนำผ่าน Engine จริง
  const quotaResult = calculateRecommendedQuota({
    totalStudents: studentCount,
    size: computedSize,
    type: schoolType,
  });

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = SAMPLE_SCHOOLS.find((s) => s.id === e.target.value);
    if (found) {
      setSelectedSchoolId(found.id);
      setStudentCount(found.totalStudents);
      setClassroomCount(found.totalClassrooms);
      setSchoolType(found.type);
      setSubmittedMessage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage(
      `บันทึกคำขอโควตาสำหรับ "${selectedSchool.name}" เรียบร้อยแล้ว! จำนวนที่ขอรับการจัดสรร: ${quotaResult.recommendedSlots} รูป สถานะ: รอจังหวัดตรวจสอบ (SUBMITTED)`
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-[#e6eeff] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#002046]">
            <span>ระบบสถานศึกษา</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[#9b4500]">MOD-01: ยื่นคำขอโควตา</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0d1c2f]">
            แบบคำขอรับการจัดสรรพระสอนศีลธรรม ประจำปีการศึกษา 2568
          </h2>
          <p className="text-xs text-slate-500">
            คำนวณสัดส่วนโควตาแนะนำอัตโนมัติตามจำนวนนักเรียนและเกณฑ์กระทรวง (PRD 4.1)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            รอบเปิดรับคำขอ (Open Window)
          </span>
        </div>
      </div>

      {submittedMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 flex items-start gap-3 shadow-sm animate-fade-in">
          <span className="material-symbols-outlined text-emerald-600 mt-0.5">check_circle</span>
          <div>
            <p className="font-bold">สำเร็จ!</p>
            <p>{submittedMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#e6eeff] bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-[#0d1c2f] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#002046]">school</span>
              ข้อมูลสถานศึกษาและการยื่นคำขอ
            </h3>

            {/* School Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลือกสถานศึกษาในสังกัด (ตัวอย่างข้อมูลจากระบบ SIS)
              </label>
              <select
                value={selectedSchoolId}
                onChange={handleSchoolChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0d1c2f] focus:border-[#002046] focus:outline-none"
              >
                {SAMPLE_SCHOOLS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.schoolCode}) — {s.province}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid 2 Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  จำนวนนักเรียนทั้งหมด (คน) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#002046] focus:outline-none"
                  required
                />
                <span className="text-[11px] text-slate-400">ใช้คำนวณฐานสัดส่วน 1:100</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  จำนวนห้องเรียนทั้งหมด (ห้อง)
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={classroomCount}
                  onChange={(e) => setClassroomCount(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#002046] focus:outline-none"
                />
                <span className="text-[11px] text-slate-400">ประมาณ 1 คาบ/สัปดาห์/ห้อง</span>
              </div>
            </div>

            {/* School Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประเภทและลักษณะพื้นที่ของสถานศึกษา
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label
                  className={`flex cursor-pointer items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition ${
                    schoolType === "GENERAL"
                      ? "border-[#002046] bg-[#eff4ff] text-[#002046]"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="schoolType"
                    value="GENERAL"
                    checked={schoolType === "GENERAL"}
                    onChange={() => setSchoolType("GENERAL")}
                    className="sr-only"
                  />
                  โรงเรียนทั่วไป (1.0x)
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition ${
                    schoolType === "OPPORTUNITY_EXPAND"
                      ? "border-[#002046] bg-[#eff4ff] text-[#002046]"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="schoolType"
                    value="OPPORTUNITY_EXPAND"
                    checked={schoolType === "OPPORTUNITY_EXPAND"}
                    onChange={() => setSchoolType("OPPORTUNITY_EXPAND")}
                    className="sr-only"
                  />
                  ขยายโอกาส (1.2x)
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition ${
                    schoolType === "REMOTE_BORDER"
                      ? "border-[#002046] bg-[#eff4ff] text-[#002046]"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="schoolType"
                    value="REMOTE_BORDER"
                    checked={schoolType === "REMOTE_BORDER"}
                    onChange={() => setSchoolType("REMOTE_BORDER")}
                    className="sr-only"
                  />
                  ชายขอบ/ห่างไกล (1.2x)
                </label>
              </div>
            </div>

            {/* Justification Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เหตุผลความจำเป็นและแผนการจัดการเรียนรู้ (Justification Notes)
              </label>
              <textarea
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="ระบุระดับชั้นที่ต้องการเปิดสอน และโครงการส่งเสริมคุณธรรมที่สอดรับ..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-[#002046] focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#002046] py-3 text-sm font-bold text-white shadow transition hover:bg-[#1b365d] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">send</span>
              ส่งคำขอรับการจัดสรรโควตาอย่างเป็นทางการ
            </button>
          </form>
        </div>

        {/* Live Calculation Recommendation Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#c4c6cf]/50 bg-gradient-to-br from-white to-[#eff4ff] p-6 shadow-sm">
            <span className="rounded-full bg-[#fd8a42]/20 px-3 py-1 text-xs font-bold text-[#9b4500] border border-[#fd8a42]/40">
              AI & Formula Recommendation
            </span>

            <h3 className="mt-3 text-lg font-bold text-[#0d1c2f]">
              ผลการประเมินโควตาแนะนำอัตโนมัติ
            </h3>
            <p className="text-xs text-slate-500">
              คำนวณแบบ Real-time ตามสูตร Q_rec = min(Cap, ceil(N/100) x W)
            </p>

            {/* Big Number Card */}
            <div className="mt-5 rounded-xl border border-[#87a0cd]/30 bg-white p-5 text-center shadow-inner">
              <span className="text-xs font-semibold uppercase text-slate-500">
                จำนวนโควตาพระสอนที่แนะนำ
              </span>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-5xl font-extrabold text-[#002046]">
                  {quotaResult.recommendedSlots}
                </span>
                <span className="text-base font-medium text-slate-500">รูป</span>
              </div>

              {quotaResult.cappedBy && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  {quotaResult.cappedBy}
                </span>
              )}
            </div>

            {/* Calculation Breakdown Matrix */}
            <div className="mt-5 space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">ขนาดโรงเรียนคำนวณได้:</span>
                <strong className="text-[#0d1c2f]">{computedSize}</strong>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">สัดส่วนนักเรียน (100 คน / รูป):</span>
                <strong className="text-[#0d1c2f]">
                  {Math.ceil(studentCount / 100)} รูป
                </strong>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">ตัวคูณลักษณะพื้นที่:</span>
                <strong className="text-[#0d1c2f]">{quotaResult.weightMultiplier}x</strong>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">คาบสอนที่ต้องเปิดรองรับ:</span>
                <strong className="text-[#0d1c2f]">{classroomCount} คาบ/สัปดาห์</strong>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">ประมาณการเงินนิตยภัต:</span>
                <strong className="text-emerald-700 font-bold">
                  ฿{(quotaResult.recommendedSlots * 2500).toLocaleString()} / เดือน
                </strong>
              </div>
            </div>

            {/* Explanatory Note */}
            <div className="mt-5 rounded-lg bg-[#d6e3ff]/40 p-3 text-[11px] text-[#002046]">
              <p className="font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                หลักเกณฑ์ความโปร่งใส:
              </p>
              <p className="mt-1">
                {quotaResult.explanation} เพื่อให้กระจายอัตรากำลังอย่างเป็นธรรมและป้องกันการกระจุกตัวในโรงเรียนขนาดใหญ่
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// lib/quota-engine.ts

export interface SchoolQuotaParams {
  totalStudents: number;
  totalClassrooms?: number;
  size: "SMALL" | "MEDIUM" | "LARGE" | "EXTRA_LARGE" | string;
  type: "GENERAL" | "OPPORTUNITY_EXPAND" | "REMOTE_BORDER" | string;
}

export interface QuotaCalculationResult {
  recommendedSlots: number;
  rawCalculatedSlots: number;
  cappedBy: string | null;
  weightMultiplier: number;
  explanation: string;
}

/**
 * คำนวณจำนวนโควตาพระสอนศีลธรรมที่เหมาะสมตามสูตรมาตรฐานใน PRD 4.1
 */
export function calculateRecommendedQuota(params: SchoolQuotaParams): QuotaCalculationResult {
  const { totalStudents, size, type } = params;

  // 1. กำหนดอัตราส่วนนักเรียนมาตรฐาน (นักเรียน 100 คน ต่อพระ 1 รูป)
  const RATIO_STUDENTS = 100;
  const baseSlots = Math.max(1, Math.ceil(totalStudents / RATIO_STUDENTS));

  // 2. กำหนดค่าน้ำหนักตามลักษณะสถานศึกษา (Weight Multiplier)
  let weightMultiplier = 1.0;
  if (type === "OPPORTUNITY_EXPAND" || type === "REMOTE_BORDER") {
    weightMultiplier = 1.2;
  }

  const rawCalculated = Math.round(baseSlots * weightMultiplier);

  // 3. กำหนดเพดานโควตาสูงสุดตามขนาดโรงเรียน (Hard Cap)
  let cap = 2;
  switch (size) {
    case "SMALL":
      cap = 1;
      break;
    case "MEDIUM":
      cap = 2;
      break;
    case "LARGE":
      cap = 4;
      break;
    case "EXTRA_LARGE":
      cap = 6;
      break;
    default:
      cap = 2;
  }

  const finalSlots = Math.min(cap, Math.max(1, rawCalculated));
  const cappedBy = rawCalculated > cap ? `เพดานขนาดโรงเรียน (${size} สูงสุด ${cap} รูป)` : null;

  return {
    recommendedSlots: finalSlots,
    rawCalculatedSlots: rawCalculated,
    cappedBy,
    weightMultiplier,
    explanation: `คำนวณจากนักเรียน ${totalStudents} คน (สัดส่วน 1:100) ตัวคูณพื้นที่ ${weightMultiplier}x ${
      cappedBy ? `และถูกจำกัดด้วย ${cappedBy}` : ""
    }`,
  };
}

/**
 * ตรวจสอบความถูกต้องของภาระงานพระสอน (Workload Overload Guard)
 */
export function validateMonkWorkload(
  currentWeeklyHours: number,
  additionalHours: number,
  maxAllowedHours = 20
): { isValid: boolean; message?: string } {
  const total = currentWeeklyHours + additionalHours;
  if (total > maxAllowedHours) {
    return {
      isValid: false,
      message: `ภาระงานสอนรวม ${total} คาบ/สัปดาห์ เกินเกณฑ์มาตรฐานที่กำหนดไว้ไม่เกิน ${maxAllowedHours} คาบ/สัปดาห์`,
    };
  }
  return { isValid: true };
}

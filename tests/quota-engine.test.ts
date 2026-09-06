// tests/quota-engine.test.ts
import { describe, it, expect } from "vitest";
import { calculateRecommendedQuota, validateMonkWorkload } from "../lib/quota-engine";
import { simulateBudgetAdjustment, SchoolBudgetRecord } from "../lib/budget-engine";

describe("Quota Calculation Engine (PRD 4.1)", () => {
  it("ควรจำกัดโควตาโรงเรียนขนาดเล็กไม่เกิน 1 รูป (Small School Cap)", () => {
    const result = calculateRecommendedQuota({
      totalStudents: 110,
      size: "SMALL",
      type: "GENERAL",
    });

    expect(result.recommendedSlots).toBe(1);
  });

  it("ควรจำกัดโควตาโรงเรียนขนาดกลางไม่เกิน 2 รูป (Medium School Cap)", () => {
    const result = calculateRecommendedQuota({
      totalStudents: 250,
      size: "MEDIUM",
      type: "GENERAL",
    });

    expect(result.recommendedSlots).toBe(2);
  });

  it("ควรจำกัดโควตาโรงเรียนขนาดใหญ่พิเศษไม่เกินเพดาน 6 รูป (Hard Cap)", () => {
    const result = calculateRecommendedQuota({
      totalStudents: 1800,
      size: "EXTRA_LARGE",
      type: "GENERAL",
    });

    expect(result.recommendedSlots).toBe(6);
    expect(result.cappedBy).toContain("EXTRA_LARGE สูงสุด 6 รูป");
  });

  it("ควรให้ค่าน้ำหนักพิเศษ 1.2 แก่โรงเรียนขยายโอกาสและพื้นที่ห่างไกล", () => {
    const result = calculateRecommendedQuota({
      totalStudents: 200,
      size: "LARGE",
      type: "REMOTE_BORDER",
    });

    expect(result.weightMultiplier).toBe(1.2);
  });
});

describe("Workload Overload Guard (PRD 4.2)", () => {
  it("ควรอนุญาตเมื่อภาระงานรวมไม่เกิน 20 คาบต่อสัปดาห์", () => {
    const check = validateMonkWorkload(12, 6, 20);
    expect(check.isValid).toBe(true);
  });

  it("ควรปฏิเสธเมื่อภาระงานรวมเกิน 20 คาบต่อสัปดาห์", () => {
    const check = validateMonkWorkload(15, 8, 20);
    expect(check.isValid).toBe(false);
    expect(check.message).toContain("เกินเกณฑ์มาตรฐาน");
  });
});

describe("Budget Simulation Engine (MOD-04)", () => {
  const mockSchools: SchoolBudgetRecord[] = [
    { schoolId: "1", name: "รร. ทั่วไป A", type: "GENERAL", allocatedSlots: 4 },
    { schoolId: "2", name: "รร. ทั่วไป B", type: "GENERAL", allocatedSlots: 3 },
    { schoolId: "3", name: "รร. ขยายโอกาส C", type: "OPPORTUNITY_EXPAND", allocatedSlots: 2 },
    { schoolId: "4", name: "รร. ชายแดน D", type: "REMOTE_BORDER", allocatedSlots: 1 },
  ];

  it("ควรคำนวณฐานงบประมาณรายปีถูกต้อง (2,500 บ./ด./รูป x 12 เดือน)", () => {
    const result = simulateBudgetAdjustment(mockSchools, 0);
    // รวม 10 โควตา * 2,500 * 12 = 300,000 บาท
    expect(result.baseTotalSlots).toBe(10);
    expect(result.baseAnnualBudget).toBe(300000);
  });

  it("ควรปกป้องโรงเรียนขยายโอกาสและพื้นที่ชายแดนเมื่อเกิดการตัดงบประมาณ", () => {
    const result = simulateBudgetAdjustment(mockSchools, -20);
    expect(result.priorityProtectedCount).toBe(3); // 2 + 1 จากโรงเรียนกลุ่มเปราะบาง
    expect(result.simulatedTotalSlots).toBeLessThan(result.baseTotalSlots);
  });
});

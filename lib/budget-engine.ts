// lib/budget-engine.ts

export const MONTHLY_STIPEND_PER_MONK = 2500; // 2,500 บาท/เดือน/รูป
export const MONTHS_IN_FISCAL_YEAR = 12;

export interface SchoolBudgetRecord {
  schoolId: string;
  name: string;
  type: string;
  allocatedSlots: number;
}

export interface SimulationResult {
  baseTotalSlots: number;
  baseAnnualBudget: number;
  simulatedTotalSlots: number;
  simulatedAnnualBudget: number;
  percentageChange: number;
  budgetDifference: number;
  slotsDifference: number;
  priorityProtectedCount: number;
  affectedSchoolsCount: number;
}

/**
 * จำลองงบประมาณแบบ What-If Scenario
 */
export function simulateBudgetAdjustment(
  schools: SchoolBudgetRecord[],
  percentageChange: number // เช่น -10 หมายถึง ลดลง 10%
): SimulationResult {
  const baseTotalSlots = schools.reduce((sum, s) => sum + s.allocatedSlots, 0);
  const baseAnnualBudget = baseTotalSlots * MONTHLY_STIPEND_PER_MONK * MONTHS_IN_FISCAL_YEAR;

  const targetSlots = Math.max(1, Math.round(baseTotalSlots * (1 + percentageChange / 100)));
  const slotsDiff = targetSlots - baseTotalSlots;

  // การจัดสรรหรือตัดลดตามลำดับความสำคัญ (Priority Tiering)
  let simulatedTotalSlots = baseTotalSlots;
  let affectedSchoolsCount = 0;
  let priorityProtectedCount = 0;

  if (slotsDiff < 0) {
    // กรณีงบถูกตัด: ปกป้องโรงเรียนกลุ่มเปราะบาง (REMOTE_BORDER และ OPPORTUNITY_EXPAND)
    let slotsToCut = Math.abs(slotsDiff);

    for (const school of schools) {
      if (school.type === "REMOTE_BORDER" || school.type === "OPPORTUNITY_EXPAND") {
        priorityProtectedCount += school.allocatedSlots;
      } else if (school.allocatedSlots > 1 && slotsToCut > 0) {
        slotsToCut -= 1;
        affectedSchoolsCount += 1;
        simulatedTotalSlots -= 1;
      }
    }
  } else if (slotsDiff > 0) {
    // กรณีได้งบเพิ่ม: กระจายให้โรงเรียนที่มีความต้องการ
    simulatedTotalSlots += slotsDiff;
    affectedSchoolsCount = Math.min(schools.length, slotsDiff);
  }

  const simulatedAnnualBudget = simulatedTotalSlots * MONTHLY_STIPEND_PER_MONK * MONTHS_IN_FISCAL_YEAR;
  const budgetDifference = simulatedAnnualBudget - baseAnnualBudget;

  return {
    baseTotalSlots,
    baseAnnualBudget,
    simulatedTotalSlots,
    simulatedAnnualBudget,
    percentageChange,
    budgetDifference,
    slotsDifference: simulatedTotalSlots - baseTotalSlots,
    priorityProtectedCount,
    affectedSchoolsCount,
  };
}

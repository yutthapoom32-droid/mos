// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 เริ่มต้นการ Seed ข้อมูลจำลองสำหรับโครงการพระสอนศีลธรรม...");

  // ล้างข้อมูลเก่า
  await prisma.auditLog.deleteMany();
  await prisma.budgetDisbursementPlan.deleteMany();
  await prisma.quotaAllocation.deleteMany();
  await prisma.schoolDemandRequest.deleteMany();
  await prisma.monk.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();

  // 1. สร้าง Users
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@moralmonk.go.th",
      fullName: "พระมหาธีรเดช ญาณมุนี (หัวหน้าส่วนกลาง)",
      passwordHash: "hash_admin",
      role: "CENTRAL_ADMIN",
    },
  });

  const provinceUser = await prisma.user.create({
    data: {
      email: "province.cm@moralmonk.go.th",
      fullName: "นายประวิทย์ มงคลสุข (จนท. ประสานงานเชียงใหม่)",
      passwordHash: "hash_province",
      role: "PROVINCIAL_OFFICER",
    },
  });

  // 2. สร้าง Schools
  const school1 = await prisma.school.create({
    data: {
      schoolCode: "SCH-10101",
      name: "โรงเรียนวัดบ้านดอน",
      size: "MEDIUM",
      type: "GENERAL",
      province: "สุราษฎร์ธานี",
      district: "เมือง",
      subDistrict: "ดอน",
      totalStudents: 220,
      totalClassrooms: 8,
    },
  });

  const school2 = await prisma.school.create({
    data: {
      schoolCode: "SCH-50102",
      name: "โรงเรียนอนุบาลเทศบาลเมืองเชียงใหม่",
      size: "EXTRA_LARGE",
      type: "GENERAL",
      province: "เชียงใหม่",
      district: "เมือง",
      subDistrict: "ช้างคลาน",
      totalStudents: 1450,
      totalClassrooms: 36,
    },
  });

  const school3 = await prisma.school.create({
    data: {
      schoolCode: "SCH-58203",
      name: "โรงเรียนบ้านขอบฟ้าดอยสูง (ชายแดน)",
      size: "SMALL",
      type: "REMOTE_BORDER",
      province: "แม่ฮ่องสอน",
      district: "ปาย",
      subDistrict: "เวียงเหนือ",
      totalStudents: 85,
      totalClassrooms: 6,
    },
  });

  const school4 = await prisma.school.create({
    data: {
      schoolCode: "SCH-40204",
      name: "โรงเรียนชุมชนพัฒนาบ้านทุ่ง",
      size: "LARGE",
      type: "OPPORTUNITY_EXPAND",
      province: "ขอนแก่น",
      district: "ชุมแพ",
      subDistrict: "หนองไผ่",
      totalStudents: 620,
      totalClassrooms: 18,
    },
  });

  // 3. สร้าง Monks
  const monk1 = await prisma.monk.create({
    data: {
      identificationNumber: "1849900123451",
      monasticCertNumber: "สธ-66/012",
      dharmaName: "ปญฺญาวโร",
      firstName: "สมชาย",
      lastName: "จันทร์ดี",
      templeName: "วัดบ้านดอน",
      templeProvince: "สุราษฎร์ธานี",
      dharmaEducationLevel: "เปรียญธรรม ๖ ประโยค",
      secularEducation: "พุทธศาสตรบัณฑิต (มจร)",
      status: "ACTIVE",
      maxWeeklyHours: 20,
    },
  });

  const monk2 = await prisma.monk.create({
    data: {
      identificationNumber: "1509900987652",
      monasticCertNumber: "ชม-65/489",
      dharmaName: "ชิตมาร",
      firstName: "ประเสริฐ",
      lastName: "วงค์คำ",
      templeName: "วัดพระสิงห์วรมหาวิหาร",
      templeProvince: "เชียงใหม่",
      dharmaEducationLevel: "เปรียญธรรม ๙ ประโยค",
      secularEducation: "พุทธศาสตรมหาบัณฑิต",
      status: "ACTIVE",
      maxWeeklyHours: 20,
    },
  });

  const monk3 = await prisma.monk.create({
    data: {
      identificationNumber: "1459900332211",
      monasticCertNumber: "ขก-66/201",
      dharmaName: "ญาณสมฺปนฺโน",
      firstName: "วินัย",
      lastName: "โพธิ์แก้ว",
      templeName: "วัดหนองแวง",
      templeProvince: "ขอนแก่น",
      dharmaEducationLevel: "นักธรรมชั้นเอก",
      secularEducation: "ศศ.บ. ปรัชญา",
      status: "ACTIVE",
      maxWeeklyHours: 20,
    },
  });

  const monkDisrobed = await prisma.monk.create({
    data: {
      identificationNumber: "1729900887766",
      monasticCertNumber: "มส-64/110",
      dharmaName: "อธิวโร",
      firstName: "สุรศักดิ์",
      lastName: "สุขุม",
      templeName: "วัดดอยแม่ฮ่องสอน",
      templeProvince: "แม่ฮ่องสอน",
      dharmaEducationLevel: "นักธรรมชั้นโท",
      status: "DISROBED", // ลาสิกขาแล้ว สำหรับทดสอบเคส slot vacant
      maxWeeklyHours: 20,
    },
  });

  // 4. สร้าง Demand Requests & Allocations
  const req1 = await prisma.schoolDemandRequest.create({
    data: {
      schoolId: school1.id,
      academicYear: 2568,
      requestedSlots: 2,
      weeklyPeriodsNeeded: 8,
      justificationNotes: "ต้องการพระสอนอบรมคุณธรรมนักเรียน ม.1-3 และประถมปลาย",
      status: "FINAL_APPROVED",
    },
  });

  await prisma.quotaAllocation.create({
    data: {
      schoolId: school1.id,
      demandRequestId: req1.id,
      monkId: monk1.id,
      academicYear: 2568,
      allocatedPeriods: 8,
      status: "ASSIGNED",
    },
  });

  const req2 = await prisma.schoolDemandRequest.create({
    data: {
      schoolId: school2.id,
      academicYear: 2568,
      requestedSlots: 4,
      weeklyPeriodsNeeded: 16,
      justificationNotes: "โรงเรียนขนาดใหญ่ มีนักเรียน 1,450 คน จัดสอนระดับประถมทั้งหมด",
      status: "PROVINCE_APPROVED",
    },
  });

  await prisma.quotaAllocation.create({
    data: {
      schoolId: school2.id,
      demandRequestId: req2.id,
      monkId: monk2.id,
      academicYear: 2568,
      allocatedPeriods: 10,
      status: "ASSIGNED",
    },
  });

  const req3 = await prisma.schoolDemandRequest.create({
    data: {
      schoolId: school3.id,
      academicYear: 2568,
      requestedSlots: 1,
      weeklyPeriodsNeeded: 4,
      justificationNotes: "โรงเรียนชายขอบดอยสูง ขาดแคลนครูด้านจริยธรรม",
      status: "FINAL_APPROVED",
    },
  });

  // โควตาที่พระเดิมลาสิกขา -> สถานะ SLOT_VACANT
  await prisma.quotaAllocation.create({
    data: {
      schoolId: school3.id,
      demandRequestId: req3.id,
      monkId: monkDisrobed.id,
      academicYear: 2568,
      allocatedPeriods: 4,
      status: "SLOT_VACANT",
    },
  });

  // 5. บันทึก Audit Log เริ่มต้น
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "INITIAL_SYSTEM_SEED",
      targetEntity: "SYSTEM",
      targetId: "SYSTEM_ROOT",
      newValues: JSON.stringify({ message: "ระบบเริ่มต้นด้วยข้อมูลตั้งต้น 4 สถานศึกษา 4 พระสอน" }),
      hashStamp: "a8f5c632810a9bd6bcf45a1902f4316d99e52e505a49cd07c2934ec7f9655f4c",
      ipAddress: "127.0.0.1",
    },
  });

  console.log("✅ Seed ข้อมูลจำลองเรียบร้อยแล้ว!");
}

main()
  .catch((e) => {
    console.error("❌ Seed เกิดข้อผิดพลาด:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('開始播種資料庫...');

  // 清除現有數據（開發環境）
  if (process.env.NODE_ENV !== 'production') {
    await prisma.user.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.material.deleteMany();
    console.log('已清除現有數據');
  }

  // 建立預設管理員帳戶
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@construction.com' },
    update: {},
    create: {
      email: 'admin@construction.com',
      username: 'admin',
      password: hashedPassword,
      name: '系統管理員',
      role: 'ADMIN',
      department: '資訊部',
      phone: '02-1234-5678',
    },
  });

  // 建立測試使用者
  const managerPassword = await bcrypt.hash('manager123', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@construction.com' },
    update: {},
    create: {
      email: 'manager@construction.com',
      username: 'manager',
      password: managerPassword,
      name: '專案經理',
      role: 'MANAGER',
      department: '工程部',
      phone: '02-1234-5679',
    },
  });

  const staffPassword = await bcrypt.hash('staff123', 12);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@construction.com' },
    update: {},
    create: {
      email: 'staff@construction.com',
      username: 'staff',
      password: staffPassword,
      name: '一般員工',
      role: 'STAFF',
      department: '採購部',
      phone: '02-1234-5680',
    },
  });

  console.log('已建立預設使用者:', { admin: admin.email, manager: manager.email, staff: staff.email });

  // 建立預設廠商
  const suppliers = await prisma.supplier.createMany({
    data: [
      {
        name: '台灣建材股份有限公司',
        code: 'SUP001',
        contactPerson: '王小明',
        phone: '02-2345-6789',
        email: 'contact@tw-building.com',
        address: '台北市信義區信義路五段7號',
        taxNumber: '12345678',
        paymentTerms: '月結30天',
        rating: 5,
      },
      {
        name: '永豐水泥工業股份有限公司',
        code: 'SUP002',
        contactPerson: '李大華',
        phone: '07-345-6789',
        email: 'sales@yf-cement.com',
        address: '高雄市前鎮區中山二路100號',
        taxNumber: '23456789',
        paymentTerms: '月結45天',
        rating: 4,
      },
      {
        name: '大同鋼鐵工業有限公司',
        code: 'SUP003',
        contactPerson: '張美玲',
        phone: '04-2345-6789',
        email: 'info@datong-steel.com',
        address: '台中市西屯區工業區三路25號',
        taxNumber: '34567890',
        paymentTerms: '即期',
        rating: 4,
      },
    ],
  });

  console.log('已建立', suppliers.count, '個預設廠商');

  // 建立預設材料
  const materials = await prisma.material.createMany({
    data: [
      {
        name: '混凝土 C280',
        code: 'MAT001',
        category: '混凝土',
        unit: '立方公尺',
        specification: 'C280 抗壓強度280kg/cm²',
        brand: '台泥',
        model: 'C280',
      },
      {
        name: '鋼筋 #4',
        code: 'MAT002',
        category: '鋼筋',
        unit: '公噸',
        specification: 'SD420W 13mm',
        brand: '中鋼',
        model: '#4-SD420W',
      },
      {
        name: '磁磚 60x60cm',
        code: 'MAT003',
        category: '磁磚',
        unit: '坪',
        specification: '拋光石英磚 60x60cm',
        brand: '冠軍磁磚',
        model: 'GT6060',
      },
      {
        name: 'H型鋼 200x100',
        code: 'MAT004',
        category: '結構鋼',
        unit: '公噸',
        specification: 'SS400 H-200x100x5.5x8',
        brand: '中鋼',
        model: 'H200x100',
      },
      {
        name: '防水材料',
        code: 'MAT005',
        category: '防水材料',
        unit: '平方公尺',
        specification: 'PU防水塗料 2mm厚',
        brand: '永記造漆',
        model: 'PU-2000',
      },
    ],
  });

  console.log('已建立', materials.count, '個預設材料');

  // 建立範例專案
  const project = await prisma.project.create({
    data: {
      name: '台北101商場改建專案',
      code: 'PRJ001',
      description: '台北101購物中心5樓改建工程',
      location: '台北市信義區信義路五段7號',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      estimatedCost: 5000000, // 500萬
      status: 'IN_PROGRESS',
      clientName: '台北101股份有限公司',
      clientContact: '陳總經理 (02-8101-8800)',
      createdById: admin.id,
      managerId: manager.id,
    },
  });

  console.log('已建立範例專案:', project.name);

  // 建立預算
  const budget = await prisma.budget.create({
    data: {
      projectId: project.id,
      version: 1,
      totalAmount: 5000000,
      remainingAmount: 5000000,
      status: 'APPROVED',
      approvedById: admin.id,
      approvedAt: new Date(),
      items: {
        create: [
          {
            category: '結構工程',
            item: '混凝土澆置',
            unit: '立方公尺',
            quantity: 100,
            unitPrice: 8000,
            totalPrice: 800000,
          },
          {
            category: '結構工程',
            item: '鋼筋綁紮',
            unit: '公噸',
            quantity: 15,
            unitPrice: 35000,
            totalPrice: 525000,
          },
          {
            category: '裝修工程',
            item: '磁磚舖設',
            unit: '坪',
            quantity: 200,
            unitPrice: 3500,
            totalPrice: 700000,
          },
        ],
      },
    },
  });

  console.log('已建立專案預算:', budget.totalAmount);

  console.log('資料庫播種完成！');
  console.log('\n預設帳戶資訊:');
  console.log('管理員 - Email: admin@construction.com, Password: admin123');
  console.log('經理 - Email: manager@construction.com, Password: manager123');
  console.log('員工 - Email: staff@construction.com, Password: staff123');
}

main()
  .catch((e) => {
    console.error('播種失敗:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
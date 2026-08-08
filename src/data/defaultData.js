import { generateId } from "../utils/generateId";
import shamCashImage from "./Sham Cash.jpeg";
/**
 * البيانات الافتراضية للتطبيق
 * تُحمّل عند أول تشغيل فقط
 */

export const DEFAULT_SETTINGS = {
  teamName: "فريق أثر التطوعي",
  teamDescription: "معاً نصنع الفرق، كل تبرع يصنع أثراً في حياة الآخرين",
  goalAmount: 5000000,
  currentAmount: 2450000,
  donorsCount: 128,
  daysLeft: 15,
  whatsapp: "963982934617",
  phone: "+963982934617",
  email: "atharorganization683@gmail.com",
  logoUrl: "",
  siteIcon: "/60187.png",
};

export const DEFAULT_PAYMENTS = [
  // {
  //   id: generateId(),
  //   name: "سيرياتيل كاش",
  //   accountNumber: "0933123456",
  //   accountName: "فريق أثر التطوعي",
  //   description: "اكتب تبرع في الوصف",
  //   icon: "fa-mobile",
  //   color: "purple",
  //   isActive: true,
  //   createdAt: "2026-07-25",
  // },
  // {
  //   id: generateId(),
  //   name: "بنك البركة",
  //   accountNumber: "1020304050",
  //   accountName: "فريق أثر التطوعي",
  //   description: "حساب بنكي رسمي",
  //   icon: "fa-building-columns",
  //   color: "teal",
  //   createdAt: "2026-07-25",
  // },
  {
    id: generateId(),
    name: "الشام كاش",
    accountNumber: "38ad341039cb3bdfd1d931d80deb3037",
    accountName: "Athar Academy Foundation",
    description: "حساب الشام كاش",
    icon: "fa-wallet",
    color: "blue",
    image: shamCashImage,
    createdAt: "2026-07-25",
  },
];

export const ICON_OPTIONS = [
  { value: "fa-mobile", label: "موبايل" },
  { value: "fa-building-columns", label: "بنك" },
  { value: "fa-wallet", label: "محفظة" },
  { value: "fa-credit-card", label: "بطاقة" },
  { value: "fa-money-bill", label: "نقدي" },
  { value: "fa-university", label: "جامعة" },
];

export const COLOR_OPTIONS = [
  { value: "purple", label: "بنفسجي", hex: "#7B5AA6" },
  { value: "teal", label: "تركوازي", hex: "#2EC4B6" },
  { value: "blue", label: "أزرق", hex: "#4A90D9" },
  { value: "green", label: "أخضر", hex: "#10B981" },
];

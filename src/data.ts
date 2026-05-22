import { Code2, BrainCircuit, Cpu, MessageSquare, Wallet, CreditCard, LayoutGrid, Terminal, Zap, Shield, Rocket, Globe, LucideIcon } from "lucide-react";

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tags: string[];
  status: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  skills: string[];
  experience: string;
  links: { linkedin: string; github: string };
}

export interface Value {
  title: string;
  desc: string;
  icon: LucideIcon;
}

export const LOGO_URL = "https://i.ibb.co/h1ZGTwxr/logo.png";

export const PROJECTS: Project[] = [
  {
    id: "codeusta",
    name: "Codeusta",
    description: "Dasturlash, IT-echimlar va texnologik xizmatlar platformasi. Dasturchilar va biznesni yuqori darajadagi dasturiy vositalar bilan ta'minlaydi.",
    icon: Terminal,
    color: "from-sky-400 to-blue-600",
    tags: ["Dasturlash", "IT Infrastruktura"],
    status: "TAYYOR v2.0"
  },
  {
    id: "intelektai",
    name: "IntelektAI",
    description: "Murakkab ma'lumotlarni qayta ishlash uchun AI-ga asoslangan xizmatlar va aqlli tizimlarni ishlab chiqishga yo'naltirilgan ilg'or loyiha.",
    icon: BrainCircuit,
    color: "from-sky-400 to-blue-600",
    tags: ["AI", "Aqlli Tizimlar"],
    status: "BETA TEST"
  },
  {
    id: "wentric-ai",
    name: "Wentric AI",
    description: "Yangi avlod AI mahsulotlari va avtomatlashtirish platformasi. Inson va AI hamkorligining kelajagini shakllantiramiz.",
    icon: Cpu,
    color: "from-sky-400 to-blue-600",
    tags: ["Avtomatlashtirish", "Yangi Avlod AI"],
    status: "RIVOJLANISHDA"
  },
  {
    id: "vibogram",
    name: "Vibogram",
    description: "Innovatsion tarmoq platformalari orqali ijtimoiy aloqa va raqamli bog'liqlikning kelajagini rivojlantirish.",
    icon: MessageSquare,
    color: "from-sky-400 to-blue-600",
    tags: ["Ijtimoiy", "Aloqa"],
    status: "BARQAROR"
  },
  {
    id: "paynest",
    name: "Paynest",
    description: "Uzluksiz pul o'tkazmalari uchun zamonaviy to'lov tizimlari va moliyaviy texnologiyalar (FinTech) platformasi.",
    icon: Wallet,
    color: "from-sky-400 to-blue-600",
    tags: ["FinTech", "Bank xizmatlari"],
    status: "LITSENZIYALANGAN"
  },
  {
    id: "makerpay",
    name: "MakerPay",
    description: "Raqamli tranzaksiyalar va biznes integratsiyasi xizmatlari. Ijodkorlar va korxonalar uchun onlayn to'lovlarni soddalashtirish.",
    icon: CreditCard,
    color: "from-sky-400 to-blue-600",
    tags: ["To'lovlar", "Biznes"],
    status: "FAOL"
  }
];

export const TEAM: TeamMember[] = [
  {
    name: "Sardor Tuyginov",
    role: "Asoschisi va CEO",
    bio: "Wentric ekotizimini boshqaruvchi istiqbolli lider. AI arxitekturasi, strategik raqamli kengayish va kengaytiriladigan ekotizimlarni qurish bo'yicha mutaxassis.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sardor",
    skills: ["AI Arxitekturasi", "Strategik Rahbarlik", "FinTech", "Mahsulot Strategiyasi"],
    experience: "Asoschi — 10 yillik tajriba",
    links: { linkedin: "#", github: "#" }
  },
  {
    name: "Alexey Volkov",
    role: "Texnik direktor (CTO)",
    bio: "Codeusta va Wentric AI ortidagi texnik daho. Yuqori unumdorlikka ega tizimlar, taqsimlangan arxitektura va AI miqyosliligi bo'yicha mutaxassis.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
    skills: ["Tizim Dizayni", "Bulutli Infratuzilma", "Full-stack", "Avtomatlashtirish"],
    experience: "Katta Muhandis",
    links: { linkedin: "#", github: "#" }
  },
  {
    name: "Elena Karimova",
    role: "AI bo'limi rahbari",
    bio: "IntelektAI-da tadqiqotlarni boshqaradi. Neyron tarmoqlari, LLM-lar va inson markaziyligidagi AI modellarini yaratish uchun NLP bo'yicha ixtisoslashgan.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    skills: ["NLP", "Neyron Tarmoqlari", "Data Science", "Ethical AI"],
    experience: "Ph.D. Tadqiqotchi",
    links: { linkedin: "#", github: "#" }
  },
  {
    name: "Alex",
    role: "Etakchi Frontend Dasturchi",
    bio: "7 yildan ortiq vaqt davomida React, Next.js va zamonaviy CSS bilan moslashuvchan veb-ilovalarni yaratib kelmoqda. Interfeyslar va qulaylik standartlarini boshqaradi.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "Accessibility"],
    experience: "7+ yillik tajriba",
    links: { linkedin: "#", github: "#" }
  },
  {
    name: "Mia",
    role: "Full-stack Dasturchi",
    bio: "TypeScript, Node.js va bulutli API-lardan foydalangan holda zamonaviy interfeyslarni ishonchli backend tizimlariga ulash bo'yicha ekspert. Tizimlarni tezkor saqlashni nazorat qiladi.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
    skills: ["Node.js", "Express", "TypeScript", "APIs", "PostgreSQL"],
    experience: "Full-Stack Ekspert",
    links: { linkedin: "#", github: "#" }
  },
  {
    name: "Owen",
    role: "Backend Dasturchi",
    bio: "Xavfsiz serverlar, ma'lumotlarni modellashtirish va integratsiya jarayonlariga ixtisoslashgan. Ishlab chiqarishga tayyor tizimlar uchun API va operatsion vositalar yaratadi.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Owen",
    skills: ["Docker", "Kubernetes", "Redis", "Security", "DevOps"],
    experience: "Infratuzilma Muhandisi",
    links: { linkedin: "#", github: "#" }
  },
  {
    name: "Sophia",
    role: "Mobil va Frontend Muhandisi",
    bio: "React Native, zamonaviy moslashuvchan tartiblar va mukammal kod bilan veb va mobil ilovalar uchun uzluksiz raqamli tajribalar yaratadi.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    skills: ["React Native", "iOS / Android", "UI Interaction", "TailwindCSS"],
    experience: "Ko'p tarmoqli ishlab chiquvchi",
    links: { linkedin: "#", github: "#" }
  },
  {
    name: "Riley",
    role: "Mahsulot Dizayneri",
    bio: "Jamoalarga ishonch bilan mahsulotlarini ishga tushirishga yordam beradigan minimal vizual tizimlar va mukammal foydalanuvchi yo'llarini yaratadi. Strategik dizaynni brend fikrlash bilan uyg'unlashtiradi.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riley",
    skills: ["Figma", "UI/UX Systems", "Prototyping", "Visual Identity"],
    experience: "Brand & Product Designer",
    links: { linkedin: "#", github: "#" }
  }
];

export const VALUES: Value[] = [
  {
    title: "Innovatsiya",
    desc: "Biz shunchaki trendlarni kuzatmaymiz; biz AI bilan nimalar sodir bo'lishi mumkinligi chegaralarini kengaytirish orqali ularni o'zimiz yaratamiz.",
    icon: Zap
  },
  {
    title: "Xavfsizlik",
    desc: "Sizning ma'lumotlaringiz va maxfiyligingiz biz yaratayotgan har bir mahsulotning markazida joylashgan.",
    icon: Shield
  },
  {
    title: "Aniqlik",
    desc: "Yuqori sifatli dasturiy ta'minot va aniq AI natijalari bizning har bir loyihamiz uchun standartdir.",
    icon: LayoutGrid
  },
  {
    title: "Global Miqyos",
    desc: "Chegaralar va sanoatlar bo'ylab aks-sado beradigan raqamli yechimlarni qurish.",
    icon: Globe
  }
];

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  Linkedin, 
  Plus,
  Edit2, 
  Trash2, 
  Menu as MenuIcon, 
  X as XIcon, 
  LogIn, 
  ChevronRight, 
  Sparkles, 
  LogOut, 
  ArrowRight, 
  Bot, 
  Send,
  ExternalLink,
  Cpu,
  Palette,
  CheckSquare
} from "lucide-react";
import { PROJECTS, VALUES, LOGO_URL, TeamMember } from "./data.ts";
import { cn } from "./lib/utils.ts";
import { auth, loginWithGoogle, logout, db } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { ResumeForm } from "./components/ResumeForm";
import { AdminPanel } from "./components/AdminPanel";
import { WentricChat } from "./components/WentricChat";
import { ProfileMenu } from "./components/ProfileMenu";
import { getIcon } from "./lib/icons";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Site Content State
  const [vision, setVision] = useState<{title: string, description: string, values: any[]} | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  
  // Auth & UI State
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const ADMIN_EMAIL = "tuyginovsardor4@gmail.com";

  // Combine static founders with dynamic members
  const fullTeam = [...teamMembers];
  
  // Find current user's profile
  const userProfile = teamMembers.find(m => m.userId === user?.uid);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    // Auth Listener
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Sync user to Firestore
        const userRef = doc(db, "users", u.uid);
        const userSnap = await getDoc(userRef);
        
        let isUserAdmin = u.email === ADMIN_EMAIL;
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.isAdmin !== undefined) {
             isUserAdmin = userData.isAdmin;
          }
        }

        setIsAdmin(isUserAdmin);
        
        setDoc(userRef, {
          uid: u.uid,
          displayName: u.displayName,
          email: u.email,
          photoURL: u.photoURL,
          isAdmin: isUserAdmin,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } else {
        setIsAdmin(false);
      }
    });

    // Team Listener
    const q = query(collection(db, "team"), orderBy("updatedAt", "desc"));
    const unsubTeam = onSnapshot(q, (snapshot) => {
      const members = snapshot.docs.map(doc => doc.data() as TeamMember);
      setTeamMembers(members);
    }, (err) => console.error("Firestore team error:", err));

    // Ecosystem & Vision Listeners
    const unsubVision = onSnapshot(doc(db, "vision", "current"), (snap) => {
      if (snap.exists()) {
        setVision(snap.data() as any);
      } else {
        setVision({ title: "Kelajakni Innovatsiya va AI bilan quramiz", description: "“Bir ekotizim — cheksiz imkoniyatlar”", values: VALUES });
      }
    });

    const unsubProjects = onSnapshot(query(collection(db, "projects"), orderBy("order", "asc")), (snap) => {
      if (!snap.empty) {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        setProjects(PROJECTS);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubAuth();
      unsubTeam();
      unsubVision();
      unsubProjects();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-sky-500/30 overflow-x-hidden">
      {/* Visual Infrastructure */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 font-sans">
        {/* Command Status Header */}
        <div className="hidden lg:flex fixed top-0 w-full h-8 bg-black/60 backdrop-blur-md border-b border-white/5 z-[60] px-8 items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" /> Wentric Ecosystem Node: Active</span>
            <span className="flex items-center gap-2">Protocol: AI-3000-HYBRID</span>
            <span className="flex items-center gap-2 italic">Security: Post-Quantum AES</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Uptime: 99.999%</span>
            <span>Scale: Global (EU-CENTRAL-1)</span>
          </div>
        </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed lg:top-8 top-0 w-full z-50 transition-all duration-500 px-8 h-20",
        scrolled ? "bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-[1rem] overflow-hidden flex items-center justify-center bg-black border border-white/10 shadow-2xl relative group-hover:scale-105 transition-transform">
              <img src={LOGO_URL} alt="W" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight italic text-white leading-none">WENTRIC</span>
              <span className="text-[9px] font-black tracking-[0.4em] text-sky-500 uppercase mt-1">ecosystem</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <a href="#ecosystem" className="hover:text-sky-400 transition-colors">Ekotizim</a>
            <a href="#about" className="hover:text-sky-400 transition-colors">Vizyon</a>
            <a href="#strengths" className="hover:text-sky-400 transition-colors">Imkoniyatlar</a>
            <a href="#team" className="hover:text-sky-400 transition-colors">Jamoa</a>
            <a href="#strategy" className="px-4 py-2 bg-white/5 rounded-full hover:text-white transition-all text-sky-500 border border-sky-500/20">Global Strategiya</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-white transition-all flex items-center gap-2 group"
            >
              <span className="hidden md:inline text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-sky-400">COMMAND CONTROL</span>
              <div className="relative">
                {isMenuOpen ? (
                  <XIcon className="w-5 h-5 text-sky-400 animate-pulse" />
                ) : (
                  <>
                    <MenuIcon className="w-5 h-5 group-hover:text-sky-400 transition-colors" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-sky-500 rounded-full animate-ping" />
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Side Command Center Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 35, stiffness: 350 }}
              className="fixed right-0 top-0 bottom-0 z-[100] w-full max-w-md bg-[#07070a]/95 border-l border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col p-8 overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-black">
                    <img src={LOGO_URL} alt="W" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-sm font-black italic text-white uppercase tracking-[0.2em] leading-none block">Wentric</span>
                    <span className="text-[8px] font-black tracking-[0.3em] text-sky-500 uppercase mt-1 block">Command Node</span>
                  </div>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-white transition-all">
                  <XIcon className="w-5 h-5 text-sky-400" />
                </button>
              </div>

              {/* Tizimga kirish / Access controls in Uzbek */}
              <div className="mb-10 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full" />
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                  Tizim Control Center
                </h3>

                {user ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white italic tracking-tight">{user.displayName}</div>
                        <div className="text-[8px] text-zinc-500 uppercase tracking-[0.2em] font-mono mt-1">{user.email}</div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <button 
                        onClick={() => { setShowResumeForm(true); setIsMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10"
                      >
                        <Plus className="w-4 h-4 text-sky-400" />
                        Mening Profilim
                      </button>

                      {isAdmin && (
                        <button 
                          onClick={() => { setShowAdminPanel(true); setIsMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-5 py-3.5 bg-sky-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-sky-400 shadow-2xl shadow-sky-500/20"
                        >
                          <Edit2 className="w-4 h-4" />
                          Admin Command Panel
                        </button>
                      )}
                    </div>

                    <button 
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-[9px] font-black uppercase tracking-[0.2em] mt-4 pt-2 border-t border-white/5"
                    >
                      <LogOut className="w-4 h-4" /> Tizimdan Chiqish
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[11px] text-zinc-400 italic leading-relaxed">
                      Wentric boshqaruv tuguniga ulanish orqali portfoliongizni boshqaring, jamoaga qo'shiling va tizim imkoniyatlaridan foydalaning.
                    </p>
                    <button 
                      onClick={() => { loginWithGoogle(); setIsMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-sky-500 text-black text-[10px] font-black rounded-2xl hover:bg-sky-400 transition-all uppercase tracking-[0.2em] shadow-xl shadow-sky-500/20"
                    >
                      <LogIn className="w-4 h-4" /> Google bilan Kirish
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation links inside Command Drawer */}
              <div className="space-y-2 mb-10">
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 pl-2 mb-4">Navigatsiya</div>
                {[
                  { href: "#ecosystem", label: "Wentric Ekotizimi" },
                  { href: "#about", label: "Vizyon va Missiya" },
                  { href: "#strengths", label: "Bizning Imkoniyatlarimiz" },
                  { href: "#team", label: "Bizning Jamoamiz" }
                ].map(link => (
                  <a 
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-4 bg-white/[0.02] hover:bg-white/5 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-all italic leading-none"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Live telemetry footer inside Command Drawer */}
              <div className="mt-auto border-t border-white/5 pt-6 text-[8px] text-zinc-600 font-mono space-y-2 uppercase tracking-widest">
                <div className="flex justify-between"><span>Node status:</span><span className="text-emerald-500 font-bold">Operational</span></div>
                <div className="flex justify-between"><span>Region:</span><span>Central Asia (UZB)</span></div>
                <div className="flex justify-between"><span>Secure Key:</span><span>AE-WNT-88X</span></div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-60 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-sky-500/5 border border-sky-500/10 text-[10px] text-sky-400 font-black uppercase tracking-[0.4em] mb-12 backdrop-blur-sm">
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-ping"></span>
              <span>Next Generation AI Architecture</span>
            </div>
            
            <h1 className="text-[clamp(3.5rem,8vw,5.5rem)] font-black tracking-tighter leading-[0.85] mb-12 text-white italic">
              {vision?.title.split(' ').map((word, i) => (
                <span key={i} className={i > 1 ? "text-gradient-sky drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]" : ""}>{word} </span>
              )) || "Kelajakni Innovatsiya va AI bilan quramiz"}
            </h1>

            <p className="text-2xl text-zinc-500 max-w-xl mb-16 leading-relaxed italic font-medium border-l border-sky-500/20 pl-8">
              {vision?.description || "“Bir ekotizim — cheksiz imkoniyatlar”"}
            </p>

            <div className="flex flex-wrap gap-8">
              <a href="#ecosystem" className="group px-12 py-6 bg-sky-500 hover:bg-sky-400 text-black font-black rounded-3xl transition-all shadow-[0_20px_50px_rgba(14,165,233,0.2)] text-xs uppercase tracking-[0.3em] flex items-center gap-4">
                Launch Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button 
                onClick={() => setShowResumeForm(true)} 
                className="px-12 py-6 bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl transition-all border border-white/10 text-xs uppercase tracking-[0.3em] backdrop-blur-md"
              >
                Join Community
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-5 p-12 rounded-[4rem] bg-black/40 border border-white/5 flex flex-col gap-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden group"
            id="strategy"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="text-sky-400 font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-4">
                 <div className="w-10 h-[1px] bg-sky-500/40"></div>
                 Network Stats
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[9px] text-emerald-400 font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Node
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="text-7xl font-black text-white tracking-tighter italic">$250M <span className="text-2xl text-zinc-700 not-italic font-mono">+</span></div>
              <p className="text-base text-zinc-500 leading-relaxed max-w-sm italic font-medium">
                Autonomous system capacity designed for high-frequency AI operations. Scaled across EU and MENA regions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                <div className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-3 font-mono opacity-60">Global Reach</div>
                <div className="text-4xl font-mono font-black text-white">99.8%</div>
                <div className="text-[9px] text-emerald-500 font-black mt-2 tracking-tighter">LATENCY: 14MS</div>
              </div>
              <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                <div className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-3 font-mono opacity-60">Revenue Target</div>
                <div className="text-4xl font-mono font-black text-white">$4.5M</div>
                <div className="text-[9px] text-sky-500 font-black mt-2 tracking-tighter">ANNUAL Q4.25</div>
              </div>
            </div>

            <button className="relative z-10 w-full py-6 bg-white text-black font-black text-xs rounded-3xl hover:bg-sky-400 transition-all uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(255,255,255,0.05)]">
              Download Architecture
            </button>
          </motion.div>
        </div>
      </section>

      {/* Overview & Core Strengths Section */}
      <section id="about" className="py-24 px-8 border-y border-white/5 bg-zinc-950/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.01] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Who We Are & What We Deliver Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full" />
              <h3 className="text-xs font-black text-sky-500 uppercase tracking-[0.3em] mb-4">Biz kimmiz</h3>
              <p className="text-xl text-white font-medium italic leading-relaxed mb-6">
                Wentric - bu veb-ilova loyihalari, mobil-birinchi mahsulotlar va raqamli dizayn bo'yicha ixtisoslashgan tajribali IT xizmat ko'rsatish jamoasi.
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">
                Bizning muhandislik va vizual kollektivimiz muttasil ravishda aniqlik, soddalik va natijaga yo'naltirilgan ilg'or tizimlarni ishlab chiqish atrofida faoliyat yuritadi. Biz har bir loyihaning raqamli infratuzilmasini eng yuqori darajaga olib chiqamiz.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full" />
              <h3 className="text-xs font-black text-sky-500 uppercase tracking-[0.3em] mb-4">Nima taqdim etamiz</h3>
              <p className="text-xl text-white font-medium italic leading-relaxed mb-6">
                Biz xavfsiz ilovalar, benuqson va chiroyli interfeyslar hamda kengaytiriladigan raqamli infratuzilmalarni yaratamiz.
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">
                Har bir loyiha qulaylik, yuqori unumdorlik, barqaror xavfsizlik va kelajakka mos texnik strategiyaga e'tibor qaratgan holda mukammal darajada ishlab chiqiladi. Biz raqamli olamdagi eng ishonchli va doimiy texnologik hamkoringizmiz.
              </p>
            </motion.div>
          </div>

          {/* Core Strengths Section */}
          <div id="strengths" className="space-y-12 pt-12 border-t border-white/5">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em] block">Sifat kafolati</span>
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tight">KUCHLI TOMONLARIMIZ</h2>
              <p className="text-zinc-500 max-w-2xl mx-auto text-sm leading-relaxed italic">
                Ekotizimimiz va jamoamiz orqali amalga oshiriladigan professional xizmatlar va ularning mukammal tuzilmalari.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Engineering Strength */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 hover:border-sky-500/20 transition-all flex flex-col gap-8 group relative overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                    <Cpu className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Muhandislik</h3>
                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block mt-0.5">Engineering</span>
                  </div>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed italic">
                  Zamonaviy arxitektura, toza kod va kuchli DevOps xizmatlari. Biz tizim unumdorligi va miqyosini kafolatlaymiz.
                </p>
                <div className="space-y-4 pt-4 border-t border-white/5 mt-auto">
                  <div className="flex justify-between items-center text-xs font-mono"><span className="text-zinc-500">Frontend:</span><span className="text-white font-bold">React, Vue, TS, Tailwind</span></div>
                  <div className="flex justify-between items-center text-xs font-mono"><span className="text-zinc-500">Backend:</span><span className="text-white font-bold">Node.js, Python, SQL, C#</span></div>
                  <div className="flex justify-between items-center text-xs font-mono"><span className="text-zinc-500">Infratuzilma:</span><span className="text-white font-bold">AWS, Docker, CI/CD</span></div>
                </div>
              </motion.div>

              {/* Design Strength */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 hover:border-sky-500/20 transition-all flex flex-col gap-8 group relative overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Dizayn</h3>
                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block mt-0.5">Design</span>
                  </div>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed italic">
                  Kuchli brend g'oyasiga ega minimal va intuitiv interfeyslar. Biz o'ta mukammal foydalanuvchilar tajribasini (UX) loyihalashtiramiz.
                </p>
                <div className="space-y-4 pt-4 border-t border-white/5 mt-auto">
                  <div className="flex justify-between items-center text-xs font-mono"><span className="text-zinc-500">UI Dizayn:</span><span className="text-white font-bold">Figma, adaptiv tizimlar</span></div>
                  <div className="flex justify-between items-center text-xs font-mono"><span className="text-zinc-500">UX Strategiya:</span><span className="text-white font-bold">User Journeys, prototiplar</span></div>
                  <div className="flex justify-between items-center text-xs font-mono"><span className="text-zinc-500">Vizuallik:</span><span className="text-white font-bold">Brending, harakatlar</span></div>
                </div>
              </motion.div>

              {/* Delivery Strength */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 hover:border-sky-500/20 transition-all flex flex-col gap-8 group relative overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">Yetkazib berish</h3>
                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block mt-0.5">Delivery</span>
                  </div>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed italic">
                  Shaffof muloqot va tizimli jamoaviy yondashuv. Biz loyihalarni o'z muddatida va oliy sifat standartlarida topshiramiz.
                </p>
                <div className="space-y-4 pt-4 border-t border-white/5 mt-auto">
                  <div className="flex justify-between items-center text-xs font-mono"><span className="text-zinc-500">Loyiha ritmi:</span><span className="text-white font-bold">Reja, sharh, tezkor iteratsiya</span></div>
                  <div className="flex justify-between items-center text-xs font-mono"><span className="text-zinc-500">Sifat:</span><span className="text-white font-bold">Sinov, xavfsizlik, tezlik</span></div>
                  <div className="flex justify-between items-center text-xs font-mono"><span className="text-zinc-500">Yordam:</span><span className="text-white font-bold">Hujjatlar, kelajak kafolati</span></div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-24 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white uppercase italic">Ekotizim</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed italic">
              Loyihalarimiz yuqori texnologik xavfsizlik va unumdorlik tizimi ostida mustaqil bo'linmalar sifatida faoliyat yuritadi.
            </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-sky-500/30 transition-all flex flex-col gap-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   {React.createElement(getIcon(project.icon), { className: 'w-24 h-24' })}
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform overflow-hidden">
                    {project.logoUrl ? (
                      <img src={project.logoUrl} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      React.createElement(getIcon(project.icon), { className: 'w-6 h-6' })
                    )}
                  </div>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-xl hover:bg-sky-500 hover:text-black transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-white italic mb-2 tracking-tight">{project.name}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed font-medium italic">
                    {project.description}
                  </p>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5 relative z-10">
                  <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">
                    {project.status}
                  </span>
                  <div className="flex gap-2">
                    {project.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-black rounded text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
 </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 px-8 bg-zinc-900/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
            <div className="flex items-center gap-4">
               <div className="w-1 h-12 bg-sky-500 rounded-full"></div>
               <div>
                 <h2 className="text-4xl font-bold tracking-tight text-white uppercase italic">Asosiy Jamoa</h2>
                 <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-1">Wentric Ekotizimining Yaratuvchilari</p>
               </div>
            </div>
            <button 
              onClick={() => user ? setShowResumeForm(true) : loginWithGoogle()}
              className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              {user ? "Rezumeyimni yangilash" : "Jamoaga qo'shiling"}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {fullTeam.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-zinc-900 border border-white/5 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 text-[10px] font-mono font-bold text-sky-500 italic uppercase tracking-widest opacity-60">
                  {member.experience}
                </div>
                
                <div className="w-12 h-12 rounded-full mb-6 overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={member.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed="+member.name} alt={member.name} className="w-full h-full object-cover" />
                </div>
                
                <h3 className="text-lg font-bold mb-1 text-white">{member.name}</h3>
                <p className="text-sky-400 font-mono italic text-[9px] uppercase tracking-widest mb-4 font-bold">{member.role}</p>
                <p className="text-zinc-500 text-xs leading-relaxed mb-6 italic opacity-80">
                  "{member.bio}"
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {member.skills?.map(skill => (
                    <span key={skill} className="px-2 py-1 rounded bg-black/40 border border-white/5 text-[8px] font-bold text-zinc-600 uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    {member.links?.linkedin && (
                      <a href={member.links.linkedin} target="_blank" rel="noreferrer" className="text-zinc-700 hover:text-sky-400 transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.links?.github && (
                      <a href={member.links.github} target="_blank" rel="noreferrer" className="text-zinc-700 hover:text-sky-400 transition-colors">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {(user?.uid === member.userId || isAdmin) && (
                    <div className="flex gap-2">
                       <button 
                        onClick={() => {
                          if (user?.uid === member.userId) {
                            setShowResumeForm(true);
                          } else {
                            // Admin editing logic (if ResumeForm supports editing other users)
                            alert("Admin editing feature for other profiles is being implemented. Use delete for now.");
                          }
                        }}
                        className="p-2 hover:bg-sky-500/10 text-zinc-600 hover:text-sky-400 transition-colors rounded-lg"
                       >
                         <Edit2 className="w-3 h-3" />
                       </button>
                       <button 
                        onClick={async () => {
                          const confirmMsg = user?.uid === member.userId 
                            ? "Profilni o'chirmoqchi ekanligingizga ishonchingiz komilmi?"
                            : `Admin sifatida ${member.name} profilini o'chirmoqchimisiz?`;
                          
                          if (confirm(confirmMsg)) {
                            await deleteDoc(doc(db, "team", member.userId));
                            setToast({ message: "Profil muvaffaqiyatli o'chirildi", type: "success" });
                          }
                        }}
                        className="p-2 hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-colors rounded-lg"
                       >
                         <Trash2 className="w-3 h-3" />
                       </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {teamMembers.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl">
              <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Hozircha jamoa a'zolari yo'q. Bizga qo'shiling va birinchi bo'ling!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-8 border-t border-white/5 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-black">
          <div className="flex items-center gap-4 group">
            <div className="w-8 h-8 bg-black rounded-lg border border-white/20 overflow-hidden flex items-center justify-center text-sky-400 group-hover:border-sky-500/50 transition-colors">
               <img src={LOGO_URL} alt="W" className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
            </div>
            <span className="text-zinc-500 tracking-[0.5em] italic">WENTRIC GLOBAL COMMAND</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
             <span className="hover:text-zinc-400 transition-colors cursor-default">Tashkent, Uzbekistan</span>
             <span className="hover:text-zinc-400 transition-colors cursor-default">Dubai, UAE</span>
             <span className="text-sky-900 lowercase font-mono">system.wentric.uz</span>
          </div>

          <div className="flex gap-8">
            <a href="#" className="hover:text-sky-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-sky-400 transition-colors">Instagram</a>
            <a href="#" className="hover:text-sky-400 transition-colors">LinkedIn</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 text-center text-[9px] text-zinc-900 uppercase tracking-[0.5em] font-black">
           © 2024 Innovatsiya va AI bilan kelajakni qurmoqdamiz
        </div>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border font-bold text-xs uppercase tracking-widest",
              toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", toast.type === "success" ? "bg-emerald-400" : "bg-red-400")} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <WentricChat user={user} onLogin={loginWithGoogle} />

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showAdminPanel && isAdmin && (
          <AdminPanel onClose={() => setShowAdminPanel(false)} />
        )}
      </AnimatePresence>

      {/* Resume Form Modal */}
      <AnimatePresence>
        {showResumeForm && user && (
          <ResumeForm 
            user={user} 
            initialData={userProfile}
            onClose={() => setShowResumeForm(false)} 
            onSuccess={() => {
              setToast({ message: "Portfolio muvaffaqiyatli yangilandi!", type: "success" });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  </div>
  );
}


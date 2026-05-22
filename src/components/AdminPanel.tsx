import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  Eye, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  ExternalLink,
  Upload,
  ChevronRight,
  Shield,
  Headphones
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { getIcon, ICON_NAMES } from '../lib/icons';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'vision' | 'team' | 'users' | 'support'>('overview');
  const [projects, setProjects] = useState<any[]>([]);
  const [vision, setVision] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('order', 'asc')), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubVision = onSnapshot(doc(db, 'vision', 'current'), (snap) => {
      setVision(snap.exists() ? snap.data() : { title: '', description: '', values: [] });
    });

    const unsubTeam = onSnapshot(collection(db, 'team'), (snap) => {
      setTeam(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    setLoading(false);
    return () => {
      unsubProjects();
      unsubVision();
      unsubTeam();
      unsubUsers();
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 10000); // 10 second pause as requested
  };

  const saveProject = async (project: any) => {
    const isNew = !projects.find(p => p.id === project.id);
    await setDoc(doc(db, 'projects', project.id || doc(collection(db, 'projects')).id), {
      ...project,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    if (isNew) {
      showNotification("YANGI LOYIHA MUVAFFAQIYATLI QO'SHILDI");
    }
  };

  const updateUserRole = async (userId: string, isAdmin: boolean) => {
    await setDoc(doc(db, 'users', userId), { isAdmin }, { merge: true });
    showNotification(`FOYDALANUVCHI ROLE O'ZGARTIRILDI: ${isAdmin ? 'ADMIN' : 'USER'}`);
  };

  const deleteProject = async (id: string) => {
    if (confirm('Loyihani o\'chirmoqchimisiz?')) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  const saveVision = async (data: any) => {
    await setDoc(doc(db, 'vision', 'current'), data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-[#050505] flex flex-col"
    >
      {/* Top Navigation */}
      <div className="h-20 bg-black border-b border-white/5 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-black shadow-2xl shadow-sky-500/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Wentric Command</h1>
            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Ecosystem Administration v3.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> System Live</span>
            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span> 0 Crashing</span>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-black text-[10px] font-black rounded-xl hover:bg-sky-400 transition-all uppercase tracking-widest"
          >
            Chiqish
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-black border-r border-white/5 p-8 flex flex-col gap-2">
          {[
            { id: 'overview', label: 'Umumiy', icon: LayoutGrid },
            { id: 'projects', label: 'Ekotizim', icon: Upload },
            { id: 'vision', label: 'Vizyon', icon: Eye },
            { id: 'team', label: 'Jamoa', icon: Users },
            { id: 'users', label: 'Foydalanuvchilar', icon: Shield },
            { id: 'support', label: 'Yordam Markazi', icon: Headphones },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group ${
                activeTab === tab.id 
                  ? 'bg-sky-500 text-black shadow-2xl shadow-sky-500/20' 
                  : 'text-zinc-600 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-black' : 'text-sky-500/50'}`} />
              {tab.label}
              {activeTab === tab.id && <ChevronRight className="w-3 h-3 ml-auto" />}
            </button>
          ))}

          <div className="mt-auto p-6 rounded-[2rem] bg-gradient-to-br from-sky-500/5 to-transparent border border-white/5">
             <div className="text-[9px] text-sky-400 font-black uppercase tracking-widest mb-2">Build Notice</div>
             <p className="text-[10px] text-zinc-500 leading-relaxed italic">Yangi funksiyalar har 24 soatda avtomatik yangilanadi.</p>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 overflow-y-auto bg-[#070707] p-12 no-scrollbar">
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] px-8 py-4 bg-sky-500 text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-sky-500/40 italic flex items-center gap-4"
            >
              <span className="w-2 h-2 bg-black rounded-full animate-ping" />
              {notification}
            </motion.div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-12">
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Loyihalar', value: projects.length, trend: '↑', color: 'text-sky-400' },
                  { label: 'Jamoa', value: team.length, trend: 'stable', color: 'text-white' },
                  { label: 'Server Status', value: '100%', trend: '99.99%', color: 'text-emerald-400' },
                  { label: 'Yordam Seanslari', value: '0', trend: 'ACTIVE', color: 'text-amber-400' },
                ].map((stat, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] bg-black border border-white/5 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-sky-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <div className="relative z-10">
                      <div className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em] mb-4">{stat.label}</div>
                      <div className={`text-5xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-10 rounded-[3rem] bg-black border border-white/5">
                 <h2 className="text-2xl font-black text-white italic uppercase tracking-tight mb-6">Tizim Faoliyati</h2>
                 <div className="space-y-4">
                    {Array.from({length: 3}).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-2 bg-sky-500 rounded-full" />
                          <span className="text-[11px] text-zinc-400 italic">Yangi loyiha muvaffaqiyatli serverga yuklandi</span>
                        </div>
                        <span className="text-[9px] text-zinc-600 font-mono">2 MIN AGO</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Loyihalar</h3>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-2 font-bold">Wentric Ekotizim katalogi</p>
                </div>
                <button 
                  onClick={() => saveProject({
                    id: 'p-' + Date.now(),
                    name: 'Yangi Loyiha',
                    description: 'Loyha haqida qisqacha tavsif...',
                    status: 'DEVELOPMENT',
                    icon: 'Zap',
                    order: projects.length,
                    tags: ['AI'],
                    url: ''
                  })}
                  className="px-8 py-4 bg-sky-500 text-black text-[10px] font-black rounded-2xl hover:scale-105 transition-all uppercase tracking-[0.2em] shadow-2xl shadow-sky-500/20"
                >
                  <Plus className="w-4 h-4 inline-block mr-2" /> Yangi Loyiha Qo'shish
                </button>
              </div>

              <div className="grid gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="p-10 rounded-[2.5rem] bg-black border border-white/5 flex flex-col md:flex-row gap-10 group hover:border-sky-500/20 transition-all">
                    <div className="w-24 h-24 rounded-3xl bg-[#0F0F0F] border border-white/10 flex items-center justify-center text-sky-400 shadow-2xl overflow-hidden">
                      {project.logoUrl ? (
                        <img src={project.logoUrl} alt={project.name} className="w-full h-full object-cover" />
                      ) : (
                        React.createElement(getIcon(project.icon), { className: 'w-10 h-10' })
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest pl-2">Loyiha Nomi</label>
                          <input 
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-sky-500/50 outline-none"
                            value={project.name}
                            onChange={(e) => saveProject({ ...project, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest pl-2">Logo URL (Optional)</label>
                          <input 
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-sky-500/50 outline-none"
                            value={project.logoUrl || ''}
                            onChange={(e) => saveProject({ ...project, logoUrl: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest pl-2">Status</label>
                          <select 
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:border-sky-500/50 outline-none"
                            value={project.status}
                            onChange={(e) => saveProject({ ...project, status: e.target.value })}
                          >
                            {['PRODUCTION', 'STABLE', 'BETA', 'DEVELOPMENT', 'HIDDEN'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest pl-2">Icon (Fallback)</label>
                           <select 
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-sky-500/50"
                            value={project.icon}
                            onChange={(e) => saveProject({ ...project, icon: e.target.value })}
                          >
                            {ICON_NAMES.slice(0, 50).map(name => <option key={name} value={name}>{name}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest pl-2">Tavsif</label>
                        <textarea 
                          className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white min-h-[100px] outline-none focus:border-sky-500/50 italic"
                          value={project.description}
                          onChange={(e) => saveProject({ ...project, description: e.target.value })}
                        />
                      </div>

                      <div className="grid md:grid-cols-1 gap-6">
                         <div className="space-y-2">
                          <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest pl-2">Domain / URL</label>
                          <input 
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-4 text-sm text-sky-400 font-mono outline-none focus:border-sky-500/50"
                            value={project.url || ''}
                            onChange={(e) => saveProject({ ...project, url: e.target.value })}
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <button 
                          onClick={() => deleteProject(project.id)}
                          className="px-6 py-3 bg-red-500/10 text-red-400 text-[10px] font-black rounded-xl hover:bg-red-500/20 transition-all uppercase tracking-widest"
                        >
                          Loyihani O'chirish
                        </button>
                        <div className="text-[9px] text-zinc-700 font-mono">ID: {project.id}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vision' && vision && (
            <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
               <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Vizyon</h3>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-2 font-bold">Brend Missiya va Qadriyatlari</p>
                </div>

                <div className="p-10 rounded-[3rem] bg-black border border-white/5 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest pl-2">Asosiy Sarlavha (Hero Title)</label>
                    <input 
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-8 py-5 text-xl font-bold text-white outline-none focus:border-sky-500/50"
                      value={vision.title}
                      onChange={(e) => setVision({ ...vision, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest pl-2">Asosiy Tavsif</label>
                    <textarea 
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-8 py-5 text-sm text-zinc-400 min-h-[150px] outline-none focus:border-sky-500/50 italic leading-relaxed"
                      value={vision.description}
                      onChange={(e) => setVision({ ...vision, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {(vision.values || []).map((val: any, idx: number) => (
                    <div key={idx} className="p-8 rounded-[2.5rem] bg-black border border-white/5 space-y-6 group">
                      <div className="flex items-center justify-between">
                         <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                            {React.createElement(getIcon(val.icon || 'Zap'), { className: 'w-6 h-6' })}
                         </div>
                         <button 
                          onClick={() => {
                            const newVals = vision.values.filter((_: any, i: number) => i !== idx);
                            setVision({ ...vision, values: newVals });
                          }}
                          className="p-2 opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-400 transition-all"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                      <input 
                        className="w-full bg-transparent border-b border-white/10 py-2 text-lg font-bold text-white outline-none focus:border-sky-500"
                        value={val.title}
                        onChange={(e) => {
                          const newVals = [...vision.values];
                          newVals[idx].title = e.target.value;
                          setVision({ ...vision, values: newVals });
                        }}
                      />
                      <textarea 
                        className="w-full bg-transparent text-[12px] text-zinc-500 min-h-[80px] outline-none italic resize-none"
                        value={val.desc}
                        onChange={(e) => {
                          const newVals = [...vision.values];
                          newVals[idx].desc = e.target.value;
                          setVision({ ...vision, values: newVals });
                        }}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => setVision({ ...vision, values: [...(vision.values || []), { title: 'Yangi Qadriyat', desc: 'Tavsif yozing...', icon: 'Zap' }] })}
                    className="p-8 rounded-[2.5rem] bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                  >
                    + Qadriyat Qo'shish
                  </button>
                </div>

                <button 
                  onClick={() => saveVision(vision)}
                  className="w-full py-6 bg-white text-black font-black text-sm rounded-[2rem] hover:bg-sky-400 transition-all uppercase tracking-[0.3em] shadow-2xl shadow-white/5"
                >
                  Barcha Tahrirlarni Saqlash
                </button>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Jamoa</h3>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-2 font-bold">Kreativ va Texnik Jamoa Boshqaruvi</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {team.map((member) => (
                    <div key={member.id} className="p-8 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                           <img src={member.avatar} className="w-16 h-16 rounded-3xl border border-white/10 object-cover" alt="" />
                           <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-black">
                              <Shield className="w-3 h-3" />
                           </div>
                        </div>
                        <div>
                          <div className="text-lg font-black text-white italic tracking-tighter">{member.name}</div>
                          <div className="text-[10px] text-sky-500 font-black uppercase tracking-widest">{member.role}</div>
                          <div className="text-[9px] text-zinc-600 font-mono mt-1 mt-2">{member.experience}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteDoc(doc(db, 'team', member.id))}
                        className="p-4 bg-white/5 rounded-2xl text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {team.length === 0 && (
                    <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-[3rem]">
                       <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Hozircha hech kim tizimga a'zo emas</p>
                    </div>
                  )}
                </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Foydalanuvchilar</h3>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-2 font-bold">Access Control & Role Management</p>
                </div>

                <div className="grid gap-4">
                  {users.map((u) => (
                    <div key={u.id} className="p-8 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <img src={u.photoURL} className="w-12 h-12 rounded-2xl border border-white/10" alt="" />
                        <div>
                          <div className="text-lg font-black text-white italic tracking-tighter">{u.displayName}</div>
                          <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{u.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${u.isAdmin ? 'bg-sky-500/20 text-sky-400' : 'bg-white/5 text-zinc-600'}`}>
                          {u.isAdmin ? 'Administrator' : 'General User'}
                        </span>
                        <button 
                          onClick={() => updateUserRole(u.id, !u.isAdmin)}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all border border-white/10"
                        >
                          {u.isAdmin ? 'User ga tushirish' : 'Admin qilish'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-24 h-24 bg-sky-500/10 rounded-[2.5rem] flex items-center justify-center text-sky-400">
                  <Headphones className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Yordam Markazi Tez Kunda</h3>
               <p className="text-sm text-zinc-500 max-w-sm italic">Hozirda barcha yordam seanslari Telegram orqali qabul qilinmoqda. <br/> Tez orada ichki chat tizimi integratsiya qilinadi.</p>
               <a 
                href="https://t.me/wentricsupport" 
                target="_blank" 
                rel="noreferrer"
                className="px-8 py-4 bg-sky-500 text-black font-black text-[10px] rounded-2xl uppercase tracking-widest"
               >
                 Telegram Support Markazi
               </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

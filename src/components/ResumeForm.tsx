import React, { useState } from "react";
import { X, Save, User as UserIcon, Briefcase, FileText, Code, Link as LinkIcon, Image as ImageIcon, Sparkles } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

interface ResumeFormProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function ResumeForm({ user, onClose, onSuccess, initialData }: ResumeFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || user.displayName || "",
    role: initialData?.role || "",
    bio: initialData?.bio || "",
    avatar: initialData?.avatar || user.photoURL || "",
    experience: initialData?.experience || "",
    skills: initialData?.skills?.join(", ") || "",
    linkedin: initialData?.links?.linkedin || "",
    github: initialData?.links?.github || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resumeData = {
        userId: user.uid,
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        avatar: formData.avatar,
        experience: formData.experience,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        links: {
          linkedin: formData.linkedin,
          github: formData.github
        },
        // Preserve createdAt if editing
        createdAt: initialData?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, "team", user.uid), resumeData);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {initialData ? "Profilni yangilash" : "Jamoaga qo'shilish"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                <UserIcon className="w-3 h-3" /> To'liq ism
              </label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none transition-all"
                placeholder="CEO / Sardor Tuyginov"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Hozirgi lavozim
              </label>
              <input
                required
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none transition-all"
                placeholder="Dasturiy ta'minot muhandisi"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Tajriba (masalan: 5+ yil)
              </label>
              <input
                required
                value={formData.experience}
                onChange={e => setFormData({ ...formData, experience: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none transition-all"
                placeholder="5+ yil"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                <Code className="w-3 h-3" /> Ko'nikmalar (vergul bilan)
              </label>
              <input
                value={formData.skills}
                onChange={e => setFormData({ ...formData, skills: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none transition-all"
                placeholder="React, AI, TypeScript"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-3 h-3" /> Professional biografiya
            </label>
            <textarea
              required
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none transition-all min-h-[100px] resize-none"
              placeholder="Wentric'dagi missiyangiz haqida so'zlab bering..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                <LinkIcon className="w-3 h-3" /> LinkedIn URL
              </label>
              <input
                value={formData.linkedin}
                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none transition-all"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                <LinkIcon className="w-3 h-3" /> GitHub URL
              </label>
              <input
                value={formData.github}
                onChange={e => setFormData({ ...formData, github: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none transition-all"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon className="w-3 h-3" /> Avatar URL
            </label>
            <input
              value={formData.avatar}
              onChange={e => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none transition-all"
              placeholder="Rasm havolasi..."
            />
          </div>
        </form>

        <div className="p-8 border-t border-white/5 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 text-sm uppercase tracking-widest"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] py-4 bg-sky-500 hover:bg-sky-400 text-black font-bold rounded-2xl transition-all shadow-xl shadow-sky-500/20 text-sm uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full" /> : <Save className="w-5 h-5" />}
            Portfolioni saqlash
          </button>
        </div>
      </div>
    </div>
  );
}

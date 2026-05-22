import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { User } from 'firebase/auth';
import { logout } from '../firebase';

interface ProfileMenuProps {
  user: User;
  onShowResume: () => void;
  isAdmin: boolean;
  onShowAdmin: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, onShowResume, isAdmin, onShowAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shadow-lg">
          <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="" />
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-[10px] font-bold text-white leading-none mb-0.5 truncate max-w-[80px]">
            {user.displayName?.split(' ')[0]}
          </div>
          <div className="text-[8px] text-zinc-500 uppercase tracking-tighter font-black">
            {isAdmin ? 'ADMIN' : 'MEMBER'}
          </div>
        </div>
        <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-3 w-64 bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
            >
              <div className="px-4 py-3 border-b border-white/5 mb-2">
                <div className="text-[11px] font-bold text-white truncate">{user.displayName}</div>
                <div className="text-[9px] text-zinc-600 truncate">{user.email}</div>
              </div>

              <div className="space-y-0.5 px-2">
                <button 
                  onClick={() => { onShowResume(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-[11px] font-bold uppercase tracking-widest"
                >
                  <Briefcase className="w-4 h-4 text-sky-400" />
                  Profilim
                </button>
                {isAdmin && (
                  <button 
                    onClick={() => { onShowAdmin(); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-[11px] font-bold uppercase tracking-widest"
                  >
                    <Shield className="w-4 h-4 text-sky-400" />
                    Admin Panel
                  </button>
                )}
                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-[11px] font-bold uppercase tracking-widest">
                  <Settings className="w-4 h-4" />
                  Sozlamalar
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5 px-2">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all text-[11px] font-bold uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" />
                  Chiqish
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

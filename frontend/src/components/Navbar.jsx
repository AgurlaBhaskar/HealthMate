import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glassmorphism sticky top-0 z-50 border-b border-white/20 backdrop-blur-2xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group transition-all duration-300">
          <div className="bg-brand-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-brand-500/20">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-800 group-hover:text-brand-600 transition-colors">HealthMate</span>
        </Link>
        
        <div className="flex items-center gap-8">
          {currentUser ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                {[
                  { to: "/dashboard", label: "Dashboard" },
                  { to: "/fitness", label: "Fitness" },
                  { to: "/diet", label: "Diet" },
                  { to: "/appointments", label: "Appointments" },
                  { to: "/reports", label: "Reports" }
                ].map((link) => (
                  <Link 
                    key={link.to} 
                    to={link.to} 
                    className="relative py-2 text-slate-600 hover:text-brand-600 font-semibold transition-colors group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
                {currentUser?.user?.role === 'admin' && (
                  <Link to="/admin-dashboard" className="bg-slate-800 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-slate-700 transition-colors shadow-md">Admin</Link>
                )}
              </div>
              
              <div className="flex items-center gap-3 ml-4 pl-6 border-l border-slate-200">
                <div className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm transition-all hover:shadow-md">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                    {currentUser?.user?.name ? currentUser.user.name[0] : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-none">Account</span>
                    <span className="text-sm font-black text-slate-800 truncate max-w-[100px]">
                      {currentUser?.user?.name ? currentUser.user.name.split(' ')[0] : 'User'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 hover:text-brand-600 font-bold transition-colors px-4 py-2">Login</Link>
              <Link to="/register" className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-2xl font-black transition-all shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 transform hover:-translate-y-1 active:translate-y-0">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Mail, Lock, User, Ruler, Weight, Target, ArrowRight, AlertCircle } from 'lucide-react';
import axiosConfig from '../api/axiosConfig';
import authBg from '../assets/backgrounds/auth_bg.png';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', height: '', weight: '', fitnessGoal: 'Maintain'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axiosConfig.post('/auth/register', formData);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please attempt again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative py-20">
      <div 
        className="bg-hero-pattern animate-fade-in"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      <div className="overlay-gradient" />
      
      {/* Dynamic Aura */}
      <div className="fixed top-[-5%] left-[-5%] w-[45%] h-[45%] bg-brand-500/10 blur-[140px] rounded-full animate-float" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-indigo-500/10 blur-[130px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />

      <div className="glass-card w-full max-w-2xl p-12 relative animate-slide-up">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-brand-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-500/30 -rotate-3 hover:rotate-0 transition-transform duration-500">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create <span className="text-brand-600">Account</span></h2>
          <p className="text-slate-500 mt-3 font-medium">Begin your professional health transformation.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-2xl mb-8 text-sm font-black flex items-center gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                <input 
                  required type="text" 
                  placeholder="Full Name"
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Endpoint</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                <input 
                  required type="email" 
                  placeholder="vital@example.com"
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secure Passkey</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
              <input 
                required type="password" 
                placeholder="Minimum 8 characters"
                className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Age</label>
              <input 
                type="number" 
                className="w-full px-4 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-black text-center text-lg"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Height <span className="text-[8px] opacity-60">(cm)</span></label>
              <input 
                type="number" 
                className="w-full px-4 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-black text-center text-lg"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Weight <span className="text-[8px] opacity-60">(kg)</span></label>
              <input 
                type="number" 
                className="w-full px-4 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-black text-center text-lg"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Transformation Goal</label>
            <div className="relative group">
              <Target className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select 
                className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold appearance-none cursor-pointer"
                value={formData.fitnessGoal}
                onChange={(e) => setFormData({...formData, fitnessGoal: e.target.value})}
              >
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Maintain</option>
                <option>Endurance</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="group relative w-full bg-slate-900 border-b-4 border-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black py-5 rounded-[1.5rem] transition-all active:translate-y-1 active:border-b-0 flex items-center justify-center gap-3 uppercase tracking-widest text-sm shadow-xl"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Profile...</span>
              </div>
            ) : (
              <>
                <span>Initialize Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-10">
          <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-slate-200 hover:border-brand-500 hover:text-brand-600 font-black text-xs uppercase tracking-widest transition-all">
            Already have an account? Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

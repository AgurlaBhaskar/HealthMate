import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Plus, Apple, PieChart, Info, X, Utensils, Zap } from 'lucide-react';
import axiosConfig from '../api/axiosConfig';
import authBg from '../assets/backgrounds/auth_bg.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Required fields are missing.');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const res = await axiosConfig.post('/auth/login', { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email first to receive OTP.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axiosConfig.post('/auth/forgot-password', { email });
      setOtpSent(true);
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setError('Required fields are missing.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axiosConfig.post('/auth/reset-password', { email, otp, newPassword });
      setSuccess(res.data.message + '. You can now login.');
      setOtpSent(false);
      setShowForgot(false);
      setOtp('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative">
      <div 
        className="bg-hero-pattern animate-fade-in"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      <div className="overlay-gradient" />
      
      {/* Dynamic Aura */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-500/10 blur-[150px] rounded-full animate-float" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[130px] rounded-full animate-float" style={{ animationDelay: '-4s' }} />

      <div className="glass-card w-full max-w-lg p-12 relative animate-slide-up">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-brand-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-500/30 rotate-3 hover:rotate-0 transition-transform duration-500">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {showForgot ? (otpSent ? 'Reset' : 'Recover') : 'Welcome'} <span className="text-brand-600">{showForgot ? 'Access' : 'Back'}</span>
          </h2>
          <p className="text-slate-500 mt-3 font-medium">
            {showForgot ? 'Follow the steps to regain access.' : 'Your health journey continues here.'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-2xl mb-8 text-sm font-black flex items-center gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-5 rounded-2xl mb-8 text-sm font-black flex items-center gap-3">
            <PieChart className="w-5 h-5 shrink-0" />
            {success}
          </div>
        )}

        {!showForgot ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secure Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                <input 
                  type="email" 
                  required
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold"
                  placeholder="you@vital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Access Key</label>
                <button 
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline"
                >
                  Lost access?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                <input 
                  type="password" 
                  required
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={otpSent ? handleResetPassword : handleForgotPassword} className="space-y-6">
            {!otpSent ? (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                  <input 
                    type="email" 
                    required
                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold"
                    placeholder="you@vital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Verification OTP</label>
                  <div className="relative group">
                    <Zap className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                    <input 
                      type="text" 
                      required
                      maxLength="6"
                      className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold tracking-[0.5em] text-center"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Access Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                    <input 
                      type="password" 
                      required
                      className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-4">
              <button 
                type="submit" 
                disabled={loading}
                className="group relative w-full bg-brand-600 border-b-4 border-brand-800 hover:bg-brand-500 disabled:bg-slate-400 text-white font-black py-5 rounded-[1.5rem] transition-all active:translate-y-1 active:border-b-0 flex items-center justify-center gap-3 uppercase tracking-widest text-sm shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span>{otpSent ? 'Reset Key' : 'Request OTP'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => { setShowForgot(false); setOtpSent(false); setError(''); setSuccess(''); }}
                className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Return to Login
              </button>
            </div>
          </form>
        )}

        <div className="mt-12 text-center relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-400 font-bold italic">New to HealthMate?</span>
          </div>
        </div>

        <p className="text-center mt-8">
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-slate-200 hover:border-brand-500 hover:text-brand-600 font-black text-xs uppercase tracking-widest transition-all">
            Initialize New Account
            <Plus className="w-4 h-4" />
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Apple, TrendingUp, Filter, Download, Zap, PieChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosConfig from '../api/axiosConfig';
import reportsBg from '../assets/backgrounds/reports_bg.png';

export default function Reports() {
  const { currentUser } = useAuth();
  const [timeframe, setTimeframe] = useState('weekly');
  const [activityData, setActivityData] = useState([]);
  const [dietData, setDietData] = useState([]);
  const [stats, setStats] = useState({ avgBurn: 0, avgIntake: 0, avgProtein: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!currentUser?.user?.id) return;
      
      try {
        setLoading(true);
        const [activitiesRes, dietsRes] = await Promise.all([
          axiosConfig.get(`/activities/user/${currentUser.user.id}`),
          axiosConfig.get(`/diets/user/${currentUser.user.id}`)
        ]);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            fullDate: d.toLocaleDateString(),
            dayName: days[d.getDay()],
            calories: 0,
            duration: 0,
            intake: 0,
            protein: 0,
            goal: 2000
          };
        });

        activitiesRes.data.forEach(act => {
          const actDate = new Date(act.date).toLocaleDateString();
          const dayObj = last7Days.find(d => d.fullDate === actDate);
          if (dayObj) {
            dayObj.calories += act.caloriesBurned || 0;
            dayObj.duration += act.duration || 0;
          }
        });

        dietsRes.data.forEach(diet => {
          const dietDate = new Date(diet.date).toLocaleDateString();
          const dayObj = last7Days.find(d => d.fullDate === dietDate);
          if (dayObj) {
            dayObj.intake += diet.calories || 0;
            dayObj.protein += diet.protein || 0;
          }
        });

        setActivityData(last7Days.map(d => ({ day: d.dayName, calories: d.calories, duration: d.duration })));
        setDietData(last7Days.map(d => ({ day: d.dayName, calories: d.intake, protein: d.protein, goal: d.goal })));

        const totalBurn = last7Days.reduce((sum, d) => sum + d.calories, 0);
        const totalIntake = last7Days.reduce((sum, d) => sum + d.intake, 0);
        const totalProtein = last7Days.reduce((sum, d) => sum + d.protein, 0);

        setStats({
          avgBurn: Math.round(totalBurn / 7),
          avgIntake: Math.round(totalIntake / 7),
          avgProtein: Math.round(totalProtein / 7)
        });

      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentUser]);

  return (
    <>
      <div 
        className="bg-hero-pattern animate-fade-in opacity-85"
        style={{ backgroundImage: `url(${reportsBg})` }}
      />
      <div className="overlay-gradient bg-white/10" />
      
      {/* Analytical Decorative Elements */}
      <div className="fixed top-20 right-[5%] w-[35%] h-[35%] bg-blue-500/10 blur-[130px] rounded-full animate-float" />
      <div className="fixed bottom-20 left-[-5%] w-[45%] h-[45%] bg-purple-500/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-4s' }} />

      <div className="max-w-7xl mx-auto py-12 px-6 relative animate-slide-up">
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
               <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/30">
                 <PieChart className="text-white w-8 h-8" />
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                 Health <span className="text-indigo-600">Insights</span>
               </h1>
            </div>
            <p className="text-lg text-slate-500 font-medium">Deep data analysis of your physical and nutritional evolution.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-white/50 backdrop-blur-xl p-1.5 rounded-2xl border border-white shadow-xl">
              <button 
                onClick={() => setTimeframe('weekly')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${timeframe === 'weekly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/50'}`}
              >
                Weekly
              </button>
              <button 
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 cursor-not-allowed`}
              >
                Monthly
              </button>
            </div>
            <button className="p-4 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="glass-card p-10 group">
            <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                <Activity className="w-6 h-6 text-brand-600" />
                Performance Metrics
              </h3>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Burn</span>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '800'}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '800'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '15px'}}
                    itemStyle={{fontWeight: '900', color: '#4f46e5'}}
                  />
                  <Bar dataKey="calories" fill="url(#indigoGradient)" radius={[10, 10, 0, 0]} maxBarSize={30} />
                  <defs>
                    <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-10">
            <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                <Apple className="w-6 h-6 text-green-600" />
                Nutritional Integrity
              </h3>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Current</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-slate-300 rounded-full" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Target</span>
                 </div>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dietData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '800'}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '800'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '15px'}}
                  />
                  <Area type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorCal)" />
                  <Area type="step" dataKey="goal" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="8 8" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 group hover:border-indigo-200 transition-all">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
              <Zap className="w-6 h-6" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Avg Daily Burn</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{stats.avgBurn}</span>
              <span className="text-sm font-bold text-slate-400">kcal</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50">
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">PROACTIVE PHASE</span>
            </div>
          </div>
          
          <div className="glass-card p-8 group hover:border-green-200 transition-all">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
              <Apple className="w-6 h-6" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Avg Daily Intake</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{stats.avgIntake}</span>
              <span className="text-sm font-bold text-slate-400">kcal</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50">
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">CONSISTENT FLOW</span>
            </div>
          </div>
          
          <div className="glass-card p-8 group hover:border-purple-200 transition-all">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
              <PieChart className="w-6 h-6" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Protein Synthesis</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{stats.avgProtein}</span>
              <span className="text-sm font-bold text-slate-400">g</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Target: 120g</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

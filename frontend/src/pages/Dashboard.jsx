import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Activity, Flame, HeartPulse, Apple, ChevronRight, Bell } from 'lucide-react';
import axiosConfig from '../api/axiosConfig';
import dashboardBg from '../assets/backgrounds/dashboard_bg.png';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ burned: 0, minutes: 0, eaten: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser?.user?.id) return;
      
      try {
        setLoading(true);
        const [activitiesRes, dietsRes, apptsRes] = await Promise.all([
          axiosConfig.get(`/activities/user/${currentUser.user.id}`),
          axiosConfig.get(`/diets/user/${currentUser.user.id}`),
          axiosConfig.get(`/appointments/user/${currentUser.user.id}`)
        ]);

        const today = new Date().toLocaleDateString();
        
        const todayActivities = activitiesRes.data.filter(act => 
          new Date(act.date).toLocaleDateString() === today
        );
        const burned = todayActivities.reduce((sum, act) => sum + (act.caloriesBurned || 0), 0);
        const minutes = todayActivities.reduce((sum, act) => sum + (act.duration || 0), 0);
        
        const todayDiets = dietsRes.data.filter(diet => 
          new Date(diet.date).toLocaleDateString() === today
        );
        const eaten = todayDiets.reduce((sum, diet) => sum + (diet.calories || 0), 0);

        setStats({ burned, minutes, eaten });
        
        setRecentActivities(activitiesRes.data.slice(0, 3).map(act => ({
          id: act._id,
          title: act.type,
          duration: `${act.duration} min`,
          cal: `${act.caloriesBurned} cal`,
          time: new Date(act.date).toLocaleDateString()
        })));

        setUpcomingAppointments(apptsRes.data.slice(0, 2).map(app => ({
          id: app._id,
          name: app.providerName,
          type: app.type,
          time: `${new Date(app.date).toLocaleDateString()}, ${app.time}`
        })));

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <>
      <div 
        className="bg-hero-pattern animate-fade-in opacity-85"
        style={{ backgroundImage: `url(${dashboardBg})` }}
      />
      <div className="overlay-gradient bg-white/10" />
      
      {/* Decorative Blobs */}
      <div className="fixed top-20 right-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full animate-float" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-2s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden hidden lg:block">
        <Flame className="absolute top-[20%] right-[15%] text-orange-200/20 w-16 h-16 animate-float" style={{ animationDelay: '1.5s' }} />
        <Bell className="absolute bottom-[25%] left-[20%] text-brand-200/20 w-12 h-12 animate-float" style={{ animationDelay: '2.5s' }} />
        <HeartPulse className="absolute top-[40%] left-[5%] text-rose-200/20 w-20 h-20 animate-float" style={{ animationDelay: '0.8s' }} />
        <Activity className="absolute bottom-[15%] right-[10%] text-brand-200/20 w-14 h-14 animate-float" style={{ animationDelay: '3.2s' }} />
        <HeartPulse className="absolute top-[10%] left-[30%] text-rose-200/10 w-12 h-12 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 relative animate-slide-up">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-brand-100 text-brand-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Premium Member</span>
              <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                <Bell className="w-3 h-3" />
                <span>2 New Notifications</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
              Welcome back, <span className="text-gradient">{currentUser?.user?.name ? currentUser.user.name.split(' ')[0] : 'User'}!</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium">Here's your high-performance wellness summary for today.</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="glassmorphism p-4 rounded-2xl hover:scale-105 transition-transform shadow-xl">
               <ChevronRight className="w-6 h-6 text-slate-400" />
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Flame className="text-white w-6 h-6" />} color="bg-orange-500" label="Calories Burned" value={`${stats.burned} kcal`} growth="+12%" />
          <StatCard icon={<Activity className="text-white w-6 h-6" />} color="bg-brand-500" label="Active Minutes" value={`${stats.minutes} mins`} growth="+5%" />
          <StatCard icon={<Apple className="text-white w-6 h-6" />} color="bg-emerald-500" label="Calories Eaten" value={`${stats.eaten} kcal`} growth="-8%" />
          <StatCard icon={<HeartPulse className="text-white w-6 h-6" />} color="bg-rose-500" label="Avg Heart Rate" value="72 bpm" growth="Stable" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-10">
            <div className="flex items-center justify-between mb-10 border-b border-slate-100/50 pb-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Performance</h3>
              <button className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">View All Activities</button>
            </div>
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100/50 animate-pulse rounded-2xl"></div>)}
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map(act => (
                  <ActivityRow key={act.id} title={act.title} duration={act.duration} cal={act.cal} time={act.time} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium italic">No recent activities logged yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-10 bg-gradient-to-br from-indigo-600 to-brand-700 border-none shadow-brand-500/20">
            <div className="flex items-center justify-between mb-10 border-b border-white/20 pb-6">
              <h3 className="text-2xl font-black text-white tracking-tight">Next Sessions</h3>
              <button className="text-sm font-bold text-white/70 hover:text-white transition-colors">Schedule</button>
            </div>
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col gap-4">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-white/10 animate-pulse rounded-2xl"></div>)}
                </div>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(app => (
                  <AppointmentRow key={app.id} name={app.name} type={app.type} time={app.time} />
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-white/20 rounded-3xl">
                  <p className="text-white/50 font-medium text-sm">No upcoming appointments.</p>
                  <button className="mt-4 bg-white text-indigo-600 px-6 py-2 rounded-xl text-sm font-black hover:scale-105 transition-transform shadow-lg">Book Now</button>
                </div>
              )}
              
              <div className="mt-10 p-6 bg-white/10 rounded-3xl border border-white/10">
                <p className="text-white/80 text-sm leading-relaxed mb-4 font-medium italic">
                  "Health is the greatest possession. Contentment is the greatest treasure."
                </p>
                <div className="h-1 w-12 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, color, label, value, growth }) {
  return (
    <div className="glass-card p-6 flex items-center gap-5 group cursor-pointer relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-5 blur-[40px] group-hover:opacity-20 transition-opacity`} />
      <div className={`w-16 h-16 ${color} rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-${color.split('-')[1]}-500/30 group-hover:scale-110 transition-transform duration-500 flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${growth.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : growth.startsWith('-') ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
            {growth}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ title, duration, cal, time }) {
  return (
    <div className="flex items-center justify-between p-5 hover:bg-white/50 rounded-[2rem] transition-all duration-300 border border-transparent hover:border-white hover:shadow-xl group">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all duration-500">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-black text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{title}</h4>
          <p className="text-xs text-slate-400 font-bold">{time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-black text-slate-900 text-lg leading-none mb-1">{cal}</p>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{duration}</p>
      </div>
    </div>
  );
}

function AppointmentRow({ name, type, time }) {
  return (
    <div className="p-6 bg-white/10 hover:bg-white/20 rounded-[2rem] border border-white/10 transition-all duration-300 group cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center font-black text-white text-xs">
            {name[0]}
          </div>
          <h4 className="font-black text-white tracking-tight">{name}</h4>
        </div>
        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{type}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-white/80">{time}</p>
        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}

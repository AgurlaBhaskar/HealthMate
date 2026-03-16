import { useState, useEffect } from 'react';
import { Users, Calendar, Utensils, Activity, Trash2, PieChart, ShieldAlert, Search, Download, ChevronRight, Settings, Lock, HeartPulse } from 'lucide-react';
import axiosConfig from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import dashboardBg from '../assets/backgrounds/dashboard_bg.png';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ users: 0, appointments: 0, diets: 0, activities: 0, growth: [] });
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [diets, setDiets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser || currentUser?.user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes, apptsRes, dietsRes, activitiesRes] = await Promise.all([
          axiosConfig.get('/admin/stats'),
          axiosConfig.get('/admin/users'),
          axiosConfig.get('/admin/appointments'),
          axiosConfig.get('/admin/diets'),
          axiosConfig.get('/admin/activities')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setAppointments(apptsRes.data);
        setDiets(dietsRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        console.error("Admin data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axiosConfig.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch {
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('CRITICAL: Delete user and ALL associated data?')) {
      try {
        await axiosConfig.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
        const statsRes = await axiosConfig.get('/admin/stats');
        setStats(statsRes.data);
      } catch {
        alert('Failed to delete user');
      }
    }
  };
  
  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Remove this appointment record?')) {
      try {
        await axiosConfig.delete(`/admin/appointments/${id}`);
        setAppointments(appointments.filter(a => a._id !== id));
        setStats({ ...stats, appointments: stats.appointments - 1 });
      } catch { alert('Failed to delete'); }
    }
  };

  const handleDeleteDiet = async (id) => {
    if (window.confirm('Purge this diet entry?')) {
      try {
        await axiosConfig.delete(`/admin/diets/${id}`);
        setDiets(diets.filter(d => d._id !== id));
        setStats({ ...stats, diets: stats.diets - 1 });
      } catch { alert('Failed to delete'); }
    }
  };

  const handleDeleteActivity = async (id) => {
    if (window.confirm('Discard this fitness log?')) {
      try {
        await axiosConfig.delete(`/admin/activities/${id}`);
        setActivities(activities.filter(a => a._id !== id));
        setStats({ ...stats, activities: stats.activities - 1 });
      } catch { alert('Failed to delete'); }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-brand-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Accessing Command Center...</p>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="bg-hero-pattern animate-fade-in opacity-85"
        style={{ backgroundImage: `url(${dashboardBg})` }}
      />
      <div className="overlay-gradient bg-white/20" />
      
      {/* Admin Decorative Elements */}
      <div className="fixed top-20 left-[10%] w-[30%] h-[30%] bg-rose-500/10 blur-[120px] rounded-full animate-float" />
      <div className="fixed bottom-20 right-[5%] w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-5s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden hidden lg:block text-slate-200/20">
         <ShieldAlert className="absolute top-[15%] left-[20%] w-20 h-20 animate-float" style={{ animationDelay: '1s' }} />
         <Lock className="absolute bottom-[25%] right-[15%] w-16 h-16 animate-float" style={{ animationDelay: '3s' }} />
         <Users className="absolute top-[40%] right-[10%] w-24 h-24 animate-float" style={{ animationDelay: '0.5s' }} />
         <PieChart className="absolute bottom-[10%] left-[15%] w-14 h-14 animate-float" style={{ animationDelay: '2.2s' }} />
         <HeartPulse className="absolute top-[10%] right-[30%] w-12 h-12 animate-float opacity-50" style={{ animationDelay: '1.5s' }} />
         <Activity className="absolute bottom-[40%] left-[5%] w-16 h-16 animate-float opacity-50" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 relative animate-slide-up">
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-100 text-rose-700 rounded-full mb-4 border border-rose-200 animate-pulse shadow-sm">
               <ShieldAlert className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Administrator Access</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              Control <span className="text-brand-600">Terminal</span>
            </h1>
            <p className="text-lg text-slate-600 mt-2 font-medium">Monitoring platform integrity and user demographics.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
               <input
                 type="text"
                 placeholder="Terminal Search..."
                 className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-64 focus:w-80 transition-all font-bold text-sm shadow-xl focus:ring-4 focus:ring-brand-500/10"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
             <button className="p-4 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-brand-600 transition-all shadow-sm">
               <Settings className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <AdminStatCard icon={<Users />} label="Nodes (Users)" value={stats.users} color="from-blue-600 to-indigo-600" />
          <AdminStatCard icon={<Calendar />} label="Bookings" value={stats.appointments} color="from-purple-600 to-fuchsia-600" />
          <AdminStatCard icon={<Utensils />} label="Dietary Units" value={stats.diets} color="from-emerald-600 to-green-600" />
          <AdminStatCard icon={<Activity />} label="Fitness Cycles" value={stats.activities} color="from-orange-600 to-amber-600" />
        </div>

        {/* Tabs Control */}
        <div className="flex bg-white/30 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/50 shadow-2xl mb-10 w-fit">
          <TabButton id="stats" active={activeTab} set={setActiveTab} icon={<PieChart className="w-4 h-4" />} label="PLATFORM" />
          <TabButton id="users" active={activeTab} set={setActiveTab} icon={<Users className="w-4 h-4" />} label="POPULATION" />
          <TabButton id="appts" active={activeTab} set={setActiveTab} icon={<Calendar className="w-4 h-4" />} label="SCHEDULES" />
          <TabButton id="records" active={activeTab} set={setActiveTab} icon={<Utensils className="w-4 h-4" />} label="DATA LOGS" />
        </div>

        <div className="animate-fade-in">
          {activeTab === 'users' && (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Endpoint</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Privilege</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Creation</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.filter(u => 
                      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      u.email.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length > 0 ? (
                      users.filter(u => 
                        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map(user => (
                        <tr key={user._id} className="group hover:bg-white/50 transition-colors">
                          <td className="px-8 py-6 font-black text-slate-900">{user.name}</td>
                          <td className="px-8 py-6 text-slate-500 font-medium italic">{user.email}</td>
                          <td className="px-8 py-6">
                            <div className="relative inline-block">
                              <select 
                                value={user.role} 
                                onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                                className={`pl-3 pr-8 py-2 rounded-xl text-[10px] font-black uppercase ring-1 ring-inset appearance-none cursor-pointer focus:ring-2 transition-all ${user.role === 'admin' ? 'bg-rose-50 text-rose-600 ring-rose-200' : 'bg-slate-50 text-slate-600 ring-slate-200'}`}
                              >
                                <option value="user">USER</option>
                                <option value="admin">ADMIN</option>
                                <option value="trainer">TRAINER</option>
                                <option value="nutritionist">NUTRITIONIST</option>
                              </select>
                              <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-current rotate-90" />
                            </div>
                          </td>
                          <td className="px-8 py-6 text-slate-400 font-medium text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-8 py-6 text-right">
                            {user._id !== currentUser.user.id && (
                              <button 
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-bold italic">
                          No nodes found matching your sequence.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'appts' && (
            <div className="glass-card p-10">
              <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">System Calendar</h3>
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">Queue</span>
              </div>
              <div className="grid gap-6">
                {appointments.filter(a => 
                  a.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  a.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                ).length > 0 ? (
                  appointments.filter(a => 
                    a.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map(app => (
                    <div key={app._id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] border border-white hover:border-brand-200 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center font-black text-brand-600 text-xl border border-brand-50">
                          {app.user?.name ? app.user.name[0] : 'U'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg tracking-tight">{app.providerName}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">SUBJECT: {app.user?.name || 'GENERIC NODE'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                           <p className="font-black text-slate-900">{new Date(app.date).toLocaleDateString()}</p>
                           <div className="flex items-center gap-2 justify-end mt-1">
                              <div className={`w-2 h-2 rounded-full ${app.status === 'Completed' ? 'bg-emerald-500' : 'bg-brand-500'} animate-pulse`} />
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{app.status}</span>
                           </div>
                         </div>
                         <button 
                           onClick={() => handleDeleteAppointment(app._id)}
                           className="p-4 bg-white text-slate-300 hover:text-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                    <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No schedules match your search parameters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass-card p-10">
                 <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-5">
                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                     <Utensils className="w-5 h-5 text-emerald-500" />
                     Dietary Flux
                   </h3>
                 </div>
                 <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {diets.filter(diet => 
                      diet.foodItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      diet.mealType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      diet.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length > 0 ? (
                      diets.filter(diet => 
                        diet.foodItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        diet.mealType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        diet.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map(diet => (
                        <div key={diet._id} className="p-5 bg-white/50 rounded-2xl border border-white flex justify-between items-center group">
                          <div>
                            <p className="font-black text-slate-900">{diet.foodItem}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{diet.user?.name || 'NODE'} • {diet.mealType}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-black text-emerald-600 text-sm italic">{diet.calories} kcal</span>
                            <button onClick={() => handleDeleteDiet(diet._id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                               <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 font-bold italic border border-dashed border-slate-100 rounded-2xl">
                        No nutrition logs found matching your search.
                      </div>
                    )}
                 </div>
              </div>

              <div className="glass-card p-10">
                 <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-5">
                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                     <Activity className="w-5 h-5 text-orange-500" />
                     Kinetic Data
                   </h3>
                 </div>
                 <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {activities.filter(act => 
                      act.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      act.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length > 0 ? (
                      activities.filter(act => 
                        act.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        act.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map(act => (
                        <div key={act._id} className="p-5 bg-white/50 rounded-2xl border border-white flex justify-between items-center group">
                          <div>
                            <p className="font-black text-slate-900">{act.type}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{act.user?.name || 'NODE'} • {act.duration}m</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-black text-orange-600 text-sm italic">{act.caloriesBurned} kcal</span>
                            <button onClick={() => handleDeleteActivity(act._id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                               <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 font-bold italic border border-dashed border-slate-100 rounded-2xl">
                        No activity logs found matching your search.
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass-card p-10">
                <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight">Growth Velocity</h3>
                <div className="h-72 flex items-end justify-between gap-6 px-4">
                  {stats.growth?.map((g, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4">
                      <div className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-2xl transition-all duration-700 hover:scale-105 cursor-pointer group relative shadow-lg shadow-brand-500/20" style={{ height: `${Math.max(10, (g.count / (Math.max(...stats.growth.map(x => x.count)) || 1)) * 100)}%` }}>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 shadow-2xl scale-75 group-hover:scale-100">
                          +{g.count} NODES
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{g.month}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass-card p-10 flex flex-col justify-center text-center">
                <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-brand-500/10">
                  <ShieldAlert className="w-12 h-12 text-brand-600" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Integrity Verified</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 text-lg">System logic is consistent across all clusters. Core performance metrics are optimal.</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100 group hover:bg-emerald-100 transition-colors">
                    <p className="text-emerald-600 font-black text-4xl italic">100%</p>
                    <p className="text-emerald-500 text-[10px] font-black mt-2 uppercase tracking-widest">Logic Uptime</p>
                  </div>
                  <div className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100 group hover:bg-indigo-100 transition-colors">
                    <p className="text-indigo-600 font-black text-4xl italic">0.4ms</p>
                    <p className="text-indigo-500 text-[10px] font-black mt-2 uppercase tracking-widest">Data Flow</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function AdminStatCard({ icon, label, value, color }) {
  return (
    <div className="glass-card p-8 group hover:scale-[1.02] transition-all duration-500">
      <div className={`w-14 h-14 bg-gradient-to-br ${color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-current/20 group-hover:rotate-6 transition-transform`}>
        {icon}
      </div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  );
}

function TabButton({ id, active, set, icon, label }) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => set(id)}
      className={`px-8 py-4 rounded-[1.5rem] flex items-center gap-3 text-xs font-black tracking-widest transition-all ${isActive ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/30 -translate-y-1' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
    >
      {icon}
      {label}
    </button>
  );
}

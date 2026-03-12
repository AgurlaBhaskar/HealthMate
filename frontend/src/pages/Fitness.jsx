import { useState, useEffect } from 'react';
import { Activity, Plus, TrendingUp, Info, X, Zap, Target, HeartPulse } from 'lucide-react';
import Confetti from 'react-confetti';
import { useAuth } from '../context/AuthContext';
import axiosConfig from '../api/axiosConfig';
import dashboardBg from '../assets/backgrounds/dashboard_bg.png';

const ACTIVITY_METS = {
  'Running': 9.8,
  'Walking': 3.5,
  'Cycling': 8.0,
  'Swimming': 6.0,
  'Weightlifting': 3.5,
  'Yoga': 2.5
};
const DEFAULT_WEIGHT_KG = 70;

export default function Fitness() {
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'Running', duration: '', distance: '', calories: '', date: new Date().toISOString().split('T')[0] });
  const [isManualCalories, setIsManualCalories] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(2000);
  const [showConfetti, setShowConfetti] = useState(false);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!currentUser?.user?.id) return;
      try {
        const res = await axiosConfig.get(`/activities/user/${currentUser.user.id}`);
        const formattedData = res.data.map(act => ({
          ...act,
          id: act._id,
          type: act.type,
          calories: act.caloriesBurned,
          date: new Date(act.date).toLocaleDateString()
        }));
        setActivities(formattedData);
      } catch (err) {
        console.error("Failed to fetch activities", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [currentUser]);

  useEffect(() => {
    if (!isManualCalories && newActivity.duration && newActivity.type) {
      const metValue = ACTIVITY_METS[newActivity.type] || 1;
      const durationHours = Number(newActivity.duration) / 60;
      const calculatedCalories = Math.round(metValue * DEFAULT_WEIGHT_KG * durationHours);
      
      setNewActivity(prev => ({ ...prev, calories: calculatedCalories.toString() }));
    }
  }, [newActivity.type, newActivity.duration, isManualCalories]);

  const weeklyTotal = activities.reduce((sum, act) => {
    const actDate = new Date(act.date);
    const now = new Date();
    const diff = now - actDate;
    const daysDiff = diff / (1000 * 60 * 60 * 24);
    return daysDiff <= 7 ? sum + (act.calories || 0) : sum;
  }, 0);

  const goalReached = weeklyTotal >= weeklyGoal;

  useEffect(() => {
    if (goalReached && activities.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [goalReached, activities.length]);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.duration || !newActivity.calories || !currentUser?.user?.id) return;
    
    const activityData = {
      user: currentUser.user.id,
      type: newActivity.type,
      duration: Number(newActivity.duration),
      caloriesBurned: Number(newActivity.calories),
      distance: newActivity.distance ? Number(newActivity.distance) : null,
      date: newActivity.date
    };

    try {
      const res = await axiosConfig.post('/activities', activityData);
      
      setActivities([
        { 
          ...activityData, 
          id: res.data._id, 
          type: res.data.type,
          calories: res.data.caloriesBurned,
          date: new Date(res.data.date).toLocaleDateString()
        },
        ...activities
      ]);
      setShowModal(false);
      setNewActivity({ type: 'Running', duration: '', distance: '', calories: '', date: new Date().toISOString().split('T')[0] });
      setIsManualCalories(false);
    } catch (err) {
      console.error("Failed to save activity", err);
    }
  };

  return (
    <>
      <div 
        className="bg-hero-pattern animate-fade-in opacity-85"
        style={{ backgroundImage: `url(${dashboardBg})` }}
      />
      <div className="overlay-gradient bg-white/10" />
      
      {/* Dynamic Energy Decorations */}
      <div className="fixed top-20 left-[-10%] w-[45%] h-[45%] bg-indigo-500/10 blur-[140px] rounded-full animate-float" />
      <div className="fixed bottom-20 right-[-5%] w-[35%] h-[35%] bg-brand-500/10 blur-[110px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden hidden lg:block text-brand-200/20">
         <Activity className="absolute top-[10%] right-[15%] w-20 h-20 animate-float" style={{ animationDelay: '1.2s' }} />
         <Zap className="absolute bottom-[20%] left-[10%] w-16 h-16 animate-float" style={{ animationDelay: '2.8s' }} />
         <HeartPulse className="absolute top-[40%] left-[5%] w-14 h-14 animate-float" style={{ animationDelay: '0.5s' }} />
         <Target className="absolute bottom-[40%] right-[5%] w-24 h-24 animate-float" style={{ animationDelay: '1.8s' }} />
         <TrendingUp className="absolute top-[20%] left-[25%] w-12 h-12 animate-float" style={{ animationDelay: '3.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 relative animate-slide-up">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} gravity={0.15} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, pointerEvents: 'none' }} />}
        
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
               <div className="p-3 bg-brand-600 rounded-2xl shadow-xl shadow-brand-500/30">
                 <Zap className="text-white w-8 h-8" />
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                 Fitness <span className="text-brand-600">Performance</span>
               </h1>
            </div>
            <p className="text-lg text-slate-500 font-medium">Push your limits. Analyze your growth.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="group relative bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-brand-500/50 hover:shadow-brand-500/70 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            <span>Track Activity</span>
            <div className="absolute inset-0 rounded-[2rem] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-10">
            <h3 className="text-2xl font-black text-slate-900 mb-10 border-b border-slate-100 pb-6 flex items-center gap-3">
              <Activity className="w-6 h-6 text-brand-600" />
              Activity Stream
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-[2rem]"></div>)}
                </div>
              ) : activities.length > 0 ? (
                activities.map(act => (
                  <div key={act.id} className="flex justify-between items-center p-6 bg-slate-50/50 hover:bg-white rounded-[2rem] border border-slate-100 hover:border-brand-200 transition-all duration-300 group hover:shadow-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-sm">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 group-hover:text-brand-700 transition-colors uppercase tracking-tight">{act.type}</h4>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.date}</span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full" />
                           <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{act.duration} mins</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900 leading-none mb-1">{act.calories} <span className="text-[10px] text-slate-400">kcal</span></p>
                      {act.distance && <p className="text-[10px] text-brand-600 font-bold uppercase tracking-widest">{act.distance} km</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <Activity className="w-16 h-16 mx-auto text-slate-200 mb-6" />
                  <p className="text-xl font-bold text-slate-400 italic">No activities recorded yet.</p>
                  <p className="text-sm text-slate-300 mt-2">Finish a workout and log it here!</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-card p-10 bg-gradient-to-br from-brand-600 to-indigo-700 text-white border-none shadow-brand-500/20">
            <div className="flex items-center gap-3 mb-10 border-b border-white/20 pb-6">
               <Target className="w-8 h-8 text-white/80" />
               <h3 className="text-2xl font-black tracking-tight">Active Goals</h3>
            </div>
            
            <div className="mb-10">
              <p className="text-lg font-medium text-brand-100 mb-6 leading-relaxed">
                {goalReached 
                  ? "Elite status achieved! You've surpassed your weekly target. 🎉" 
                  : `You've burned ${weeklyTotal} kcal this week. Only ${weeklyGoal - weeklyTotal} kcal left to your target!`}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-xs font-black uppercase tracking-widest opacity-80">Weekly Burn</span>
                  <span className="text-xs font-bold">{weeklyTotal} / {weeklyGoal} kcal</span>
                </div>
                <div className="w-full bg-black/10 rounded-full h-4 overflow-hidden shadow-inner p-1">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                    style={{ width: `${Math.min(100, (weeklyTotal / weeklyGoal) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <label className="text-[10px] text-brand-200 font-black uppercase tracking-widest">Target Adjustment</label>
                <span className="text-xl font-black">{weeklyGoal} kcal</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="10000" 
                step="500"
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                className="w-full accent-white h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-3 text-[8px] font-black text-white/40 uppercase tracking-tighter">
                <span>Starter (500)</span>
                <span>Pro (10000)</span>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-xl shadow-2xl relative animate-slide-up overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-[50px] rounded-full" />
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-2 bg-brand-100 rounded-xl">
                    <Zap className="w-6 h-6 text-brand-600" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Record Workout</h2>
                </div>
                <p className="text-slate-500 font-medium">Capture your effort and track your consistency.</p>
              </div>

              <form onSubmit={handleAddActivity} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Activity</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      value={newActivity.type}
                      onChange={e => setNewActivity({...newActivity, type: e.target.value})}
                    >
                      {Object.keys(ACTIVITY_METS).map(type => <option key={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all font-bold"
                      value={newActivity.date}
                      onChange={e => setNewActivity({...newActivity, date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration (mins)</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      placeholder="e.g. 45"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all font-bold"
                      value={newActivity.duration}
                      onChange={e => setNewActivity({...newActivity, duration: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Energy Burned</label>
                      {newActivity.duration && newActivity.type && !isManualCalories && (
                        <span className="text-[10px] bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full font-black animate-pulse">SMART FILL</span>
                      )}
                    </div>
                    <input 
                      type="number" 
                      required
                      min="1"
                      placeholder="kcal"
                      className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none font-bold ${!isManualCalories && newActivity.calories ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-slate-50 border-slate-200 focus:ring-brand-500 focus:bg-white'}`}
                      value={newActivity.calories}
                      onChange={e => {
                        setNewActivity({...newActivity, calories: e.target.value});
                        setIsManualCalories(true);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Distance (km)</label>
                    <span className="text-[10px] text-slate-300 font-bold italic">Optional</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    placeholder="e.g. 5.5"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all font-bold"
                    value={newActivity.distance}
                    onChange={e => setNewActivity({...newActivity, distance: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-8 py-5 rounded-3xl font-black text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-widest text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-brand-600 hover:bg-brand-700 text-white px-8 py-5 rounded-3xl font-black shadow-xl shadow-brand-500/20 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm"
                  >
                    Save Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

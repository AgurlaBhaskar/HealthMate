import { useState, useEffect } from 'react';
import { CalendarHeart, Plus, Video, MapPin, X, User, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import axiosConfig from '../api/axiosConfig';
import apptBg from '../assets/backgrounds/appointments_bg.png';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAppt, setNewAppt] = useState({ provider: '', type: 'General Physician', date: '', time: '', mode: 'Video Call' });
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser?.user?.id) return;
      try {
        const res = await axiosConfig.get(`/appointments/user/${currentUser.user.id}`);
        const formattedData = res.data.map(app => {
          const dateObj = new Date(app.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          return {
            ...app,
            id: app._id,
            provider: app.providerName,
            type: app.type,
            date: formattedDate,
            time: app.time,
            status: app.status,
            mode: app.mode
          };
        });
        setAppointments(formattedData);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [currentUser]);

  const handleBookAppt = async (e) => {
    e.preventDefault();
    if (!newAppt.provider || !newAppt.date || !newAppt.time || !currentUser?.user?.id) return;

    const [hours, minutes] = newAppt.time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedTime = `${h % 12 || 12}:${minutes} ${ampm}`;

    const apptData = {
      user: currentUser.user.id,
      providerName: newAppt.provider,
      type: newAppt.type,
      date: newAppt.date,
      time: formattedTime,
      mode: newAppt.mode
    };

    try {
      const res = await axiosConfig.post('/appointments', apptData);
      
      const dateObj = new Date(res.data.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      setAppointments([
        { 
          ...apptData, 
          id: res.data._id,
          provider: res.data.providerName,
          date: formattedDate,
          status: 'Scheduled'
        },
        ...appointments
      ]);
      setShowModal(false);
      setNewAppt({ provider: '', type: 'General Physician', date: '', time: '', mode: 'Video Call' });
    } catch (err) {
      console.error("Failed to save appointment", err);
    }
  };

  return (
    <>
      <div 
        className="bg-hero-pattern animate-fade-in opacity-85"
        style={{ backgroundImage: `url(${apptBg})` }}
      />
      <div className="overlay-gradient bg-white/10" />
      
      {/* Calm Decorative Elements */}
      <div className="fixed top-1/3 right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full animate-float" />
      <div className="fixed bottom-1/4 left-0 w-[40%] h-[40%] bg-blue-500/10 blur-[140px] rounded-full animate-float" style={{ animationDelay: '-5s' }} />

      <div className="max-w-7xl mx-auto py-12 px-6 relative animate-slide-up">
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
               <div className="p-3 bg-purple-600 rounded-2xl shadow-xl shadow-purple-500/30">
                 <CalendarHeart className="text-white w-8 h-8" />
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                 My <span className="text-purple-600">Consultations</span>
               </h1>
            </div>
            <p className="text-lg text-slate-500 font-medium">Connect with experts that care about your journey.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="group relative bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-purple-500/40 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            <span>Schedule Now</span>
            <div className="absolute inset-0 rounded-[2rem] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </header>

        <div className="glass-card p-10">
          <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">Upcoming & Past Sessions</h3>
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest">Sort: Newest</span>
             </div>
          </div>
          
          <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-50 animate-pulse rounded-[2.5rem]"></div>)}
              </div>
            ) : appointments.map(app => (
              <div key={app.id} className="flex flex-col lg:flex-row justify-between lg:items-center p-8 bg-slate-50/50 hover:bg-white rounded-[2.5rem] border border-slate-100 hover:border-purple-200 transition-all duration-500 group hover:shadow-2xl">
                <div className="flex items-start gap-6 mb-6 lg:mb-0">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-purple-600 font-black text-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-50">
                    {app.provider.split(' ')[1]?.[0] || app.provider[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-xl tracking-tight uppercase group-hover:text-purple-700 transition-colors">{app.provider}</h4>
                    <p className="text-purple-600 text-sm font-black uppercase tracking-widest mt-1">{app.type}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter flex items-center gap-1.5">
                        {app.mode === 'Video Call' ? <Video className="w-3.5 h-3.5 text-blue-500" /> : <MapPin className="w-3.5 h-3.5 text-rose-500" />}
                        {app.mode}
                      </p>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between lg:justify-end gap-10 lg:border-l lg:border-slate-100 lg:pl-10 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <div className="flex items-center lg:justify-end gap-2 text-slate-900 font-black mb-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{app.date}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{app.time}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-purple-400 transition-all group-hover:translate-x-1" />
                </div>
              </div>
            ))}
            {!loading && appointments.length === 0 && (
              <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <CalendarHeart className="w-20 h-20 mx-auto text-slate-200 mb-6" />
                <p className="text-2xl font-black text-slate-400 italic">Your calendar is open.</p>
                <p className="text-slate-300 mt-2 font-medium">Ready to take the next step towards your goals?</p>
                <button onClick={() => setShowModal(true)} className="mt-8 bg-white border border-slate-200 text-slate-900 px-8 py-3 rounded-2xl font-black shadow-sm hover:shadow-md transition-all">Schedule First Session</button>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-xl shadow-2xl relative animate-slide-up overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full" />
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CalendarHeart className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Book Consultation</h2>
                <p className="text-slate-500 font-medium">Connect with your favorite lifestyle experts.</p>
              </div>

              <form onSubmit={handleBookAppt} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Expert Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Dr. Emily Chen"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all font-bold"
                      value={newAppt.provider}
                      onChange={e => setNewAppt({...newAppt, provider: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Specialty</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm"
                    value={newAppt.type}
                    onChange={e => setNewAppt({...newAppt, type: e.target.value})}
                  >
                    <option>General Physician</option>
                    <option>Nutritionist</option>
                    <option>Fitness Trainer</option>
                    <option>Therapist</option>
                    <option>Cardiologist</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all font-bold"
                      value={newAppt.date}
                      onChange={e => setNewAppt({...newAppt, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                    <input 
                      type="time" 
                      required
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all font-bold"
                      value={newAppt.time}
                      onChange={e => setNewAppt({...newAppt, time: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Mode</label>
                  <div className="flex gap-4">
                    {['Video Call', 'In-person'].map(mode => (
                      <label key={mode} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all font-bold ${newAppt.mode === mode ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}>
                        <input 
                          type="radio" 
                          name="mode" 
                          value={mode}
                          checked={newAppt.mode === mode}
                          onChange={e => setNewAppt({...newAppt, mode: e.target.value})}
                          className="hidden"
                        />
                        {mode === 'Video Call' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        {mode}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-8 py-5 rounded-3xl font-black text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-widest text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-purple-600 hover:bg-purple-700 text-white px-8 py-5 rounded-3xl font-black shadow-xl shadow-purple-500/20 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm"
                  >
                    Confirm Booking
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

import { useState, useEffect } from 'react';
import { Apple, Plus, PieChart, Info, X, Utensils, Zap } from 'lucide-react';
import Confetti from 'react-confetti';
import { useAuth } from '../context/AuthContext';
import axiosConfig from '../api/axiosConfig';
import dietBg from '../assets/backgrounds/diet_bg.png';

const COMMON_FOODS = {
  'Apple': { cal: 95, protein: 0.5 },
  'Banana': { cal: 105, protein: 1.3 },
  'Egg': { cal: 70, protein: 6 },
  'Chicken Breast': { cal: 165, protein: 31 },
  'Rice': { cal: 205, protein: 4.3 },
  'Avocado Toast': { cal: 250, protein: 8 },
  'Salmon': { cal: 208, protein: 20 },
  'Milk': { cal: 149, protein: 8 },
  'Yogurt': { cal: 100, protein: 17 },
  'Oatmeal': { cal: 150, protein: 5 },
  'Protein Shake': { cal: 120, protein: 24 },
  'Almonds': { cal: 160, protein: 6 },
  'Salad': { cal: 150, protein: 3 }
};

export default function Diet() {
  const [meals, setMeals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMeal, setNewMeal] = useState({ type: 'Breakfast', food: '', cal: '', protein: '' });
  const [isManualMacros, setIsManualMacros] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isManualMacros && newMeal.food) {
      const foodKey = Object.keys(COMMON_FOODS).find(
        key => key.toLowerCase() === newMeal.food.toLowerCase()
      );
      if (foodKey) {
        setNewMeal(prev => ({ 
          ...prev, 
          cal: COMMON_FOODS[foodKey].cal.toString(),
          protein: COMMON_FOODS[foodKey].protein.toString()
        }));
      }
    }
  }, [newMeal.food, isManualMacros]);

  useEffect(() => {
    const fetchDiets = async () => {
      if (!currentUser?.user?.id) return;
      try {
        const res = await axiosConfig.get(`/diets/user/${currentUser.user.id}?today=true`);
        const formattedMeals = res.data.map(m => ({
          id: m._id,
          type: m.mealType || 'Snacks',
          food: m.foodItem,
          cal: m.calories,
          protein: m.protein,
          carbs: m.carbs,
          fat: m.fat
        }));
        setMeals(formattedMeals);
      } catch (err) {
        console.error("Failed to fetch diets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiets();
  }, [currentUser]);

  const GOALS = { cal: 2000, protein: 120, carbs: 200, fat: 65 };

  const totals = meals.reduce(
    (acc, meal) => {
      acc.cal += meal.cal || 0;
      acc.protein += meal.protein || 0;
      acc.carbs += meal.carbs || 0;
      acc.fat += meal.fat || 0;
      return acc;
    },
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  useEffect(() => {
    if ((totals.protein >= GOALS.protein || totals.cal >= GOALS.cal) && meals.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [totals.protein, totals.cal, meals.length]);

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!newMeal.food || !newMeal.cal || !currentUser?.user?.id) return;

    const calNum = Number(newMeal.cal);
    const proteinNum = Number(newMeal.protein) || 0;
    
    const remainingCal = Math.max(0, calNum - (proteinNum * 4));
    const estimatedCarbs = Math.round((remainingCal * 0.5) / 4);
    const estimatedFat = Math.round((remainingCal * 0.5) / 9);

    const mealData = {
      user: currentUser.user.id,
      mealType: newMeal.type,
      foodItem: newMeal.food,
      calories: calNum,
      protein: proteinNum,
      carbs: estimatedCarbs,
      fat: estimatedFat
    };

    try {
      const res = await axiosConfig.post('/diets', mealData);
      setMeals([
        { 
          ...newMeal, 
          id: res.data._id, 
          cal: calNum, 
          protein: proteinNum,
          carbs: estimatedCarbs,
          fat: estimatedFat
        },
        ...meals
      ]);
      setShowModal(false);
      setNewMeal({ type: 'Breakfast', food: '', cal: '', protein: '' });
    } catch (err) {
      console.error("Failed to save meal", err);
    }
  };

  return (
    <>
      <div 
        className="bg-hero-pattern animate-fade-in opacity-85"
        style={{ backgroundImage: `url(${dietBg})` }}
      />
      <div className="overlay-gradient bg-white/10" />
      
      {/* Visual Organic Decorations */}
      <div className="fixed top-1/4 left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[130px] rounded-full animate-float" />
      <div className="fixed bottom-0 right-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '-4s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden hidden lg:block text-emerald-200/20">
         <Apple className="absolute top-[10%] left-[15%] w-16 h-16 animate-float" style={{ animationDelay: '1s' }} />
         <Utensils className="absolute bottom-[20%] right-[10%] w-20 h-20 animate-float" style={{ animationDelay: '2.5s' }} />
         <Zap className="absolute top-[40%] right-[5%] w-12 h-12 animate-float" style={{ animationDelay: '0.8s' }} />
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 relative animate-slide-up">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} gravity={0.15} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100, pointerEvents: 'none' }} />}
        
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
               <div className="p-3 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/30">
                 <Apple className="text-white w-8 h-8" />
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                 Diet & <span className="text-emerald-600">Nutrition</span>
               </h1>
            </div>
            <p className="text-lg text-slate-500 font-medium">Fueled by precision. Tracked for progress.</p>
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setIsManualMacros(false);
            }}
            className="group relative bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-emerald-500/40 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            <span>Log New Meal</span>
            <div className="absolute inset-0 rounded-[2rem] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="glass-card p-10 bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-emerald-500/20">
            <div className="flex items-center gap-3 mb-10 border-b border-white/20 pb-6">
               <PieChart className="w-8 h-8 text-white/80" />
               <h3 className="text-2xl font-black tracking-tight">Daily Intake</h3>
            </div>
            <div className="space-y-8">
               <MacroProgress label="Calories" current={totals.cal} goal={GOALS.cal} unit="kcal" color="bg-white" />
               <MacroProgress label="Protein" current={totals.protein} goal={GOALS.protein} unit="g" color="bg-white" />
               <MacroProgress label="Carbs" current={totals.carbs} goal={GOALS.carbs} unit="g" color="bg-white" />
               <MacroProgress label="Fat" current={totals.fat} goal={GOALS.fat} unit="g" color="bg-white" />
            </div>
          </div>

          <div className="lg:col-span-2 glass-card p-10">
            <h3 className="text-2xl font-black text-slate-900 mb-10 border-b border-slate-100 pb-6 flex items-center gap-3">
              <Utensils className="w-6 h-6 text-emerald-500" />
              Today's Journal
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-[2rem]"></div>)}
                </div>
              ) : meals.length > 0 ? (
                meals.map(meal => (
                  <div key={meal.id} className="flex justify-between items-center p-6 bg-slate-50/50 hover:bg-white rounded-[2rem] border border-slate-100 hover:border-emerald-200 transition-all duration-300 group hover:shadow-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{meal.food}</h4>
                        <span className="inline-block px-3 py-1 mt-2 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">{meal.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900 leading-none mb-1">{meal.cal} <span className="text-[10px] text-slate-400">kcal</span></p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{meal.protein}g Protein</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <Apple className="w-16 h-16 mx-auto text-slate-200 mb-6" />
                  <p className="text-xl font-bold text-slate-400 italic">No meals logged for today.</p>
                  <p className="text-sm text-slate-300 mt-2">Start tracking to see your progress!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-xl shadow-2xl relative animate-slide-up overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full" />
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <Apple className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Log Meal</h2>
                </div>
                <p className="text-slate-500 font-medium">Keep your journey on track with accurate logging.</p>
              </div>

              <form onSubmit={handleAddMeal} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Meal Time</label>
                    <select
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                      value={newMeal.type}
                      onChange={e => setNewMeal({ ...newMeal, type: e.target.value })}
                    >
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Snacks</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Food Item</label>
                    <input
                      type="text"
                      required
                      placeholder="What did you eat?"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold"
                      value={newMeal.food}
                      onChange={e => setNewMeal({ ...newMeal, food: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Energy (kcal)</label>
                      {newMeal.food && !isManualMacros && Object.keys(COMMON_FOODS).some(k => k.toLowerCase() === newMeal.food.toLowerCase()) && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-black animate-pulse">AUTO-FILL</span>
                      )}
                    </div>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="kcal"
                      className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none font-bold ${!isManualMacros && newMeal.cal ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 focus:ring-emerald-500 focus:bg-white'}`}
                      value={newMeal.cal}
                      onChange={e => {
                        setNewMeal({ ...newMeal, cal: e.target.value });
                        setIsManualMacros(true);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Protein (g)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="grams"
                      className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none font-bold ${!isManualMacros && newMeal.protein ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 focus:ring-emerald-500 focus:bg-white'}`}
                      value={newMeal.protein}
                      onChange={e => {
                        setNewMeal({ ...newMeal, protein: e.target.value });
                        setIsManualMacros(true);
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-8 py-5 rounded-3xl font-black text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-widest text-sm"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-5 rounded-3xl font-black shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm"
                  >
                    Confirm Meal
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

function MacroProgress({ label, current, goal, unit, color }) {
  const percentage = Math.min(100, (current / goal) * 100);
  return (
    <div>
      <div className="flex justify-between items-end mb-3">
        <span className="text-sm font-black uppercase tracking-widest opacity-80">{label}</span>
        <span className="text-xs font-bold">{current} / {goal} {unit}</span>
      </div>
      <div className="w-full bg-black/10 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className={`${color} h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

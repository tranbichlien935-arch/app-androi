import { useState } from 'react';
import { Droplets, Plus, Minus, Target, TrendingUp } from 'lucide-react';

export function WaterIntake() {
  const [waterIntake, setWaterIntake] = useState(1600);
  const dailyGoal = 2000;
  const glassSize = 200;

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, dailyGoal + 1000));
  };

  const removeWater = (amount: number) => {
    setWaterIntake(prev => Math.max(prev - amount, 0));
  };

  const percentage = Math.min((waterIntake / dailyGoal) * 100, 100);
  const glassCount = Math.floor(waterIntake / glassSize);
  const totalGlasses = Math.ceil(dailyGoal / glassSize);

  const weeklyData = [
    { day: 'T2', amount: 1800 },
    { day: 'T3', amount: 2200 },
    { day: 'T4', amount: 1600 },
    { day: 'T5', amount: 2000 },
    { day: 'T6', amount: 2400 },
    { day: 'T7', amount: 1900 },
    { day: 'CN', amount: 1600 },
  ];

  const reminders = [
    { time: '08:00', label: 'Sau khi thức dậy' },
    { time: '10:00', label: 'Giữa buổi sáng' },
    { time: '12:00', label: 'Trước bữa trưa' },
    { time: '15:00', label: 'Giữa buổi chiều' },
    { time: '18:00', label: 'Trước bữa tối' },
    { time: '20:00', label: 'Trước khi ngủ' },
  ];

  return (
    <div className="space-y-6">
      {/* Main Water Tracker */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Droplets className="w-6 h-6" />
          <h2>Lượng nước hôm nay</h2>
        </div>

        {/* Water Glass Visualization */}
        <div className="relative mx-auto mb-6" style={{ width: '200px', height: '280px' }}>
          {/* Glass Container */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-b-full border-4 border-white/40" 
               style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
            {/* Water Level */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/60 to-white/40 rounded-b-full transition-all duration-500"
              style={{ 
                height: `${percentage}%`,
                borderBottomLeftRadius: '100px',
                borderBottomRightRadius: '100px'
              }}
            >
              {/* Water Waves */}
              <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
                <div className="absolute w-full h-full bg-white/30 animate-wave" 
                     style={{
                       borderRadius: '45%',
                       animation: 'wave 3s linear infinite'
                     }}
                />
              </div>
            </div>
          </div>

          {/* Water Amount Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl drop-shadow-lg">{waterIntake}</p>
            <p className="text-sm opacity-90">ml / {dailyGoal} ml</p>
            <p className="text-2xl mt-2">{Math.round(percentage)}%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => addWater(100)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 py-3 rounded-xl transition-all active:scale-95"
          >
            <p className="text-sm">+100ml</p>
          </button>
          <button
            onClick={() => addWater(200)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 py-3 rounded-xl transition-all active:scale-95"
          >
            <p className="text-sm">+200ml</p>
          </button>
          <button
            onClick={() => addWater(300)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 py-3 rounded-xl transition-all active:scale-95"
          >
            <p className="text-sm">+300ml</p>
          </button>
          <button
            onClick={() => removeWater(100)}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 py-3 rounded-xl transition-all active:scale-95"
          >
            <p className="text-sm">-100ml</p>
          </button>
        </div>
      </div>

      {/* Glass Counter */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">Ly nước đã uống</h3>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          {Array.from({ length: totalGlasses }).map((_, index) => (
            <div
              key={index}
              className={`w-10 h-12 rounded-lg transition-all ${
                index < glassCount
                  ? 'bg-gradient-to-b from-blue-400 to-blue-600 shadow-md'
                  : 'bg-gray-200'
              }`}
            >
              <div className={`h-full flex items-center justify-center ${
                index < glassCount ? 'text-white' : 'text-gray-400'
              }`}>
                <Droplets className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {glassCount} / {totalGlasses} ly ({glassSize}ml/ly)
        </p>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">Tiến trình tuần</h3>
        </div>
        <div className="space-y-3">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{day.day}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((day.amount / dailyGoal) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-16 text-right">{day.amount}ml</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hydration Goal */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">Mục tiêu hàng ngày</h3>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => removeWater(200)}
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-all active:scale-95"
          >
            <Minus className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <p className="text-3xl text-blue-600">{dailyGoal}</p>
            <p className="text-sm text-gray-600">ml mỗi ngày</p>
          </div>
          <button
            onClick={() => addWater(200)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-md p-3 rounded-xl transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Reminders */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-gray-900 mb-4">Nhắc nhở uống nước</h3>
        <div className="space-y-2">
          {reminders.map((reminder, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-lg">
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{reminder.label}</p>
                  <p className="text-xs text-gray-500">{reminder.time}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={index < 4} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: translateX(-100%) translateY(0); }
          100% { transform: translateX(100%) translateY(0); }
        }
        .animate-wave {
          animation: wave 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

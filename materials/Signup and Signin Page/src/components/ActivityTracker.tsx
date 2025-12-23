import { useState } from 'react';
import { Footprints, Flame, TrendingUp, Calendar, Plus, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ActivityTracker() {
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  const weeklyStepsData = [
    { day: 'T2', steps: 8234, calories: 320 },
    { day: 'T3', steps: 10542, calories: 420 },
    { day: 'T4', steps: 7890, calories: 310 },
    { day: 'T5', steps: 12340, calories: 490 },
    { day: 'T6', steps: 9876, calories: 390 },
    { day: 'T7', steps: 11234, calories: 445 },
    { day: 'CN', steps: 6543, calories: 260 },
  ];

  const activities = [
    { id: 1, name: 'Đi bộ buổi sáng', duration: 30, calories: 120, time: '07:00', type: 'walking' },
    { id: 2, name: 'Chạy bộ', duration: 45, calories: 350, time: '18:30', type: 'running' },
    { id: 3, name: 'Yoga', duration: 20, calories: 80, time: '20:00', type: 'yoga' },
  ];

  const quickActivities = [
    { name: 'Đi bộ', icon: '🚶', color: 'from-green-400 to-green-600' },
    { name: 'Chạy bộ', icon: '🏃', color: 'from-orange-400 to-orange-600' },
    { name: 'Đạp xe', icon: '🚴', color: 'from-blue-400 to-blue-600' },
    { name: 'Bơi lội', icon: '🏊', color: 'from-cyan-400 to-cyan-600' },
    { name: 'Yoga', icon: '🧘', color: 'from-purple-400 to-purple-600' },
    { name: 'Gym', icon: '💪', color: 'from-red-400 to-red-600' },
  ];

  const todayTotal = {
    steps: 8234,
    distance: 6.2,
    calories: 320,
    activeMinutes: 95,
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6" />
          <h2>Hoạt động hôm nay</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <Footprints className="w-5 h-5 mb-2 opacity-90" />
            <p className="text-2xl">{todayTotal.steps.toLocaleString()}</p>
            <p className="text-sm opacity-90">bước</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <Flame className="w-5 h-5 mb-2 opacity-90" />
            <p className="text-2xl">{todayTotal.calories}</p>
            <p className="text-sm opacity-90">kcal</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <TrendingUp className="w-5 h-5 mb-2 opacity-90" />
            <p className="text-2xl">{todayTotal.distance}</p>
            <p className="text-sm opacity-90">km</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <Clock className="w-5 h-5 mb-2 opacity-90" />
            <p className="text-2xl">{todayTotal.activeMinutes}</p>
            <p className="text-sm opacity-90">phút</p>
          </div>
        </div>
      </div>

      {/* Quick Add Activities */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-gray-900 mb-4">Thêm hoạt động nhanh</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickActivities.map((activity, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedActivity(activity.name);
                setShowAddActivity(true);
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br hover:shadow-md transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
            >
              <div className={`bg-gradient-to-br ${activity.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                {activity.icon}
              </div>
              <span className="text-xs text-gray-700">{activity.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Biểu đồ tuần</h3>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyStepsData}>
            <defs>
              <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Bar dataKey="steps" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Hoạt động gần đây</h3>
          <button 
            onClick={() => setShowAddActivity(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-xl hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-xl">
                {activity.type === 'walking' && <Footprints className="w-5 h-5 text-white" />}
                {activity.type === 'running' && '🏃'}
                {activity.type === 'yoga' && '🧘'}
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{activity.name}</p>
                <p className="text-xs text-gray-500">{activity.time} • {activity.duration} phút</p>
              </div>
              <div className="text-right">
                <p className="text-orange-600">{activity.calories}</p>
                <p className="text-xs text-gray-500">kcal</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Thêm hoạt động</h3>
              <button 
                onClick={() => setShowAddActivity(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Loại hoạt động</label>
                <input 
                  type="text" 
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Nhập loại hoạt động"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Thời gian (phút)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Calo đốt (kcal)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="120"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl hover:shadow-lg transition-all active:scale-95">
                Lưu hoạt động
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

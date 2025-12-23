import { useState } from 'react';
import { Moon, Sun, Clock, TrendingUp, Calendar, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SleepTracker() {
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');

  const weeklyData = [
    { day: 'T2', hours: 7.5, quality: 85 },
    { day: 'T3', hours: 6.5, quality: 70 },
    { day: 'T4', hours: 8.0, quality: 90 },
    { day: 'T5', hours: 7.0, quality: 80 },
    { day: 'T6', hours: 7.5, quality: 85 },
    { day: 'T7', hours: 8.5, quality: 95 },
    { day: 'CN', hours: 9.0, quality: 92 },
  ];

  const todayStats = {
    hours: 7.5,
    quality: 85,
    deepSleep: 2.5,
    lightSleep: 4.0,
    rem: 1.0,
  };

  const sleepPhases = [
    { name: 'Ngủ sâu', hours: todayStats.deepSleep, color: 'from-indigo-600 to-indigo-700', percentage: (todayStats.deepSleep / todayStats.hours) * 100 },
    { name: 'Ngủ nông', hours: todayStats.lightSleep, color: 'from-blue-400 to-blue-500', percentage: (todayStats.lightSleep / todayStats.hours) * 100 },
    { name: 'REM', hours: todayStats.rem, color: 'from-purple-400 to-purple-500', percentage: (todayStats.rem / todayStats.hours) * 100 },
  ];

  const sleepTips = [
    { icon: '🌙', title: 'Tắt điện thoại', desc: 'Trước khi ngủ 30 phút' },
    { icon: '☕', title: 'Tránh caffeine', desc: 'Sau 2 giờ chiều' },
    { icon: '🧘', title: 'Thư giãn', desc: 'Thiền hoặc đọc sách' },
    { icon: '🌡️', title: 'Nhiệt độ phù hợp', desc: '18-22°C là lý tưởng' },
  ];

  return (
    <div className="space-y-6">
      {/* Sleep Summary Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Moon className="w-6 h-6" />
          <h2>Giấc ngủ đêm qua</h2>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/30 p-3 rounded-xl">
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Tổng thời gian</p>
                <p className="text-3xl">{todayStats.hours}h</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Chất lượng</p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl">{todayStats.quality}</p>
                <p className="text-sm">/100</p>
              </div>
            </div>
          </div>

          {/* Quality Bar */}
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all"
              style={{ width: `${todayStats.quality}%` }}
            />
          </div>
        </div>

        {/* Sleep/Wake Times */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <Moon className="w-5 h-5 mb-2 opacity-90" />
            <p className="text-sm opacity-90">Giờ đi ngủ</p>
            <p className="text-2xl">{bedTime}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <Sun className="w-5 h-5 mb-2 opacity-90" />
            <p className="text-sm opacity-90">Giờ thức dậy</p>
            <p className="text-2xl">{wakeTime}</p>
          </div>
        </div>
      </div>

      {/* Sleep Phases */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-gray-900 mb-4">Giai đoạn giấc ngủ</h3>
        
        {/* Visual Timeline */}
        <div className="mb-4">
          <div className="flex h-12 rounded-xl overflow-hidden">
            {sleepPhases.map((phase, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r ${phase.color} flex items-center justify-center text-white text-xs`}
                style={{ width: `${phase.percentage}%` }}
              >
                {phase.hours}h
              </div>
            ))}
          </div>
        </div>

        {/* Phase Details */}
        <div className="space-y-3">
          {sleepPhases.map((phase, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${phase.color}`} />
                <span className="text-sm text-gray-700">{phase.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900">{phase.hours}h</span>
                <span className="text-xs text-gray-500">({Math.round(phase.percentage)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h3 className="text-gray-900">Lịch sử tuần</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
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
            <Area 
              type="monotone" 
              dataKey="hours" 
              stroke="#6366f1" 
              strokeWidth={2}
              fill="url(#colorSleep)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Sleep Schedule */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Lịch ngủ của bạn</h3>
          <button className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-2 rounded-xl hover:shadow-md transition-all active:scale-95">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Giờ đi ngủ mục tiêu</label>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-600" />
              <input
                type="time"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
                className="flex-1 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Giờ thức dậy mục tiêu</label>
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-orange-500" />
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="flex-1 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-sm text-gray-700">
              <span className="text-indigo-600">💡 Gợi ý:</span> Với lịch trình này, bạn sẽ ngủ được{' '}
              <span className="text-indigo-600">8 giờ</span> mỗi đêm.
            </p>
          </div>
        </div>
      </div>

      {/* Sleep Tips */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-gray-900 mb-4">Mẹo ngủ ngon</h3>
        <div className="grid grid-cols-2 gap-3">
          {sleepTips.map((tip, index) => (
            <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
              <div className="text-3xl mb-2">{tip.icon}</div>
              <p className="text-sm text-gray-900 mb-1">{tip.title}</p>
              <p className="text-xs text-gray-600">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Average */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h3 className="text-gray-900">Trung bình tuần này</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-indigo-50 rounded-xl">
            <p className="text-3xl text-indigo-600">7.7h</p>
            <p className="text-sm text-gray-600 mt-1">Giờ ngủ/đêm</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-3xl text-purple-600">85%</p>
            <p className="text-sm text-gray-600 mt-1">Chất lượng</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { TrendingUp, Flame, Footprints, Droplets, Moon, Award, ChevronRight } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Mock data
  const weeklyData = [
    { day: 'T2', steps: 8234, calories: 320 },
    { day: 'T3', steps: 10542, calories: 420 },
    { day: 'T4', steps: 7890, calories: 310 },
    { day: 'T5', steps: 12340, calories: 490 },
    { day: 'T6', steps: 9876, calories: 390 },
    { day: 'T7', steps: 11234, calories: 445 },
    { day: 'CN', steps: 6543, calories: 260 },
  ];

  const todayStats = {
    steps: 8234,
    stepsGoal: 10000,
    calories: 320,
    caloriesGoal: 500,
    water: 1600,
    waterGoal: 2000,
    sleep: 7.5,
    sleepGoal: 8,
    weight: 68.5,
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-green-500 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="opacity-90">Xin chào, Nguyễn Văn A</p>
            <h2 className="mt-1">Hôm nay bạn thế nào?</h2>
          </div>
          <Award className="w-12 h-12 opacity-90" />
        </div>
        <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-sm opacity-90">Mục tiêu hôm nay</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-white/30 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${calculateProgress(todayStats.steps, todayStats.stepsGoal)}%` }}
              />
            </div>
            <span className="text-sm">{Math.round(calculateProgress(todayStats.steps, todayStats.stepsGoal))}%</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Steps Card */}
        <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-orange-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-xl">
              <Footprints className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-600">Bước chân</span>
          </div>
          <p className="text-orange-600">{todayStats.steps.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Mục tiêu: {todayStats.stepsGoal.toLocaleString()}</p>
          <div className="mt-2 bg-orange-100 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-full h-1.5 transition-all"
              style={{ width: `${calculateProgress(todayStats.steps, todayStats.stepsGoal)}%` }}
            />
          </div>
        </div>

        {/* Calories Card */}
        <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-red-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gradient-to-br from-red-400 to-red-600 p-2 rounded-xl">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-600">Calo đốt</span>
          </div>
          <p className="text-red-600">{todayStats.calories} kcal</p>
          <p className="text-xs text-gray-500 mt-1">Mục tiêu: {todayStats.caloriesGoal} kcal</p>
          <div className="mt-2 bg-red-100 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-red-400 to-red-600 rounded-full h-1.5 transition-all"
              style={{ width: `${calculateProgress(todayStats.calories, todayStats.caloriesGoal)}%` }}
            />
          </div>
        </div>

        {/* Water Card */}
        <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-xl">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-600">Nước uống</span>
          </div>
          <p className="text-blue-600">{todayStats.water} ml</p>
          <p className="text-xs text-gray-500 mt-1">Mục tiêu: {todayStats.waterGoal} ml</p>
          <div className="mt-2 bg-blue-100 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-full h-1.5 transition-all"
              style={{ width: `${calculateProgress(todayStats.water, todayStats.waterGoal)}%` }}
            />
          </div>
        </div>

        {/* Sleep Card */}
        <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-2 rounded-xl">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-600">Giấc ngủ</span>
          </div>
          <p className="text-indigo-600">{todayStats.sleep}h</p>
          <p className="text-xs text-gray-500 mt-1">Mục tiêu: {todayStats.sleepGoal}h</p>
          <div className="mt-2 bg-indigo-100 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full h-1.5 transition-all"
              style={{ width: `${calculateProgress(todayStats.sleep, todayStats.sleepGoal)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900">Hoạt động trong tuần</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                selectedPeriod === 'week'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                selectedPeriod === 'month'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Tháng
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
              dataKey="steps" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fill="url(#colorSteps)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Thành tích gần đây</h3>
          <button className="text-purple-600 text-sm flex items-center gap-1">
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Đạt 10,000 bước</p>
              <p className="text-xs text-gray-500">3 ngày liên tiếp</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-2 rounded-xl">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Hoàn thành mục tiêu nước</p>
              <p className="text-xs text-gray-500">Hôm nay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

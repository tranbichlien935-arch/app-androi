import { useState } from 'react';
import { Weight, TrendingDown, Target, Plus, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function WeightTracker() {
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  const weightHistory = [
    { date: '01/12', weight: 70.5 },
    { date: '05/12', weight: 70.2 },
    { date: '08/12', weight: 69.8 },
    { date: '12/12', weight: 69.5 },
    { date: '15/12', weight: 69.2 },
    { date: '18/12', weight: 68.9 },
    { date: '23/12', weight: 68.5 },
  ];

  const currentWeight = 68.5;
  const targetWeight = 65.0;
  const startWeight = 70.5;
  const progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;

  const stats = {
    bmi: 22.4,
    lost: startWeight - currentWeight,
    remaining: currentWeight - targetWeight,
    avgWeekly: 0.3,
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Thiếu cân', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Bình thường', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Thừa cân', color: 'text-orange-600' };
    return { label: 'Béo phì', color: 'text-red-600' };
  };

  const bmiCategory = getBMICategory(stats.bmi);

  const milestones = [
    { weight: 70, achieved: true, date: '01/12' },
    { weight: 69, achieved: true, date: '12/12' },
    { weight: 68, achieved: true, date: '23/12' },
    { weight: 67, achieved: false, date: null },
    { weight: 66, achieved: false, date: null },
    { weight: 65, achieved: false, date: null },
  ];

  return (
    <div className="space-y-6">
      {/* Current Weight Card */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Weight className="w-6 h-6" />
          <h2>Cân nặng hiện tại</h2>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4">
          <div className="text-center mb-4">
            <p className="text-6xl mb-2">{currentWeight}</p>
            <p className="text-xl opacity-90">kg</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-sm opacity-90">Bắt đầu</p>
              <p className="text-xl">{startWeight}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Đã giảm</p>
              <p className="text-xl">-{stats.lost.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Mục tiêu</p>
              <p className="text-xl">{targetWeight}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Tiến độ</span>
            <span className="text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="bg-white/30 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs opacity-90 mt-2">
            Còn {stats.remaining.toFixed(1)} kg nữa để đạt mục tiêu
          </p>
        </div>
      </div>

      {/* BMI Card */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-gray-900 mb-4">Chỉ số BMI</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-4xl text-green-600">{stats.bmi}</p>
            <p className={`text-sm mt-1 ${bmiCategory.color}`}>{bmiCategory.label}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Chiều cao</p>
            <p className="text-2xl text-gray-900">175 cm</p>
          </div>
        </div>
        
        {/* BMI Scale */}
        <div className="space-y-2">
          <div className="flex h-4 rounded-full overflow-hidden">
            <div className="bg-blue-400 flex-1" />
            <div className="bg-green-400 flex-1" />
            <div className="bg-orange-400 flex-1" />
            <div className="bg-red-400 flex-1" />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>&lt;18.5</span>
            <span>18.5-25</span>
            <span>25-30</span>
            <span>&gt;30</span>
          </div>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <h3 className="text-gray-900">Biểu đồ cân nặng</h3>
          </div>
          <button
            onClick={() => setShowAddWeight(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 rounded-xl hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weightHistory}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis 
              domain={[64, 72]} 
              stroke="#6b7280" 
              style={{ fontSize: '12px' }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-green-600" />
          <h3 className="text-gray-900">Thống kê</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Giảm trung bình/tuần</p>
            <p className="text-2xl text-green-600">-{stats.avgWeekly} kg</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Thời gian dự kiến</p>
            <p className="text-2xl text-blue-600">12 tuần</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Tổng đã giảm</p>
            <p className="text-2xl text-purple-600">-{stats.lost.toFixed(1)} kg</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Còn lại</p>
            <p className="text-2xl text-orange-600">-{stats.remaining.toFixed(1)} kg</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-green-600" />
          <h3 className="text-gray-900">Cột mốc quan trọng</h3>
        </div>
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-3 p-3 rounded-xl ${
                milestone.achieved 
                  ? 'bg-green-50 border-2 border-green-200' 
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                milestone.achieved 
                  ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {milestone.achieved ? '✓' : milestone.weight}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${milestone.achieved ? 'text-gray-900' : 'text-gray-600'}`}>
                  {milestone.weight} kg
                </p>
                {milestone.achieved && milestone.date && (
                  <p className="text-xs text-green-600">Đạt được: {milestone.date}</p>
                )}
              </div>
              {milestone.achieved && (
                <span className="text-2xl">🎉</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200">
        <h3 className="text-gray-900 mb-3">💡 Mẹo giảm cân hiệu quả</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Uống đủ 2 lít nước mỗi ngày</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Vận động ít nhất 30 phút/ngày</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Ăn nhiều rau xanh và trái cây</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Ngủ đủ 7-8 giờ mỗi đêm</span>
          </li>
        </ul>
      </div>

      {/* Add Weight Modal */}
      {showAddWeight && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Thêm cân nặng mới</h3>
              <button 
                onClick={() => setShowAddWeight(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Cân nặng (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="68.5"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Ngày đo</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:shadow-lg transition-all active:scale-95">
                Lưu cân nặng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

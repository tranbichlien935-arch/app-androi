import { useState } from 'react';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Edit } from 'lucide-react';

export function Profile() {
  const [editMode, setEditMode] = useState(false);

  const userInfo = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    age: 28,
    height: 175,
    gender: 'Nam',
    joinDate: '01/11/2024',
  };

  const achievements = [
    { icon: '🏆', title: 'Người kiên trì', desc: 'Đạt mục tiêu 30 ngày liên tiếp' },
    { icon: '⭐', title: 'Ngôi sao giảm cân', desc: 'Giảm được 5kg' },
    { icon: '💧', title: 'Chuyên gia hydrat', desc: 'Uống đủ nước 7 ngày' },
    { icon: '🌙', title: 'Bậc thầy giấc ngủ', desc: 'Ngủ đủ giấc 14 ngày' },
  ];

  const menuItems = [
    { icon: Settings, label: 'Cài đặt', color: 'text-gray-600', bg: 'bg-gray-100' },
    { icon: Bell, label: 'Thông báo', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: Shield, label: 'Quyền riêng tư', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: HelpCircle, label: 'Trợ giúp', color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <User className="w-12 h-12" />
            </div>
            <div>
              <h2 className="mb-1">{userInfo.name}</h2>
              <p className="text-sm opacity-90">{userInfo.email}</p>
            </div>
          </div>
          <button 
            onClick={() => setEditMode(!editMode)}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-xl hover:bg-white/30 transition-all"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm opacity-90 mb-3">Thông tin cá nhân</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl">{userInfo.age}</p>
              <p className="text-xs opacity-90">Tuổi</p>
            </div>
            <div>
              <p className="text-2xl">{userInfo.height}</p>
              <p className="text-xs opacity-90">cm</p>
            </div>
            <div>
              <p className="text-2xl">{userInfo.gender}</p>
              <p className="text-xs opacity-90">Giới tính</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <p className="text-3xl text-orange-600">52</p>
          <p className="text-xs text-gray-600 mt-1">Ngày liên tiếp</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <p className="text-3xl text-purple-600">8</p>
          <p className="text-xs text-gray-600 mt-1">Thành tích</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-md text-center">
          <p className="text-3xl text-green-600">2.5</p>
          <p className="text-xs text-gray-600 mt-1">kg giảm</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-gray-900 mb-4">Thành tích đạt được</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="text-sm text-gray-900 mb-1">{achievement.title}</p>
              <p className="text-xs text-gray-600">{achievement.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-gray-900 mb-4">Tổng quan tháng này</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-xl">
                <span className="text-white">🏃</span>
              </div>
              <div>
                <p className="text-sm text-gray-900">Tổng bước chân</p>
                <p className="text-xs text-gray-500">Trung bình/ngày</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-900">245,680</p>
              <p className="text-xs text-gray-500">8,189 bước</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-400 to-red-600 p-2 rounded-xl">
                <span className="text-white">🔥</span>
              </div>
              <div>
                <p className="text-sm text-gray-900">Tổng calo đốt</p>
                <p className="text-xs text-gray-500">Trung bình/ngày</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-900">9,840 kcal</p>
              <p className="text-xs text-gray-500">328 kcal</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-xl">
                <span className="text-white">💧</span>
              </div>
              <div>
                <p className="text-sm text-gray-900">Tổng nước uống</p>
                <p className="text-xs text-gray-500">Trung bình/ngày</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-900">58 lít</p>
              <p className="text-xs text-gray-500">1,933 ml</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-2 rounded-xl">
                <span className="text-white">🌙</span>
              </div>
              <div>
                <p className="text-sm text-gray-900">Tổng giờ ngủ</p>
                <p className="text-xs text-gray-500">Trung bình/đêm</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-900">225 giờ</p>
              <p className="text-xs text-gray-500">7.5 giờ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <h3 className="text-gray-900 mb-4">Cài đặt</h3>
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`${item.bg} p-2 rounded-lg`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-gray-900">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">Phiên bản ứng dụng</p>
          <p className="text-sm text-gray-900">1.0.0</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Ngày tham gia</p>
          <p className="text-sm text-gray-900">{userInfo.joinDate}</p>
        </div>
      </div>

      {/* Logout Button */}
      <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-2xl hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
}

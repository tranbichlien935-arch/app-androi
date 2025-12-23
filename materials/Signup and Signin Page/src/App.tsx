import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ActivityTracker } from './components/ActivityTracker';
import { WaterIntake } from './components/WaterIntake';
import { SleepTracker } from './components/SleepTracker';
import { WeightTracker } from './components/WeightTracker';
import { Profile } from './components/Profile';
import { Home, Activity, Droplets, Moon, Weight, User } from 'lucide-react';

type TabType = 'home' | 'activity' | 'water' | 'sleep' | 'weight' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'activity':
        return <ActivityTracker />;
      case 'water':
        return <WaterIntake />;
      case 'sleep':
        return <SleepTracker />;
      case 'weight':
        return <WeightTracker />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-center bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
            HealthTracker
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto px-2 py-2">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Trang chủ</span>
            </button>
            
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'activity'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-xs">Hoạt động</span>
            </button>

            <button
              onClick={() => setActiveTab('water')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'water'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Droplets className="w-5 h-5" />
              <span className="text-xs">Nước</span>
            </button>

            <button
              onClick={() => setActiveTab('sleep')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'sleep'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span className="text-xs">Giấc ngủ</span>
            </button>

            <button
              onClick={() => setActiveTab('weight')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'weight'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Weight className="w-5 h-5" />
              <span className="text-xs">Cân nặng</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Cá nhân</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

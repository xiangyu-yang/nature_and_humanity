import { NavLink } from 'react-router-dom';
import {
  Home, User, BookOpen, Sparkles, Stethoscope, FileText,
  Heart, Compass, Apple, Activity, Users, Settings,
} from 'lucide-react';

const items = [
  { path: '/', label: '首页', icon: Home },
  { path: '/birth', label: '生辰', icon: User },
  { path: '/bazi', label: '八字', icon: BookOpen },
  { path: '/ziwei', label: '紫微', icon: Sparkles },
  { path: '/constitution', label: '体质', icon: Stethoscope },
  { path: '/report', label: '报告', icon: FileText },
  { path: '/wellness', label: '养生', icon: Heart },
  { path: '/fortune', label: '运势', icon: Compass },
  { path: '/food', label: '食疗', icon: Apple },
  { path: '/acupoint', label: '穴位', icon: Activity },
  { path: '/family', label: '家庭', icon: Users },
  { path: '/profile', label: '我的', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 lg:w-64 shrink-0 h-screen sticky top-0 border-r border-ink-100/60 bg-gradient-to-b from-ink-50/95 via-ink-50/85 to-ink-50/95 backdrop-blur-md">
      <div className="px-6 py-7 border-b border-ink-100/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 grid place-items-center shadow-ink">
            <span className="text-ink-50 font-display text-xl">五</span>
          </div>
          <div>
            <h1 className="font-display text-xl text-ink-600 leading-none">五行中医</h1>
            <p className="text-[11px] text-ink-400 tracking-widest mt-1">天 · 人 · 合 · 一</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {items.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-ink-50 shadow-ink'
                      : 'text-ink-500 hover:bg-amber-100/40 hover:text-teal-600'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 py-4 border-t border-ink-100/40 text-[11px] text-ink-400">
        <p className="leading-relaxed">
          传承中医智慧<br />
          探索生命密码
        </p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-ink-100/50">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {items.slice(0, 5).map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1.5 rounded-lg text-[10px] ${
                isActive ? 'text-teal-600' : 'text-ink-400'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

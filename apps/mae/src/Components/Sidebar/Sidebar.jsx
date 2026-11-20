import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Users, 
  BookOpen, 
  Library, 
  HelpCircle, 
  User 
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Início', path: '/painel', icon: Home },
    { name: 'Comunidade', path: '/comunidade', icon: Users },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Biblioteca', path: '/biblioteca', icon: Library },
    { name: 'Ajuda', path: '/ajuda', icon: HelpCircle },
    { name: 'Perfil', path: '/perfil', icon: User },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-100 shadow-sm p-8 hidden md:flex flex-col justify-between flex-shrink-0">
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3">
            Menu Principal
          </span>
        </div>
        
        <nav className="space-y-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center space-x-4 px-4 py-3.5 rounded-2xl font-medium text-base transition-all duration-200 group ${
                  isActive 
                    ? 'bg-pink-50 text-pink-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-pink-600 rounded-r-full" />
                )}
                <Icon className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-pink-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="pt-6 border-t border-gray-100 px-3">
        <p className="text-sm text-gray-400 font-medium">Florável v1.0</p>
      </div>
    </aside>
  );
}
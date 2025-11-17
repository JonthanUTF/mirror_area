import { Link } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Areas', path: '/areas', icon: '⚡' },
    { name: 'Services', path: '/services', icon: '🔌' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <aside className="bg-white shadow-md w-64 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600">AREA</h2>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

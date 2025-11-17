import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          AREA
        </Link>
        <div className="flex space-x-6">
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/areas" className="hover:text-blue-600">
            Areas
          </Link>
          <Link to="/services" className="hover:text-blue-600">
            Services
          </Link>
          <Link to="/profile" className="hover:text-blue-600">
            Profile
          </Link>
        </div>
        <div className="text-gray-700">
          {user?.username}
        </div>
      </nav>
    </header>
  );
}

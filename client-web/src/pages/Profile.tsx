import Header from '../components/layout/Header';
import { useAuthStore } from '../store/auth.store';

export default function Profile() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Username</label>
              <p className="text-lg">{user?.username}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <button
              onClick={() => logout()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

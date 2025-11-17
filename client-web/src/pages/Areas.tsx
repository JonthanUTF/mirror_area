import Header from '../components/layout/Header';
import AreaList from '../components/areas/AreaList';

export default function Areas() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Areas</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Create New Area
          </button>
        </div>
        <AreaList />
      </main>
    </div>
  );
}

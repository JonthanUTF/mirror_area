import Header from '../components/layout/Header';
import ServiceList from '../components/services/ServiceList';

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Available Services</h1>
        <ServiceList />
      </main>
    </div>
  );
}

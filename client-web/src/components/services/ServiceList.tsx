export default function ServiceList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {['GitHub', 'Gmail', 'Discord', 'Google Drive'].map((service) => (
        <div key={service} className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold mb-2">{service}</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Connect
          </button>
        </div>
      ))}
    </div>
  );
}

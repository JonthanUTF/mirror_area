interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
  onConnect?: (id: string) => void;
  onDisconnect?: (id: string) => void;
}

export default function ServiceCard({ 
  id, 
  name, 
  description, 
  icon, 
  isConnected, 
  onConnect, 
  onDisconnect 
}: ServiceCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        {isConnected ? (
          <button
            onClick={() => onDisconnect?.(id)}
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => onConnect?.(id)}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

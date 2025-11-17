interface AreaCardProps {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string) => void;
}

export default function AreaCard({ 
  id, 
  name, 
  description, 
  isActive, 
  onEdit, 
  onDelete, 
  onToggle 
}: AreaCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <span 
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
      
      <div className="flex gap-2">
        {onToggle && (
          <button
            onClick={() => onToggle(id)}
            className={`flex-1 py-2 px-4 rounded ${
              isActive
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isActive ? 'Disable' : 'Enable'}
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(id)}
            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

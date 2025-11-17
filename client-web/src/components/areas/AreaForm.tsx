import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

interface AreaFormProps {
  initialData?: {
    name: string;
    description: string;
    actionService: string;
    actionConfig: any;
    reactionService: string;
    reactionConfig: any;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AreaForm: React.FC<AreaFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    actionService: initialData?.actionService || '',
    actionConfig: initialData?.actionConfig || {},
    reactionService: initialData?.reactionService || '',
    reactionConfig: initialData?.reactionConfig || {},
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Area Name</label>
        <Input
          type="text"
          value={formData.name}
          onChange={(value: string) => handleChange('name', value)}
          placeholder="My automation area"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          className="input min-h-[100px] resize-y"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="What does this area do?"
          required
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Action (Trigger)</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Service</label>
          <select
            className="input"
            value={formData.actionService}
            onChange={(e) => handleChange('actionService', e.target.value)}
            required
          >
            <option value="">Select a service</option>
            <option value="GitHub">GitHub</option>
            <option value="Gmail">Gmail</option>
            <option value="Weather">Weather</option>
            <option value="Timer">Timer</option>
          </select>
        </div>

        {formData.actionService && (
          <div>
            <label className="block text-sm font-medium mb-2">Action Configuration</label>
            <textarea
              className="input min-h-[80px]"
              value={JSON.stringify(formData.actionConfig, null, 2)}
              onChange={(e) => {
                try {
                  handleChange('actionConfig', JSON.parse(e.target.value));
                } catch {}
              }}
              placeholder='{"param": "value"}'
            />
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Reaction (Response)</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Service</label>
          <select
            className="input"
            value={formData.reactionService}
            onChange={(e) => handleChange('reactionService', e.target.value)}
            required
          >
            <option value="">Select a service</option>
            <option value="Discord">Discord</option>
            <option value="Gmail">Gmail</option>
            <option value="Google Drive">Google Drive</option>
          </select>
        </div>

        {formData.reactionService && (
          <div>
            <label className="block text-sm font-medium mb-2">Reaction Configuration</label>
            <textarea
              className="input min-h-[80px]"
              value={JSON.stringify(formData.reactionConfig, null, 2)}
              onChange={(e) => {
                try {
                  handleChange('reactionConfig', JSON.parse(e.target.value));
                } catch {}
              }}
              placeholder='{"param": "value"}'
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Area'}
        </Button>
      </div>
    </form>
  );
};

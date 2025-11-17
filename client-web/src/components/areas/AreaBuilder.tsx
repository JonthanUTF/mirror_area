import React, { useState, useEffect } from 'react';
import { servicesAPI, areasAPI } from '../../api/client';

export const AreaBuilder: React.FC = () => {
  const [services, setServices] = useState([]);
  const [selectedActionService, setSelectedActionService] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedReactionService, setSelectedReactionService] = useState('');
  const [selectedReaction, setSelectedReaction] = useState('');
  const [areaName, setAreaName] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data } = await servicesAPI.getAll();
    setServices(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await areasAPI.create({
        name: areaName,
        actionId: selectedAction,
        actionParams: {},
        reactionId: selectedReaction,
        reactionParams: {},
      });
      
      alert('AREA created successfully!');
    } catch (error) {
      alert('Failed to create AREA');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Create New AREA</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">AREA Name</label>
          <input
            type="text"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="My awesome automation"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Action Selection */}
          <div className="border-2 border-green-500 rounded p-4">
            <h3 className="text-xl font-semibold mb-4">IF (Action)</h3>
            
            <div className="mb-4">
              <label className="block text-sm mb-2">Service</label>
              <select
                value={selectedActionService}
                onChange={(e) => setSelectedActionService(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a service...</option>
                {services.map((service: any) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedActionService && (
              <div>
                <label className="block text-sm mb-2">Action</label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select an action...</option>
                  {/* Dynamically load actions based on service */}
                </select>
              </div>
            )}
          </div>

          {/* Reaction Selection */}
          <div className="border-2 border-purple-500 rounded p-4">
            <h3 className="text-xl font-semibold mb-4">THEN (Reaction)</h3>
            
            <div className="mb-4">
              <label className="block text-sm mb-2">Service</label>
              <select
                value={selectedReactionService}
                onChange={(e) => setSelectedReactionService(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a service...</option>
                {services.map((service: any) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedReactionService && (
              <div>
                <label className="block text-sm mb-2">Reaction</label>
                <select
                  value={selectedReaction}
                  onChange={(e) => setSelectedReaction(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a reaction...</option>
                  {/* Dynamically load reactions based on service */}
                </select>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
        >
          Create AREA
        </button>
      </form>
    </div>
  );
};
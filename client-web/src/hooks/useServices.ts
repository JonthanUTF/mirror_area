import { useEffect } from 'react';
import { useServicesStore } from '../store/services.store';
import { servicesApi } from '../api/endpoints';

export function useServices() {
  const { services, setServices, updateServiceConnection } = useServicesStore();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesApi.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchUserServices = async () => {
    try {
      const response = await servicesApi.getUserServices();
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch user services' 
      };
    }
  };

  const connectService = async (serviceId: string, credentials: any) => {
    try {
      const response = await servicesApi.connect(serviceId, credentials);
      updateServiceConnection(serviceId, true);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to connect service' 
      };
    }
  };

  const disconnectService = async (serviceId: string) => {
    try {
      await servicesApi.disconnect(serviceId);
      updateServiceConnection(serviceId, false);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to disconnect service' 
      };
    }
  };

  return {
    services,
    fetchServices,
    fetchUserServices,
    connectService,
    disconnectService,
  };
}

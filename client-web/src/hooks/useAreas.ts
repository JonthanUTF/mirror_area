import { useEffect } from 'react';
import { useAreasStore } from '../store/areas.store';
import { areasApi } from '../api/endpoints';

export function useAreas() {
  const { areas, setAreas, addArea, updateArea, removeArea } = useAreasStore();

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await areasApi.getAll();
      setAreas(response.data);
    } catch (error) {
      console.error('Failed to fetch areas:', error);
    }
  };

  const createArea = async (areaData: any) => {
    try {
      const response = await areasApi.create(areaData);
      addArea(response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create area' 
      };
    }
  };

  const editArea = async (id: string, areaData: any) => {
    try {
      const response = await areasApi.update(id, areaData);
      updateArea(id, response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update area' 
      };
    }
  };

  const deleteArea = async (id: string) => {
    try {
      await areasApi.delete(id);
      removeArea(id);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete area' 
      };
    }
  };

  const toggleArea = async (id: string) => {
    try {
      const response = await areasApi.toggle(id);
      updateArea(id, response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to toggle area' 
      };
    }
  };

  return {
    areas,
    fetchAreas,
    createArea,
    editArea,
    deleteArea,
    toggleArea,
  };
}

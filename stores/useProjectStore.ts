import { create } from 'zustand';
import { useFileSystemStore } from './useFileSystemStore';
import { useCanvasStore } from './canvasStore';
import React from 'react';

interface Project {
  id: string;
  name: string;
  fileSystem: ReturnType<typeof useFileSystemStore.getState>['root'];
  lastModified: number;
}

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  
  saveProject: (name: string) => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
  listProjects: () => Project[];
  autoSave: () => void;
}

const STORAGE_KEY = 'canvas-builder-projects';
const AUTOSAVE_KEY = 'canvas-builder-autosave';

export const useProjectStore = create<ProjectState>((set, get) => {
  // Load projects from localStorage on init
  const loadFromStorage = (): Project[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  };

  const saveToStorage = (projects: Project[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save projects:', error);
    }
  };

  return {
    projects: loadFromStorage(),
    currentProjectId: null,

    saveProject: (name: string) => {
      const fileSystem = useFileSystemStore.getState().root;
      const projects = get().projects;
      
      const newProject: Project = {
        id: crypto.randomUUID(),
        name,
        fileSystem,
        lastModified: Date.now(),
      };

      const updatedProjects = [...projects, newProject];
      set({ projects: updatedProjects, currentProjectId: newProject.id });
      saveToStorage(updatedProjects);
      
      alert(`Project "${name}" saved successfully!`);
    },

    loadProject: (id: string) => {
      const project = get().projects.find(p => p.id === id);
      if (!project) {
        alert('Project not found');
        return;
      }

      // Load file system
      useFileSystemStore.setState({ root: project.fileSystem, selectedFileId: null });
      
      // Clear canvas
      useCanvasStore.setState({ canvasTree: [], selectedId: null });
      
      set({ currentProjectId: id });
      alert(`Project "${project.name}" loaded!`);
    },

    deleteProject: (id: string) => {
      const projects = get().projects.filter(p => p.id !== id);
      set({ 
        projects,
        currentProjectId: get().currentProjectId === id ? null : get().currentProjectId 
      });
      saveToStorage(projects);
    },

    listProjects: () => get().projects,

    autoSave: () => {
      if (typeof window === 'undefined') return;
      
      const fileSystem = useFileSystemStore.getState().root;
      const autoSaveData = {
        fileSystem,
        timestamp: Date.now(),
      };
      
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(autoSaveData));
      } catch (error) {
        console.error('Autosave failed:', error);
      }
    },
  };
});

// Hook for auto-saving
export function useAutoSave(intervalMs = 30000) {
  const { autoSave } = useProjectStore();
  
  React.useEffect(() => {
    const interval = setInterval(autoSave, intervalMs);
    return () => clearInterval(interval);
  }, [autoSave, intervalMs]);
}
"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectStore } from '@/stores/useProjectStore';
import { Trash2, FolderOpen, Save } from 'lucide-react';

interface ProjectDialogProps {
  mode: 'save' | 'load' | null;
  onClose: () => void;
}

export function ProjectDialog({ mode, onClose }: ProjectDialogProps) {
  const [projectName, setProjectName] = useState('');
  const { projects, saveProject, loadProject, deleteProject } = useProjectStore();

  const handleSave = () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    saveProject(projectName);
    setProjectName('');
    onClose();
  };

  const handleLoad = (id: string) => {
    loadProject(id);
    onClose();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  return (
    <Dialog open={!!mode} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'save' ? (
              <>
                <Save className="w-5 h-5" />
                Save Project
              </>
            ) : (
              <>
                <FolderOpen className="w-5 h-5" />
                Load Project
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {mode === 'save' ? (
          <div className="space-y-4">
            <Input
              placeholder="Project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Project
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {projects.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                No saved projects yet
              </p>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(project.lastModified).toLocaleDateString()} at{' '}
                      {new Date(project.lastModified).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoad(project.id)}
                    >
                      Load
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
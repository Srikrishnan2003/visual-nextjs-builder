import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Menu, Settings, Eye, Code, X, Layers, Palette } from 'lucide-react';

// Website Builder Component
const WebsiteBuilder = () => {
  const [components, setComponents] = useState([
    { id: 1, type: 'Button', content: 'Click Me', position: { x: 100, y: 150 } },
    { id: 2, type: 'Card', content: 'Sample Card', position: { x: 300, y: 150 } },
    { id: 3, type: 'Div Container', content: 'Container', position: { x: 500, y: 150 } },
    { id: 4, type: 'Image', content: '🖼️ Image', position: { x: 100, y: 350 } },
    { id: 5, type: 'Link', content: '🔗 Link', position: { x: 300, y: 350 } },
  ]);

  const [selectedComponent, setSelectedComponent] = useState(null);
  const [panelStates, setPanelStates] = useState({
    leftPanel: true,
    rightPanel: true,
  });
  const [viewMode, setViewMode] = useState('design');
  const canvasRef = useRef(null);

  const togglePanel = useCallback((panel) => {
    setPanelStates(prev => ({
      ...prev,
      [panel]: !prev[panel]
    }));
  }, []);

  const handleComponentDrop = useCallback((componentType, position) => {
    const newComponent = {
      id: Date.now(),
      type: componentType,
      content: `New ${componentType}`,
      position,
    };
    
    setComponents(prev => [...prev, newComponent]);
    setSelectedComponent(newComponent);
  }, []);

  const handlePositionChange = useCallback((id, newPosition) => {
    setComponents(prev => 
      prev.map(comp => 
        comp.id === id ? { ...comp, position: newPosition } : comp
      )
    );
  }, []);

  const handleComponentClick = useCallback((component) => {
    setSelectedComponent(component);
  }, []);

  const deleteComponent = useCallback(() => {
    if (selectedComponent) {
      setComponents(prev => prev.filter(comp => comp.id !== selectedComponent.id));
      setSelectedComponent(null);
    }
  }, [selectedComponent]);

  const componentLibrary = [
    { type: 'Button', icon: '🔘', color: 'from-blue-500 to-blue-600', description: 'Interactive button' },
    { type: 'Card', icon: '📄', color: 'from-green-500 to-green-600', description: 'Content card' },
    { type: 'Div Container', icon: '📦', color: 'from-purple-500 to-purple-600', description: 'Layout container' },
    { type: 'Flex Container', icon: '🔗', color: 'from-orange-500 to-orange-600', description: 'Flexible layout' },
    { type: 'Image', icon: '🖼️', color: 'from-pink-500 to-pink-600', description: 'Image element' },
    { type: 'Link', icon: '🌐', color: 'from-cyan-500 to-cyan-600', description: 'Hyperlink' },
  ];

  const getComponentStyle = (type) => {
    const baseStyles = "rounded-xl p-4 shadow-lg border-2 border-white/20 backdrop-blur-sm min-w-[140px] min-h-[80px] flex items-center justify-center text-white font-medium transition-all duration-300";
    
    switch (type) {
      case 'Button':
        return `${baseStyles} bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700`;
      case 'Card':
        return `${baseStyles} bg-gradient-to-br from-green-500 via-green-600 to-green-700`;
      case 'Div Container':
        return `${baseStyles} bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700`;
      case 'Image':
        return `${baseStyles} bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700`;
      case 'Link':
        return `${baseStyles} bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700`;
      default:
        return `${baseStyles} bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700`;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Left Sidebar */}
      <div className={`
        ${panelStates.leftPanel ? 'w-72' : 'w-12'} 
        transition-all duration-300 ease-out 
        bg-white border-r border-gray-100 shadow-lg
        flex flex-col relative z-10
      `}>
        {/* Sidebar Header */}
        <div className={`
          ${panelStates.leftPanel ? 'px-6 py-4' : 'px-0 py-4'} 
          border-b border-gray-200 
          flex items-center 
          ${panelStates.leftPanel ? 'justify-between' : 'justify-center'}
          transition-all duration-300
        `}>
          {panelStates.leftPanel ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Components</h2>
              </div>
              <button
                onClick={() => togglePanel('leftPanel')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => togglePanel('leftPanel')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
              title="Show Components"
            >
              <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          )}
        </div>

        {/* Components Content */}
        <div className={`
          flex-1 overflow-y-auto
          ${panelStates.leftPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          transition-opacity duration-200
        `}>
          {panelStates.leftPanel && (
            <div className="p-4 space-y-3">
              {componentLibrary.map((comp) => (
                <div
                  key={comp.type}
                  className={`
                    group p-4 rounded-xl cursor-pointer transition-all duration-300
                    bg-gradient-to-br ${comp.color} text-white
                    hover:shadow-xl hover:scale-105 active:scale-95
                    border border-white/30 backdrop-blur-sm
                  `}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('componentType', comp.type);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                      {comp.icon}
                    </span>
                    <div>
                      <div className="font-semibold">{comp.type}</div>
                      <div className="text-xs opacity-80">{comp.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collapsed State Vertical Text */}
        {!panelStates.leftPanel && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-medium text-gray-400 whitespace-nowrap pointer-events-none">
            Components
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-100 shadow-md px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Canvas Builder
              </h1>
              <div className="text-sm text-gray-500">
                {components.length} components • {selectedComponent ? 'Component selected' : 'No selection'}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-50 rounded-lg p-1">
                {[
                  { mode: 'design', icon: <Settings size={16} />, label: 'Design' },
                  { mode: 'preview', icon: <Eye size={16} />, label: 'Preview' },
                  { mode: 'code', icon: <Code size={16} />, label: 'Code' },
                ].map(({ mode, icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`
                      px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                      flex items-center space-x-2
                      ${viewMode === mode 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-800'
                      }
                    `}
                  >
                    {icon}
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              {selectedComponent && (
                <button
                  onClick={deleteComponent}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete Component"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className="flex-1 relative bg-gradient-to-br from-gray-50 to-white overflow-hidden"
          onDrop={(e) => {
            e.preventDefault();
            const componentType = e.dataTransfer.getData('componentType');
            if (componentType) {
              const rect = canvasRef.current.getBoundingClientRect();
              const position = {
                x: e.clientX - rect.left - 70,
                y: e.clientY - rect.top - 40,
              };
              handleComponentDrop(componentType, position);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => setSelectedComponent(null)}
        >
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Components */}
          {components.map((component) => (
            <div
              key={component.id}
              style={{
                position: 'absolute',
                left: component.position.x,
                top: component.position.y,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleComponentClick(component);
              }}
              className={getComponentStyle(component.type)}
            >
              <div className="text-center">
                <div className="font-semibold text-lg">{component.type}</div>
                <div className="text-sm opacity-90">{component.content}</div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-400 max-w-md">
                <div className="text-8xl mb-6 animate-bounce">🎨</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-600">Start Creating</h3>
                <p className="text-lg leading-relaxed">
                  Drag components from the sidebar to start building your interface
                </p>
                <div className="mt-6 text-sm text-gray-500">
                  💡 Tip: Click components to select and edit them
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Properties Panel */}
      <div className={`
        ${panelStates.rightPanel ? 'w-80' : 'w-12'} 
        transition-all duration-300 ease-out 
        bg-white border-l border-gray-100 shadow-lg
        flex flex-col relative z-10
      `}>
        {/* Properties Header */}
        <div className={`
          ${panelStates.rightPanel ? 'px-6 py-4' : 'px-0 py-4'} 
          border-b border-gray-200 
          flex items-center 
          ${panelStates.rightPanel ? 'justify-between' : 'justify-center'}
          transition-all duration-300
        `}>
          {panelStates.rightPanel ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
              </div>
              <button
                onClick={() => togglePanel('rightPanel')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => togglePanel('rightPanel')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
              title="Show Properties"
            >
              <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          )}
        </div>

        {/* Properties Content */}
        <div className={`
          flex-1 overflow-y-auto
          ${panelStates.rightPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          transition-opacity duration-200
        `}>
          {panelStates.rightPanel && (
            <div className="p-6">
              {selectedComponent ? (
                <div className="space-y-6">
                  {/* Component Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {selectedComponent.type[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{selectedComponent.type}</h3>
                        <div className="text-sm text-gray-600">ID: {selectedComponent.id}</div>
                      </div>
                    </div>
                  </div>

                  {/* Position Controls */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Position</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">X Coordinate</label>
                        <input
                          type="number"
                          value={Math.round(selectedComponent.position.x)}
                          onChange={(e) => {
                            const newX = parseInt(e.target.value) || 0;
                            const newPosition = { ...selectedComponent.position, x: newX };
                            handlePositionChange(selectedComponent.id, newPosition);
                          }}
                          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Y Coordinate</label>
                        <input
                          type="number"
                          value={Math.round(selectedComponent.position.y)}
                          onChange={(e) => {
                            const newY = parseInt(e.target.value) || 0;
                            const newPosition = { ...selectedComponent.position, y: newY };
                            handlePositionChange(selectedComponent.id, newPosition);
                          }}
                          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Content</span>
                    </h4>
                    <textarea
                      value={selectedComponent.content}
                      onChange={(e) => {
                        const newContent = e.target.value;
                        setComponents(prev => 
                          prev.map(comp => 
                            comp.id === selectedComponent.id 
                              ? { ...comp, content: newContent }
                              : comp
                          )
                        );
                        setSelectedComponent(prev => ({ ...prev, content: newContent }));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                      rows={4}
                      placeholder="Enter component content..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      onClick={deleteComponent}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      Delete Component
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 mt-20">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-600">No Selection</h3>
                  <p className="text-sm leading-relaxed px-4">
                    Select a component from the canvas to edit its properties and styling options
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Collapsed State Vertical Text */}
        {!panelStates.rightPanel && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 text-xs font-medium text-gray-400 whitespace-nowrap pointer-events-none">
            Properties
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteBuilder;

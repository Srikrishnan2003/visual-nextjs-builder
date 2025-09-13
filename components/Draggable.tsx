import React, { useState, useRef, useCallback, useEffect } from 'react';

// Custom hook for smooth dragging
export const useSmoothDrag = (onDrag, onDragStart, onDragEnd) => {
  const isDraggingRef = useRef(false); 
  const [_, forceRender] = useState(0); 

  const [dragState, setDragState] = useState({
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  });
  const elementRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (!elementRef.current) return;
    
    e.preventDefault();
    const rect = elementRef.current.getBoundingClientRect();
    
    const startState = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: elementRef.current.offsetLeft,
      startTop: elementRef.current.offsetTop,
    };
    
    setDragState(startState);
    isDraggingRef.current = true; 
    forceRender(prev => prev + 1); 
    
    if (onDragStart) {
      onDragStart(e, elementRef.current);
    }
    
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }, [onDragStart]);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !elementRef.current) return; 
    
    e.preventDefault();
    
    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;
    
    const newLeft = dragState.startLeft + deltaX;
    const newTop = dragState.startTop + deltaY;
    
    elementRef.current.style.left = `${newLeft}px`;
    elementRef.current.style.top = `${newTop}px`;
    
    if (onDrag) {
      onDrag(e, { x: newLeft, y: newTop }, elementRef.current);
    }
  }, [dragState, onDrag]); 

  const handleMouseUp = useCallback((e) => {
    if (!isDraggingRef.current || !elementRef.current) return; 
    
    isDraggingRef.current = false; 
    forceRender(prev => prev + 1); 
    
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    if (onDragEnd) {
      onDragEnd(e, elementRef.current);
    }
  }, [onDragEnd]); 

  const handleTouchStart = useCallback((e) => {
    if (!elementRef.current) return;
    
    const touch = e.touches[0];
    const mockEvent = {
      ...e,
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => e.preventDefault(),
    };
    
    handleMouseDown(mockEvent);
  }, [handleMouseDown]);

  const handleTouchMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    
    const touch = e.touches[0];
    const mockEvent = {
      ...e,
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => e.preventDefault(),
    };
    
    handleMouseMove(mockEvent);
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback((e) => {
    handleMouseUp(e);
  }, [handleMouseUp]);

  useEffect(() => {
    if (isDraggingRef.current) { 
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDraggingRef.current, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]); 

  return {
    elementRef,
    isDragging: isDraggingRef.current, 
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
  };
};

// Draggable component wrapper
export const DraggableComponent = ({
  children, 
  className = "", 
  initialPosition = { x: 0, y: 0 },
  onPositionChange,
  disabled = false,
  isSelected = false,
  onClick,
  ...props 
}) => {
  const positionRef = useRef(initialPosition); 

  useEffect(() => {
    positionRef.current = initialPosition;
    if (elementRef.current) {
      elementRef.current.style.left = `${initialPosition.x}px`;
      elementRef.current.style.top = `${initialPosition.y}px`;
    }
  }, [initialPosition]);

  const handleDrag = useCallback((e, newPosition) => {
    positionRef.current = newPosition; 
    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  }, [onPositionChange]);

  const handleDragStart = useCallback((e, element) => {
    element.classList.add('dragging');
  }, []);

  const handleDragEnd = useCallback((e, element) => {
    element.classList.remove('dragging');
  }, []);

  const { elementRef, isDragging, dragHandlers } = useSmoothDrag(
    handleDrag,
    handleDragStart,
    handleDragEnd
  );

  return (
    <div
      ref={elementRef}
      className={`
        ${className} 
        ${!disabled ? 'cursor-grab' : 'cursor-default'}
        ${isDragging ? 'cursor-grabbing' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50' : 'ring-0'}
        hover:scale-[1.02]
        select-none
      `}
      style={{
        position: 'absolute',
        left: positionRef.current.x, 
        top: positionRef.current.y,  
        transform: isDragging ? 'scale(1.05) rotate(1deg)' : 'scale(1) rotate(0deg)',
        zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
        boxShadow: isDragging 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
          : isSelected 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          : undefined,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      }}
      onClick={onClick}
      {...(!disabled ? dragHandlers : {})}
      {...props}
    >
      {children}
      {isSelected && (
        <div className="absolute -inset-1 bg-blue-400/30 rounded-lg pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

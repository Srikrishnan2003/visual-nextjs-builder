import React, { useState, useRef, useCallback, useEffect } from 'react';

// Custom hook for smooth dragging
export const useSmoothDrag = (onDrag, onDragStart, onDragEnd) => {
  const [isDragging, setIsDragging] = useState(false);
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
    setIsDragging(true);
    
    if (onDragStart) {
      onDragStart(e, elementRef.current);
    }
    
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }, [onDragStart]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !elementRef.current) return;
    
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
  }, [isDragging, dragState, onDrag]);

  const handleMouseUp = useCallback((e) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    if (onDragEnd) {
      onDragEnd(e, elementRef.current);
    }
  }, [isDragging, onDragEnd]);

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
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const mockEvent = {
      ...e,
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => e.preventDefault(),
    };
    
    handleMouseMove(mockEvent);
  }, [isDragging, handleMouseMove]);

  const handleTouchEnd = useCallback((e) => {
    handleMouseUp(e);
  }, [handleMouseUp]);

  useEffect(() => {
    if (isDragging) {
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
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return {
    elementRef,
    isDragging,
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
  const [position, setPosition] = useState(initialPosition);

  const handleDrag = useCallback((e, newPosition) => {
    setPosition(newPosition);
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

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return (
    <div
      ref={elementRef}
      className={`
        ${className} 
        ${!disabled ? 'cursor-grab' : 'cursor-default'}
        ${isDragging ? 'cursor-grabbing' : ''}
        ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2 ring-offset-gray-50' : ''}
        transition-all duration-200 ease-out
        hover:scale-[1.03] hover:shadow-xl
        select-none
      `}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: isDragging ? 'scale(1.07) rotate(2deg)' : 'scale(1) rotate(0deg)',
        zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
        boxShadow: isDragging ? '0 20px 40px rgba(0, 0, 0, 0.2)' : undefined,
      }}
      onClick={onClick}
      {...(!disabled ? dragHandlers : {})}
      {...props}
    >
      {children}
      {isSelected && (
        <div className="absolute -inset-1 bg-blue-400 opacity-30 rounded-lg pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

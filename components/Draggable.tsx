import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { throttle } from '@/lib/performace';

// Define types for the hook arguments
type Position = { x: number; y: number };
type DragEvent = MouseEvent | TouchEvent;

type OnDrag = (e: DragEvent, pos: Position, el: HTMLElement) => void;
type OnDragStart = (e: DragEvent, el: HTMLElement) => void;
type OnDragEnd = (e: DragEvent, el: HTMLElement, finalPosition: Position) => void;

// Custom hook for smooth dragging
export const useSmoothDrag = (
  onDrag?: OnDrag,
  onDragStart?: OnDragStart,
  onDragEnd?: OnDragEnd
) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleDragStartInternal = useCallback((e: DragEvent) => {
    if (!elementRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragState.current = {
      startX: clientX,
      startY: clientY,
      startLeft: elementRef.current.offsetLeft,
      startTop: elementRef.current.offsetTop,
    };
    
    setIsDragging(true);
    
    if (onDragStart) {
      onDragStart(e, elementRef.current);
    }
    
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }, [onDragStart]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStartInternal(e.nativeEvent);
  }, [handleDragStartInternal]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Prevent default to avoid scrolling and other touch behaviors
    e.preventDefault();
    handleDragStartInternal(e.nativeEvent);
  }, [handleDragStartInternal]);

  const handleDragMoveInternal = useMemo(() => throttle((e: DragEvent) => {
    if (!elementRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragState.current.startX;
    const deltaY = clientY - dragState.current.startY;
    
    const newLeft = dragState.current.startLeft + deltaX;
    const newTop = dragState.current.startTop + deltaY;
    
    elementRef.current.style.left = `${newLeft}px`;
    elementRef.current.style.top = `${newTop}px`;
    
    if (onDrag) {
      onDrag(e, { x: newLeft, y: newTop }, elementRef.current);
    }
  }, 16), [onDrag]);

  const handleDragEndInternal = useCallback((e: DragEvent) => {
    setIsDragging(false);
    
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    if (elementRef.current && onDragEnd) {
      const finalPosition = {
        x: elementRef.current.offsetLeft,
        y: elementRef.current.offsetTop,
      };
      onDragEnd(e, elementRef.current, finalPosition);
    }
  }, [onDragEnd]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMoveInternal(e);
    const handleMouseUp = (e: MouseEvent) => handleDragEndInternal(e);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleDragMoveInternal(e);
    };
    const handleTouchEnd = (e: TouchEvent) => handleDragEndInternal(e);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragMoveInternal, handleDragEndInternal]);

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
interface DraggableComponentProps {
  children: React.ReactNode;
  className?: string;
  initialPosition?: Position;
  onDragEnd?: (pos: Position) => void;
  disabled?: boolean;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any; // For other props passed down
}

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  children, 
  className = "", 
  initialPosition = { x: 0, y: 0 },
  onDragEnd,
  disabled = false,
  isSelected = false,
  onClick,
  ...props 
}) => {
  const positionRef = useRef(initialPosition);

  const handleDrag = useCallback((e: DragEvent, newPosition: Position) => {
    positionRef.current = newPosition; 
  }, []);

  const handleDragStart = useCallback((e: DragEvent, element: HTMLElement) => {
    element.classList.add('dragging');
  }, []);

  const handleDragEnd = useCallback((e: DragEvent, element: HTMLElement, finalPosition: Position) => {
    element.classList.remove('dragging');
    if (onDragEnd) {
      onDragEnd(finalPosition);
    }
  }, [onDragEnd]);

  const { elementRef, isDragging, dragHandlers } = useSmoothDrag(
    handleDrag,
    handleDragStart,
    handleDragEnd
  );

  useEffect(() => {
    // Do not apply external position changes while the component is being dragged.
    if (isDragging) return;

    positionRef.current = initialPosition;
    if (elementRef.current) {
      elementRef.current.style.left = `${initialPosition.x}px`;
      elementRef.current.style.top = `${initialPosition.y}px`;
    }
  }, [initialPosition, elementRef, isDragging]);

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
        // left and top are managed by the hook to prevent snapping on re-render
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
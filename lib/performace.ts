// lib/performance.ts - Client-side performance optimizations

import { ComponentNode } from "@/types/component-nodes";
import React from "react";
import { useMemo, useCallback } from "react";

// ===== 1. MEMOIZATION HELPERS =====

/**
 * Memoize canvas tree to prevent unnecessary re-renders
 */
export function useMemoizedCanvasTree(canvasTree: ComponentNode[]) {
  return useMemo(() => canvasTree, [JSON.stringify(canvasTree)]);
}

/**
 * Debounce function for auto-save and expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for drag operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===== 2. CODE GENERATION OPTIMIZATION =====

/**
 * Cache for generated code to avoid re-parsing
 */
class CodeGenerationCache {
  private cache = new Map<string, string>();
  private maxSize = 100; // Keep last 100 generated codes

  generateKey(tree: ComponentNode[]): string {
    // Create a lightweight hash of the tree
    return JSON.stringify(tree.map(n => ({ id: n.id, type: n.type, props: n.props })));
  }

  get(tree: ComponentNode[]): string | null {
    const key = this.generateKey(tree);
    return this.cache.get(key) || null;
  }

  set(tree: ComponentNode[], code: string): void {
    const key = this.generateKey(tree);
    
    // Limit cache size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, code);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const codeCache = new CodeGenerationCache();

// ===== 3. HISTORY OPTIMIZATION =====

/**
 * Limit history size to prevent memory issues
 */
export function pruneHistory(
  history: ComponentNode[][],
  maxHistorySize: number = 50
): ComponentNode[][] {
  if (history.length <= maxHistorySize) {
    return history;
  }
  
  // Keep most recent entries
  return history.slice(-maxHistorySize);
}

// ===== 4. COMPONENT RENDERING OPTIMIZATION =====

/**
 * Check if component props actually changed (deep comparison)
 */
export function propsChanged(
  oldProps: Record<string, any>,
  newProps: Record<string, any>
): boolean {
  const oldKeys = Object.keys(oldProps);
  const newKeys = Object.keys(newProps);
  
  if (oldKeys.length !== newKeys.length) return true;
  
  for (const key of oldKeys) {
    if (oldProps[key] !== newProps[key]) {
      // For objects/arrays, do JSON comparison
      if (typeof oldProps[key] === 'object' && typeof newProps[key] === 'object') {
        if (JSON.stringify(oldProps[key]) !== JSON.stringify(newProps[key])) {
          return true;
        }
      } else {
        return true;
      }
    }
  }
  
  return false;
}

// ===== 5. LAZY LOADING FOR CODE EDITOR =====

/**
 * Delay code generation until user needs it
 */
export function useLazyCodeGeneration(
  shouldGenerate: boolean,
  generateFn: () => string,
  delay: number = 300
): string {
  const [code, setCode] = React.useState('');
  
  React.useEffect(() => {
    if (!shouldGenerate) return;
    
    const timer = setTimeout(() => {
      setCode(generateFn());
    }, delay);
    
    return () => clearTimeout(timer);
  }, [shouldGenerate, generateFn, delay]);
  
  return code;
}

// ===== 6. VIRTUAL SCROLLING FOR LARGE TREES =====

/**
 * Get visible nodes in viewport (for component tree view)
 */
export function getVisibleNodes(
  allNodes: ComponentNode[],
  scrollTop: number,
  viewportHeight: number,
  itemHeight: number = 32
): { nodes: ComponentNode[]; startIndex: number; endIndex: number } {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.ceil((scrollTop + viewportHeight) / itemHeight);
  
  const flattenedNodes = flattenComponentTree(allNodes);
  const visibleNodes = flattenedNodes.slice(startIndex, endIndex + 1);
  
  return { nodes: visibleNodes, startIndex, endIndex };
}

function flattenComponentTree(nodes: ComponentNode[]): ComponentNode[] {
  const flattened: ComponentNode[] = [];
  
  function traverse(node: ComponentNode) {
    flattened.push(node);
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  nodes.forEach(traverse);
  return flattened;
}

// ===== 7. BATCH UPDATES =====

/**
 * Batch multiple state updates into one
 */
export class UpdateBatcher {
  private updates: (() => void)[] = [];
  private timeout: NodeJS.Timeout | null = null;
  
  add(update: () => void): void {
    this.updates.push(update);
    
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    this.timeout = setTimeout(() => {
      this.flush();
    }, 16); // One frame
  }
  
  flush(): void {
    this.updates.forEach(update => update());
    this.updates = [];
    this.timeout = null;
  }
}

export const updateBatcher = new UpdateBatcher();

// ===== 8. MEMORY MANAGEMENT =====

/**
 * Clean up old references and prevent memory leaks
 */
export function cleanupMemory() {
  // Clear code cache
  codeCache.clear();
  
  // Force garbage collection (if available in dev)
  if (typeof global !== 'undefined' && global.gc) {
    global.gc();
  }
}

// ===== 9. PERFORMANCE MONITORING =====

export class PerformanceMonitor {
  private measurements = new Map<string, number[]>();
  
  start(label: string): void {
    performance.mark(`${label}-start`);
  }
  
  end(label: string): number {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    const duration = measure.duration;
    
    // Store measurement
    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }
    this.measurements.get(label)!.push(duration);
    
    // Keep only last 100 measurements
    const measurements = this.measurements.get(label)!;
    if (measurements.length > 100) {
      measurements.shift();
    }
    
    // Clean up
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
    
    return duration;
  }
  
  getAverage(label: string): number {
    const measurements = this.measurements.get(label);
    if (!measurements || measurements.length === 0) return 0;
    
    const sum = measurements.reduce((a, b) => a + b, 0);
    return sum / measurements.length;
  }
  
  report(): void {
    console.log('=== Performance Report ===');
    this.measurements.forEach((measurements, label) => {
      const avg = this.getAverage(label);
      const max = Math.max(...measurements);
      const min = Math.min(...measurements);
      console.log(`${label}:`, {
        average: `${avg.toFixed(2)}ms`,
        min: `${min.toFixed(2)}ms`,
        max: `${max.toFixed(2)}ms`,
        samples: measurements.length
      });
    });
  }
}

export const perfMonitor = new PerformanceMonitor();
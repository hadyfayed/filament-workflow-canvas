/**
 * Viewport Manager Service - implements IViewportManager interface
 * Following Single Responsibility Principle
 */

import { Viewport } from 'reactflow';
import { IViewportManager } from '../interfaces/IWorkflowManager';

export class ViewportManagerService implements IViewportManager {
  private currentViewport: Viewport = { x: 0, y: 0, zoom: 0.5 };

  fitView(instance: any, options?: any): void {
    const defaultOptions = {
      padding: 0.2,
      includeHiddenNodes: true,
      minZoom: 0.1,
      maxZoom: 1.5,
      duration: 200
    };

    const mergedOptions = { ...defaultOptions, ...options };
    
    if (instance && typeof instance.fitView === 'function') {
      instance.fitView(mergedOptions);
    }
  }

  zoomIn(instance: any, options?: { step?: number }): void {
    const step = options?.step || 0.1;
    
    if (instance && typeof instance.zoomIn === 'function') {
      instance.zoomIn();
    } else if (instance && typeof instance.setViewport === 'function') {
      const newZoom = Math.min(this.currentViewport.zoom + step, 2);
      this.updateViewport({ ...this.currentViewport, zoom: newZoom });
      instance.setViewport({ ...this.currentViewport, zoom: newZoom });
    }
  }

  zoomOut(instance: any, options?: { step?: number }): void {
    const step = options?.step || 0.1;
    
    if (instance && typeof instance.zoomOut === 'function') {
      instance.zoomOut();
    } else if (instance && typeof instance.setViewport === 'function') {
      const newZoom = Math.max(this.currentViewport.zoom - step, 0.1);
      this.updateViewport({ ...this.currentViewport, zoom: newZoom });
      instance.setViewport({ ...this.currentViewport, zoom: newZoom });
    }
  }

  updateViewport(viewport: Viewport): void {
    this.currentViewport = { ...viewport };
  }

  getCurrentViewport(): Viewport {
    return { ...this.currentViewport };
  }

  resetViewport(): void {
    this.currentViewport = { x: 0, y: 0, zoom: 0.5 };
  }

  centerViewport(instance: any, position: { x: number; y: number }): void {
    if (instance && typeof instance.setViewport === 'function') {
      const newViewport = {
        x: -position.x + window.innerWidth / 2,
        y: -position.y + window.innerHeight / 2,
        zoom: this.currentViewport.zoom
      };
      this.updateViewport(newViewport);
      instance.setViewport(newViewport);
    }
  }
}
// Workflow Canvas Types

export interface NodeType {
  label: string;
  icon: string;
  color: string;
  has_input: boolean;
  has_output: boolean;
  processor?: string;
}

export interface NodeData {
  id: string;
  type: string;
  label: string;
  config?: Record<string, any>;
  position?: { x: number; y: number };
  [key: string]: any;
}

export interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  name: string;
  description?: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  is_enabled: boolean;
  workflow_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WorkflowConnection {
  id?: string;
  source_node_id: string;
  target_node_id: string;
  conditions: Record<string, any>;
  source_handle?: string;
  target_handle?: string;
  workflow_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WorkflowData {
  id?: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  viewport: { x: number; y: number; zoom: number };
  config?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CanvasConfig {
  autoSave: boolean;
  autoSaveDelay: number;
  fullscreenEnabled: boolean;
  showMinimap: boolean;
  showControls: boolean;
  showBackground: boolean;
  backgroundVariant: 'dots' | 'lines' | 'cross';
  selectionMode: 'partial' | 'full';
}

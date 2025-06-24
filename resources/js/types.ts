// Workflow Canvas Types
export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  description?: string;
  config?: Record<string, any>;
  position: { x: number; y: number };
  is_enabled: boolean;
}

export interface WorkflowConnection {
  source_node_id: string;
  target_node_id: string;
  conditions: Record<string, any>;
}

export interface WorkflowData {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  viewport: { x: number; y: number; zoom: number };
}

export interface NodeData {
  label: string;
  config?: Record<string, any>;
  description?: string;
  hasError?: boolean;
}

export interface NodeType {
  label: string;
  icon: string;
  color: string;
  has_input: boolean;
  has_output: boolean;
  processor?: string;
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

export interface WorkflowCanvasProps {
  initialData?: WorkflowData | null;
  onDataChange?: (data: WorkflowData) => void;
  readonly?: boolean;
  height?: string;
  nodeTypes?: Record<string, NodeType>;
  canvasConfig?: Partial<CanvasConfig>;
}
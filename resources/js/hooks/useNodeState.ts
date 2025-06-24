import { useCallback, useEffect } from 'react';
import { Node } from 'reactflow';
import { useStatePath, useStateManager } from '@hadyfayed/filament-react-wrapper/components/StateManager';
import { NodeData } from '../types';

export function useNodeState(node: Node<NodeData>, onNodeUpdate: (node: Node) => void) {
  const { setState } = useStateManager();

  const [nodeData, setNodeData] = useStatePath(`nodeProps.${node.id}`, {
    label: node.data.label,
    description: node.data.description || '',
    config: node.data.config || {},
    position: node.position,
  });

  useEffect(() => {
    const updatedNode: Node<NodeData> = {
      ...node,
      data: {
        ...node.data,
        label: nodeData.label,
        description: nodeData.description,
        config: nodeData.config,
      },
      position: nodeData.position,
    };
    onNodeUpdate(updatedNode);
  }, [nodeData, node, onNodeUpdate]);

  const updateField = useCallback((path: string, value: any) => {
    setNodeData(prev => {
      const newData = { ...prev };
      let keys: any =path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current) || typeof current[key] !== 'object') {
          current[key] = {};
        } else {
          current[key] = { ...current[key] };
        }
        current = current[key];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, [setNodeData]);

  const updateConfig = useCallback((configPath: string, value: any) => {
    updateField(`config.${configPath}`, value);
  }, [updateField]);
  
  // This is to be used when deleting a node
  const clearState = useCallback(() => {
      setState(`nodeProps.${node.id}`, undefined);
  }, [node.id, setState]);

  return { nodeData, updateField, updateConfig, clearState };
} 
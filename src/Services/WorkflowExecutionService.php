<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Services;

use HadyFayed\WorkflowCanvas\Models\Workflow;
use HadyFayed\WorkflowCanvas\Models\WorkflowExecution;
use HadyFayed\WorkflowCanvas\Models\WorkflowNode;
use HadyFayed\WorkflowCanvas\Services\WorkflowNodes\NodeProcessorFactory;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Service for executing n8n-like workflows.
 * 
 * Handles workflow execution, node processing, and state management.
 */
class WorkflowExecutionService
{
    public function __construct(
        private NodeProcessorFactory $nodeProcessorFactory,
    ) {}

    /**
     * Execute a workflow with given input data.
     */
    public function execute(Workflow $workflow, array $inputData = [], string $triggerSource = 'manual'): WorkflowExecution
    {
        // Create execution record
        $execution = WorkflowExecution::create([
            'workflow_id' => $workflow->id,
            'status' => 'pending',
            'input_data' => $inputData,
            'trigger_source' => $triggerSource,
        ]);

        try {
            $execution->markAsStarted();
            $execution->addLogEntry('system', 'Workflow execution started', [
                'workflow_name' => $workflow->name,
                'trigger_source' => $triggerSource,
            ]);

            // Build execution graph from canvas data
            $executionGraph = $this->buildExecutionGraphFromCanvas($workflow);
            
            // Find trigger nodes from canvas data
            $canvasData = $workflow->canvas_data ?? [];
            $triggerNodes = collect($canvasData['nodes'] ?? [])
                ->where('type', 'trigger');
            
            if ($triggerNodes->isEmpty()) {
                throw new \Exception('No trigger nodes found in workflow');
            }

            // Execute from each trigger node
            $finalOutputs = [];
            foreach ($triggerNodes as $triggerNode) {
                $output = $this->executeCanvasNode($triggerNode, $inputData, $execution, $executionGraph);
                $finalOutputs[$triggerNode['id']] = $output;
            }

            // Update workflow execution stats
            $workflow->increment('execution_count');
            $workflow->update(['last_executed_at' => now()]);

            $execution->markAsCompleted($finalOutputs);
            $execution->addLogEntry('system', 'Workflow execution completed successfully');

            return $execution;
        } catch (Throwable $e) {
            $execution->markAsFailed($e->getMessage());
            $execution->addLogEntry('system', 'Workflow execution failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            Log::error('Workflow execution failed', [
                'workflow_id' => $workflow->id,
                'execution_id' => $execution->id,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Execute a single node and its downstream nodes.
     */
    private function executeNode(
        WorkflowNode $node, 
        array $inputData, 
        WorkflowExecution $execution, 
        array $executionGraph
    ): array {
        try {
            $execution->addLogEntry($node->node_id, "Executing node: {$node->name}", [
                'node_type' => $node->type,
                'input_data_keys' => array_keys($inputData),
            ]);

            // Skip disabled nodes
            if (!$node->is_enabled) {
                $execution->addLogEntry($node->node_id, 'Node is disabled, skipping');
                return $inputData;
            }

            // Get node processor
            $processor = $this->nodeProcessorFactory->create($node->type);
            
            // Process the node
            $outputData = $processor->process($node, $inputData, $execution);
            
            $execution->addLogEntry($node->node_id, "Node executed successfully", [
                'output_data_keys' => array_keys($outputData),
            ]);

            // Execute downstream nodes
            $downstreamNodes = $executionGraph[$node->node_id] ?? [];
            foreach ($downstreamNodes as $downstreamNode) {
                $connection = $downstreamNode['connection'];
                
                // Check connection conditions
                if ($this->shouldExecuteConnection($connection, $outputData)) {
                    $this->executeNode($downstreamNode['node'], $outputData, $execution, $executionGraph);
                } else {
                    $execution->addLogEntry($node->node_id, "Connection condition not met, skipping downstream node: {$downstreamNode['node']->name}");
                }
            }

            return $outputData;
        } catch (Throwable $e) {
            $execution->addLogEntry($node->node_id, "Node execution failed: {$e->getMessage()}", [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Execute a canvas node and its downstream nodes.
     */
    private function executeCanvasNode(
        array $nodeData,
        array $inputData,
        WorkflowExecution $execution,
        array $executionGraph
    ): array {
        try {
            $nodeId = $nodeData['id'];
            $nodeName = $nodeData['name'] ?? 'Unnamed Node';
            $nodeType = $nodeData['type'];
            
            $execution->addLogEntry($nodeId, "Executing node: {$nodeName}", [
                'node_type' => $nodeType,
                'input_data_keys' => array_keys($inputData),
            ]);

            // Skip disabled nodes
            if (!($nodeData['is_enabled'] ?? true)) {
                $execution->addLogEntry($nodeId, 'Node is disabled, skipping');
                return $inputData;
            }

            // Get node processor
            $processor = $this->nodeProcessorFactory->create($nodeType);
            
            // Create a temporary node object for the processor
            $tempNode = (object) [
                'node_id' => $nodeId,
                'type' => $nodeType,
                'name' => $nodeName,
                'config' => $nodeData['config'] ?? [],
                'is_enabled' => $nodeData['is_enabled'] ?? true,
            ];
            
            // Process the node
            $outputData = $processor->process($tempNode, $inputData, $execution);
            
            $execution->addLogEntry($nodeId, "Node executed successfully", [
                'output_data_keys' => array_keys($outputData),
            ]);

            // Execute downstream nodes
            $downstreamNodes = $executionGraph[$nodeId] ?? [];
            foreach ($downstreamNodes as $downstreamNodeData) {
                $connection = $downstreamNodeData['connection'];
                
                // Check connection conditions
                if ($this->shouldExecuteCanvasConnection($connection, $outputData)) {
                    $this->executeCanvasNode($downstreamNodeData['node'], $outputData, $execution, $executionGraph);
                } else {
                    $downstreamNodeName = $downstreamNodeData['node']['name'] ?? 'Unnamed Node';
                    $execution->addLogEntry($nodeId, "Connection condition not met, skipping downstream node: {$downstreamNodeName}");
                }
            }

            return $outputData;
        } catch (Throwable $e) {
            $execution->addLogEntry($nodeData['id'], "Node execution failed: {$e->getMessage()}", [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Build execution graph from canvas data.
     */
    private function buildExecutionGraphFromCanvas(Workflow $workflow): array
    {
        $canvasData = $workflow->canvas_data ?? [];
        $nodes = $canvasData['nodes'] ?? [];
        $connections = $canvasData['connections'] ?? [];
        
        $graph = [];
        $nodeMap = [];
        
        // Create node map for quick lookup
        foreach ($nodes as $node) {
            $nodeMap[$node['id']] = $node;
            $graph[$node['id']] = [];
        }
        
        // Build connections
        foreach ($connections as $connection) {
            $sourceNodeId = $connection['source_node_id'];
            $targetNodeId = $connection['target_node_id'];
            
            if (isset($nodeMap[$sourceNodeId]) && isset($nodeMap[$targetNodeId])) {
                $graph[$sourceNodeId][] = [
                    'node' => $nodeMap[$targetNodeId],
                    'connection' => $connection,
                ];
            }
        }
        
        return $graph;
    }

    /**
     * Build execution graph from workflow nodes and connections.
     */
    private function buildExecutionGraph(Workflow $workflow): array
    {
        $graph = [];
        
        // Initialize graph
        foreach ($workflow->nodes as $node) {
            $graph[$node->node_id] = [];
        }
        
        // Build connections
        foreach ($workflow->connections as $connection) {
            $sourceNode = $workflow->nodes->firstWhere('node_id', $connection->source_node_id);
            $targetNode = $workflow->nodes->firstWhere('node_id', $connection->target_node_id);
            
            if ($sourceNode && $targetNode) {
                $graph[$connection->source_node_id][] = [
                    'node' => $targetNode,
                    'connection' => $connection,
                ];
            }
        }
        
        return $graph;
    }

    /**
     * Check if a canvas connection should be executed based on its conditions.
     */
    private function shouldExecuteCanvasConnection(array $connection, array $data): bool
    {
        $conditions = $connection['conditions'] ?? [];
        
        // If no conditions, always execute
        if (empty($conditions)) {
            return true;
        }
        
        // Simple condition evaluation (could be extended with a proper expression engine)
        foreach ($conditions as $condition) {
            if (!$this->evaluateCondition($condition, $data)) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Check if a connection should be executed based on its conditions.
     */
    private function shouldExecuteConnection($connection, array $data): bool
    {
        // If no conditions, always execute
        if (!$connection->hasConditions()) {
            return true;
        }

        $conditions = $connection->getConditions();
        
        // Simple condition evaluation (could be extended with a proper expression engine)
        foreach ($conditions as $condition) {
            if (!$this->evaluateCondition($condition, $data)) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Evaluate a single condition against data.
     */
    private function evaluateCondition(array $condition, array $data): bool
    {
        $field = $condition['field'] ?? '';
        $operator = $condition['operator'] ?? '==';
        $value = $condition['value'] ?? null;
        
        $dataValue = data_get($data, $field);
        
        return match ($operator) {
            '==' => $dataValue == $value,
            '!=' => $dataValue != $value,
            '>' => $dataValue > $value,
            '<' => $dataValue < $value,
            '>=' => $dataValue >= $value,
            '<=' => $dataValue <= $value,
            'contains' => str_contains((string) $dataValue, (string) $value),
            'not_contains' => !str_contains((string) $dataValue, (string) $value),
            'exists' => isset($dataValue),
            'not_exists' => !isset($dataValue),
            default => false,
        };
    }
}
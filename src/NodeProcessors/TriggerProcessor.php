<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\NodeProcessors;

use HadyFayed\WorkflowCanvas\Models\WorkflowExecution;
use HadyFayed\WorkflowCanvas\Models\WorkflowNode;
use HadyFayed\WorkflowCanvas\Services\WorkflowNodes\NodeProcessorInterface;

/**
 * Processor for trigger nodes.
 * 
 * Trigger nodes are entry points for workflows and pass through the input data.
 */
class TriggerProcessor implements NodeProcessorInterface
{
    public function process(mixed $node, array $inputData, WorkflowExecution $execution): array
    {
        // Support both WorkflowNode model and canvas node object
        $config = $node instanceof WorkflowNode ? $node->config : ($node->config ?? []);
        $nodeId = $node instanceof WorkflowNode ? $node->node_id : $node->node_id;
        $nodeName = $node instanceof WorkflowNode ? $node->name : $node->name;
        
        // Log trigger activation
        $execution->addLogEntry($nodeId, 'Trigger activated', [
            'trigger_type' => $config['trigger_type'] ?? 'unknown',
            'input_data_size' => count($inputData),
        ]);

        // Apply any data filtering or initial transformations
        $outputData = $inputData;
        
        // Add trigger metadata
        $outputData['_trigger'] = [
            'node_id' => $nodeId,
            'name' => $nodeName,
            'type' => $config['trigger_type'] ?? 'manual',
            'timestamp' => now()->toISOString(),
        ];

        // Apply filters if configured
        if (!empty($config['filters'])) {
            $outputData = $this->applyFilters($outputData, $config['filters']);
        }

        return $outputData;
    }

    public function validateConfig(array $config): array
    {
        $errors = [];

        if (empty($config['trigger_type'])) {
            $errors[] = 'Trigger type is required';
        }

        $validTriggerTypes = ['event', 'webhook', 'schedule', 'manual'];
        if (!empty($config['trigger_type']) && !in_array($config['trigger_type'], $validTriggerTypes)) {
            $errors[] = 'Invalid trigger type. Must be one of: ' . implode(', ', $validTriggerTypes);
        }

        return $errors;
    }

    public function getConfigSchema(): array
    {
        return [
            'trigger_type' => [
                'type' => 'select',
                'label' => 'Trigger Type',
                'options' => [
                    'event' => 'Event',
                    'webhook' => 'Webhook',
                    'schedule' => 'Schedule',
                    'manual' => 'Manual',
                ],
                'required' => true,
            ],
            'event_type' => [
                'type' => 'text',
                'label' => 'Event Type',
                'description' => 'Required for event triggers',
                'condition' => ['trigger_type' => 'event'],
            ],
            'webhook_url' => [
                'type' => 'text',
                'label' => 'Webhook URL',
                'description' => 'Required for webhook triggers',
                'condition' => ['trigger_type' => 'webhook'],
            ],
            'schedule' => [
                'type' => 'text',
                'label' => 'Schedule (Cron)',
                'description' => 'Required for scheduled triggers',
                'condition' => ['trigger_type' => 'schedule'],
            ],
            'filters' => [
                'type' => 'array',
                'label' => 'Data Filters',
                'description' => 'Optional filters to apply to incoming data',
            ],
        ];
    }

    /**
     * Apply filters to input data.
     */
    private function applyFilters(array $data, array $filters): array
    {
        foreach ($filters as $filter) {
            $field = $filter['field'] ?? null;
            $operator = $filter['operator'] ?? '==';
            $value = $filter['value'] ?? null;

            if (!$field) continue;

            $dataValue = data_get($data, $field);
            $matches = match ($operator) {
                '==' => $dataValue == $value,
                '!=' => $dataValue != $value,
                '>' => $dataValue > $value,
                '<' => $dataValue < $value,
                'contains' => str_contains((string) $dataValue, (string) $value),
                'exists' => isset($dataValue),
                default => true,
            };

            // If filter doesn't match, remove the data
            if (!$matches) {
                return [];
            }
        }

        return $data;
    }
}
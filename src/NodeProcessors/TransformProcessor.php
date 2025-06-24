<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\NodeProcessors;

use HadyFayed\WorkflowCanvas\Models\WorkflowExecution;
use HadyFayed\WorkflowCanvas\Models\WorkflowNode;
use HadyFayed\WorkflowCanvas\Services\WorkflowNodes\NodeProcessorInterface;
use Illuminate\Support\Arr;

/**
 * Processor for transform nodes.
 * 
 * Transform nodes modify, map, and transform data between workflow steps.
 */
class TransformProcessor implements NodeProcessorInterface
{
    public function process(mixed $node, array $inputData, WorkflowExecution $execution): array
    {
        $config = $node->config;
        $transformType = $config['transform_type'] ?? 'mapping';

        $execution->addLogEntry($node->node_id, 'Starting data transformation', [
            'transform_type' => $transformType,
            'input_keys' => array_keys($inputData),
        ]);

        $outputData = match ($transformType) {
            'mapping' => $this->applyMapping($inputData, $config['mappings'] ?? [], $execution, $node->node_id),
            'javascript' => $this->applyJavaScript($inputData, $config['code'] ?? '', $execution, $node->node_id),
            'template' => $this->applyTemplate($inputData, $config['template'] ?? '', $execution, $node->node_id),
            'merge' => $this->applyMerge($inputData, $config['merge_data'] ?? [], $execution, $node->node_id),
            'filter' => $this->applyFilter($inputData, $config['filters'] ?? [], $execution, $node->node_id),
            default => $inputData,
        };

        $execution->addLogEntry($node->node_id, 'Data transformation completed', [
            'output_keys' => array_keys($outputData),
            'transformation_applied' => $transformType,
        ]);

        return $outputData;
    }

    public function validateConfig(array $config): array
    {
        $errors = [];

        $transformType = $config['transform_type'] ?? '';
        if (empty($transformType)) {
            $errors[] = 'Transform type is required';
        }

        $validTypes = ['mapping', 'javascript', 'template', 'merge', 'filter'];
        if (!empty($transformType) && !in_array($transformType, $validTypes)) {
            $errors[] = 'Invalid transform type. Must be one of: ' . implode(', ', $validTypes);
        }

        // Type-specific validation
        switch ($transformType) {
            case 'mapping':
                if (empty($config['mappings'])) {
                    $errors[] = 'Mappings are required for mapping transform';
                }
                break;
            case 'javascript':
                if (empty($config['code'])) {
                    $errors[] = 'JavaScript code is required for javascript transform';
                }
                break;
            case 'template':
                if (empty($config['template'])) {
                    $errors[] = 'Template is required for template transform';
                }
                break;
        }

        return $errors;
    }

    public function getConfigSchema(): array
    {
        return [
            'transform_type' => [
                'type' => 'select',
                'label' => 'Transform Type',
                'options' => [
                    'mapping' => 'Field Mapping',
                    'javascript' => 'JavaScript Code',
                    'template' => 'Template',
                    'merge' => 'Merge Data',
                    'filter' => 'Filter Fields',
                ],
                'required' => true,
            ],
            'mappings' => [
                'type' => 'array',
                'label' => 'Field Mappings',
                'condition' => ['transform_type' => 'mapping'],
                'items' => [
                    'source' => [
                        'type' => 'text',
                        'label' => 'Source Field',
                        'placeholder' => 'e.g., user.email',
                    ],
                    'target' => [
                        'type' => 'text',
                        'label' => 'Target Field',
                        'placeholder' => 'e.g., customer_email',
                    ],
                    'transform' => [
                        'type' => 'select',
                        'label' => 'Transform',
                        'options' => [
                            'none' => 'None',
                            'uppercase' => 'Uppercase',
                            'lowercase' => 'Lowercase',
                            'hash' => 'Hash (SHA256)',
                            'base64' => 'Base64 Encode',
                        ],
                        'default' => 'none',
                    ],
                ],
            ],
            'code' => [
                'type' => 'textarea',
                'label' => 'JavaScript Code',
                'condition' => ['transform_type' => 'javascript'],
                'description' => 'Use "data" variable to access input data. Return transformed data.',
            ],
            'template' => [
                'type' => 'textarea',
                'label' => 'Template',
                'condition' => ['transform_type' => 'template'],
                'description' => 'Use {{field.path}} syntax to access data',
            ],
        ];
    }

    /**
     * Apply field mappings to transform data.
     */
    private function applyMapping(array $inputData, array $mappings, WorkflowExecution $execution, string $nodeId): array
    {
        $outputData = [];

        foreach ($mappings as $mapping) {
            $source = $mapping['source'] ?? '';
            $target = $mapping['target'] ?? '';
            $transform = $mapping['transform'] ?? 'none';

            if (empty($source) || empty($target)) {
                continue;
            }

            $value = data_get($inputData, $source);
            
            // Apply transformation
            $value = $this->applyFieldTransform($value, $transform);
            
            // Set target field
            Arr::set($outputData, $target, $value);
            
            $execution->addLogEntry($nodeId, "Mapped field: {$source} -> {$target}", [
                'transform_applied' => $transform,
            ]);
        }

        return $outputData;
    }

    /**
     * Apply JavaScript transformation (simplified version).
     */
    private function applyJavaScript(array $inputData, string $code, WorkflowExecution $execution, string $nodeId): array
    {
        // For security reasons, this is a simplified implementation
        // In production, you might want to use a sandboxed JavaScript engine
        
        $execution->addLogEntry($nodeId, 'JavaScript transformation not implemented in this demo');
        
        // For now, just return input data
        return $inputData;
    }

    /**
     * Apply template transformation.
     */
    private function applyTemplate(array $inputData, string $template, WorkflowExecution $execution, string $nodeId): array
    {
        // Simple template replacement using {{field.path}} syntax
        $result = $template;
        
        // Find all template variables
        preg_match_all('/\{\{([^}]+)\}\}/', $template, $matches);
        
        foreach ($matches[1] as $fieldPath) {
            $fieldPath = trim($fieldPath);
            $value = data_get($inputData, $fieldPath, '');
            $result = str_replace("{{$fieldPath}}", (string) $value, $result);
        }

        $execution->addLogEntry($nodeId, 'Applied template transformation');

        return ['template_result' => $result];
    }

    /**
     * Apply merge transformation.
     */
    private function applyMerge(array $inputData, array $mergeData, WorkflowExecution $execution, string $nodeId): array
    {
        $outputData = array_merge($inputData, $mergeData);
        
        $execution->addLogEntry($nodeId, 'Merged additional data', [
            'merge_keys' => array_keys($mergeData),
        ]);

        return $outputData;
    }

    /**
     * Apply field filtering.
     */
    private function applyFilter(array $inputData, array $filters, WorkflowExecution $execution, string $nodeId): array
    {
        $outputData = [];
        
        foreach ($filters as $filter) {
            $field = $filter['field'] ?? '';
            $action = $filter['action'] ?? 'include'; // include or exclude
            
            if (empty($field)) continue;
            
            $value = data_get($inputData, $field);
            
            if ($action === 'include' && !is_null($value)) {
                Arr::set($outputData, $field, $value);
            }
        }

        $execution->addLogEntry($nodeId, 'Applied field filtering', [
            'filtered_fields' => array_keys($outputData),
        ]);

        return $outputData;
    }

    /**
     * Apply individual field transformation.
     */
    private function applyFieldTransform($value, string $transform)
    {
        return match ($transform) {
            'uppercase' => is_string($value) ? strtoupper($value) : $value,
            'lowercase' => is_string($value) ? strtolower($value) : $value,
            'hash' => is_string($value) ? hash('sha256', $value) : $value,
            'base64' => is_string($value) ? base64_encode($value) : $value,
            default => $value,
        };
    }
}
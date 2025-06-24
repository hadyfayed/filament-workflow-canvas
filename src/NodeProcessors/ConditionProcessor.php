<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\NodeProcessors;

use HadyFayed\WorkflowCanvas\Models\WorkflowExecution;
use HadyFayed\WorkflowCanvas\Models\WorkflowNode;
use HadyFayed\WorkflowCanvas\Services\WorkflowNodes\NodeProcessorInterface;

/**
 * Processor for condition nodes.
 * 
 * Condition nodes filter data based on configurable conditions.
 */
class ConditionProcessor implements NodeProcessorInterface
{
    public function process(mixed $node, array $inputData, WorkflowExecution $execution): array
    {
        $config = $node->config;
        $conditions = $config['conditions'] ?? [];

        $execution->addLogEntry($node->node_id, 'Evaluating conditions', [
            'condition_count' => count($conditions),
            'logic_operator' => $config['logic'] ?? 'AND',
        ]);

        // If no conditions, pass through
        if (empty($conditions)) {
            $execution->addLogEntry($node->node_id, 'No conditions configured, passing through data');
            return $inputData;
        }

        // Evaluate conditions
        $results = [];
        foreach ($conditions as $index => $condition) {
            $result = $this->evaluateCondition($condition, $inputData);
            $results[] = $result;
            
            $execution->addLogEntry($node->node_id, "Condition {$index} evaluated", [
                'condition' => $condition,
                'result' => $result,
            ]);
        }

        // Apply logic operator
        $logicOperator = strtoupper($config['logic'] ?? 'AND');
        $finalResult = match ($logicOperator) {
            'AND' => !in_array(false, $results),
            'OR' => in_array(true, $results),
            default => !in_array(false, $results), // Default to AND
        };

        $execution->addLogEntry($node->node_id, 'Final condition result', [
            'logic_operator' => $logicOperator,
            'individual_results' => $results,
            'final_result' => $finalResult,
        ]);

        // Return data if conditions pass, empty array if they don't
        if ($finalResult) {
            // Add condition metadata
            $outputData = $inputData;
            $outputData['_condition_passed'] = [
                'node_id' => $node->node_id,
                'conditions_met' => true,
                'timestamp' => now()->toISOString(),
            ];
            
            return $outputData;
        } else {
            // Stop execution by returning empty data
            return [];
        }
    }

    public function validateConfig(array $config): array
    {
        $errors = [];

        if (empty($config['conditions'])) {
            $errors[] = 'At least one condition is required';
        }

        if (!empty($config['logic']) && !in_array(strtoupper($config['logic']), ['AND', 'OR'])) {
            $errors[] = 'Logic operator must be AND or OR';
        }

        // Validate individual conditions
        if (!empty($config['conditions'])) {
            foreach ($config['conditions'] as $index => $condition) {
                if (empty($condition['field'])) {
                    $errors[] = "Condition {$index}: Field is required";
                }
                if (empty($condition['operator'])) {
                    $errors[] = "Condition {$index}: Operator is required";
                }
            }
        }

        return $errors;
    }

    public function getConfigSchema(): array
    {
        return [
            'conditions' => [
                'type' => 'array',
                'label' => 'Conditions',
                'required' => true,
                'items' => [
                    'field' => [
                        'type' => 'text',
                        'label' => 'Field Path',
                        'placeholder' => 'e.g., user.email, event.type',
                        'required' => true,
                    ],
                    'operator' => [
                        'type' => 'select',
                        'label' => 'Operator',
                        'options' => [
                            '==' => 'Equals',
                            '!=' => 'Not Equals',
                            '>' => 'Greater Than',
                            '<' => 'Less Than',
                            '>=' => 'Greater Than or Equal',
                            '<=' => 'Less Than or Equal',
                            'contains' => 'Contains',
                            'not_contains' => 'Does Not Contain',
                            'exists' => 'Exists',
                            'not_exists' => 'Does Not Exist',
                            'in' => 'In Array',
                            'not_in' => 'Not In Array',
                        ],
                        'required' => true,
                    ],
                    'value' => [
                        'type' => 'text',
                        'label' => 'Value',
                        'description' => 'Leave empty for exists/not_exists operators',
                    ],
                ],
            ],
            'logic' => [
                'type' => 'select',
                'label' => 'Logic Operator',
                'options' => [
                    'AND' => 'AND (All conditions must pass)',
                    'OR' => 'OR (At least one condition must pass)',
                ],
                'default' => 'AND',
            ],
        ];
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
            '>' => is_numeric($dataValue) && is_numeric($value) && $dataValue > $value,
            '<' => is_numeric($dataValue) && is_numeric($value) && $dataValue < $value,
            '>=' => is_numeric($dataValue) && is_numeric($value) && $dataValue >= $value,
            '<=' => is_numeric($dataValue) && is_numeric($value) && $dataValue <= $value,
            'contains' => str_contains((string) $dataValue, (string) $value),
            'not_contains' => !str_contains((string) $dataValue, (string) $value),
            'exists' => !is_null($dataValue),
            'not_exists' => is_null($dataValue),
            'in' => is_array($value) && in_array($dataValue, $value),
            'not_in' => is_array($value) && !in_array($dataValue, $value),
            default => false,
        };
    }
}
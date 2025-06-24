<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\NodeProcessors;

use HadyFayed\WorkflowCanvas\Contracts\AnalyticsDriverProviderInterface;
use HadyFayed\WorkflowCanvas\Jobs\DispatchAnalyticsEvent;
use HadyFayed\WorkflowCanvas\Models\WorkflowExecution;
use HadyFayed\WorkflowCanvas\Models\WorkflowNode;
use HadyFayed\WorkflowCanvas\Services\WorkflowNodes\NodeProcessorInterface;

/**
 * Processor for analytics driver nodes.
 * 
 * Analytics driver nodes send data to configured analytics platforms.
 */
class AnalyticsDriverProcessor implements NodeProcessorInterface
{
    public function __construct(
        private AnalyticsDriverProviderInterface $driverManager,
    ) {}

    public function process(mixed $node, array $inputData, WorkflowExecution $execution): array
    {
        $config = $node->config;
        $driverName = $config['driver'] ?? '';
        $async = $config['async'] ?? true;
        $transformRules = $config['transform_rules'] ?? [];

        $execution->addLogEntry($node->node_id, 'Processing analytics driver node', [
            'driver' => $driverName,
            'async' => $async,
            'has_transform_rules' => !empty($transformRules),
        ]);

        if (empty($driverName)) {
            throw new \Exception('Analytics driver not configured');
        }

        // Get the driver
        $driver = $this->driverManager->get($driverName);
        if (!$driver) {
            throw new \Exception("Analytics driver '{$driverName}' not found or not enabled");
        }

        // Apply transformation rules if configured
        $eventData = $this->applyTransformRules($inputData, $transformRules, $execution, $node->node_id);

        // Validate required fields based on driver requirements
        $this->validateEventData($eventData, $driver, $execution, $node->node_id);

        try {
            if ($async) {
                // Dispatch async via queue
                DispatchAnalyticsEvent::dispatch($driverName, $eventData)
                    ->onQueue($driver->getQueueName());
                
                $execution->addLogEntry($node->node_id, 'Event dispatched to queue', [
                    'driver' => $driverName,
                    'queue' => $driver->getQueueName(),
                ]);
            } else {
                // Send synchronously
                $success = $driver->sendEvent($eventData);
                
                if (!$success) {
                    throw new \Exception("Failed to send event to {$driverName}");
                }
                
                $execution->addLogEntry($node->node_id, 'Event sent synchronously', [
                    'driver' => $driverName,
                    'success' => $success,
                ]);
            }

            // Add analytics metadata to output
            $outputData = $inputData;
            $outputData['_analytics_dispatched'] = [
                'node_id' => $node->node_id,
                'driver' => $driverName,
                'async' => $async,
                'timestamp' => now()->toISOString(),
                'event_data_keys' => array_keys($eventData),
            ];

            return $outputData;
        } catch (\Throwable $e) {
            $execution->addLogEntry($node->node_id, 'Analytics dispatch failed', [
                'driver' => $driverName,
                'error' => $e->getMessage(),
            ]);
            
            // Decide whether to fail the workflow or continue
            if ($config['fail_on_error'] ?? true) {
                throw $e;
            } else {
                // Log error but continue workflow
                $execution->addLogEntry($node->node_id, 'Continuing workflow despite analytics error');
                return $inputData;
            }
        }
    }

    public function validateConfig(array $config): array
    {
        $errors = [];

        if (empty($config['driver'])) {
            $errors[] = 'Analytics driver is required';
        }

        // Validate driver exists
        if (!empty($config['driver'])) {
            $driver = $this->driverManager->get($config['driver']);
            if (!$driver) {
                $errors[] = "Analytics driver '{$config['driver']}' not found or not enabled";
            }
        }

        return $errors;
    }

    public function getConfigSchema(): array
    {
        $driverOptions = [];
        foreach ($this->driverManager->all() as $name => $driver) {
            $driverOptions[$name] = $driver->getPlatformName();
        }

        return [
            'driver' => [
                'type' => 'select',
                'label' => 'Analytics Platform',
                'options' => $driverOptions,
                'required' => true,
            ],
            'async' => [
                'type' => 'toggle',
                'label' => 'Async Processing',
                'description' => 'Send events via queue (recommended)',
                'default' => true,
            ],
            'fail_on_error' => [
                'type' => 'toggle',
                'label' => 'Fail on Error',
                'description' => 'Stop workflow if analytics dispatch fails',
                'default' => true,
            ],
            'transform_rules' => [
                'type' => 'array',
                'label' => 'Data Transform Rules',
                'description' => 'Transform data before sending to analytics platform',
                'items' => [
                    'source_field' => [
                        'type' => 'text',
                        'label' => 'Source Field',
                        'placeholder' => 'e.g., user.email',
                    ],
                    'target_field' => [
                        'type' => 'text',
                        'label' => 'Target Field',
                        'placeholder' => 'e.g., customer_email',
                    ],
                    'required' => [
                        'type' => 'toggle',
                        'label' => 'Required',
                        'default' => false,
                    ],
                ],
            ],
            'event_name_mapping' => [
                'type' => 'text',
                'label' => 'Event Name Mapping',
                'description' => 'Map to platform-specific event name',
                'placeholder' => 'e.g., purchase, page_view',
            ],
        ];
    }

    /**
     * Apply transformation rules to input data.
     */
    private function applyTransformRules(array $inputData, array $transformRules, WorkflowExecution $execution, string $nodeId): array
    {
        if (empty($transformRules)) {
            return $inputData;
        }

        $eventData = [];
        
        foreach ($transformRules as $rule) {
            $sourceField = $rule['source_field'] ?? '';
            $targetField = $rule['target_field'] ?? '';
            $required = $rule['required'] ?? false;

            if (empty($sourceField) || empty($targetField)) {
                continue;
            }

            $value = data_get($inputData, $sourceField);
            
            if ($required && is_null($value)) {
                throw new \Exception("Required field '{$sourceField}' is missing");
            }

            if (!is_null($value)) {
                data_set($eventData, $targetField, $value);
                
                $execution->addLogEntry($nodeId, "Transformed field: {$sourceField} -> {$targetField}");
            }
        }

        return $eventData;
    }

    /**
     * Validate event data against driver requirements.
     */
    private function validateEventData(array $eventData, $driver, WorkflowExecution $execution, string $nodeId): void
    {
        // Get driver configuration schema to check required fields
        $configFields = $driver->getConfigurationFields();
        
        // Basic validation - ensure we have some data
        if (empty($eventData)) {
            throw new \Exception('No event data to send to analytics platform');
        }

        $execution->addLogEntry($nodeId, 'Event data validated', [
            'event_data_fields' => array_keys($eventData),
            'driver_platform' => $driver->getPlatformName(),
        ]);
    }
}
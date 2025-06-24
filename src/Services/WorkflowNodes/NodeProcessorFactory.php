<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Services\WorkflowNodes;

use HadyFayed\WorkflowCanvas\Services\WorkflowNodes\Processors\AnalyticsDriverProcessor;
use HadyFayed\WorkflowCanvas\Services\WorkflowNodes\Processors\ConditionProcessor;
use HadyFayed\WorkflowCanvas\Services\WorkflowNodes\Processors\TransformProcessor;
use HadyFayed\WorkflowCanvas\Services\WorkflowNodes\Processors\TriggerProcessor;
use InvalidArgumentException;

/**
 * Factory for creating workflow node processors.
 */
class NodeProcessorFactory
{
    /**
     * Create a processor for the given node type.
     */
    public function create(string $nodeType): NodeProcessorInterface
    {
        return match ($nodeType) {
            'trigger' => app(TriggerProcessor::class),
            'condition' => app(ConditionProcessor::class),
            'transform' => app(TransformProcessor::class),
            'analytics_driver' => app(AnalyticsDriverProcessor::class),
            default => throw new InvalidArgumentException("Unknown node type: {$nodeType}")
        };
    }

    /**
     * Get all available node types.
     */
    public function getAvailableNodeTypes(): array
    {
        return [
            'trigger' => [
                'name' => 'Trigger',
                'description' => 'Start workflow execution',
                'icon' => 'heroicon-o-play',
                'color' => 'blue',
            ],
            'condition' => [
                'name' => 'Condition',
                'description' => 'Filter data based on conditions',
                'icon' => 'heroicon-o-funnel',
                'color' => 'yellow',
            ],
            'transform' => [
                'name' => 'Transform',
                'description' => 'Transform and map data',
                'icon' => 'heroicon-o-arrow-path',
                'color' => 'purple',
            ],
            'analytics_driver' => [
                'name' => 'Analytics Platform',
                'description' => 'Send data to analytics platforms',
                'icon' => 'heroicon-o-chart-bar',
                'color' => 'green',
            ],
        ];
    }
} 
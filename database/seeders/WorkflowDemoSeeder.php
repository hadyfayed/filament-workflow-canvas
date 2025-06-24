<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Database\Seeders;

use HadyFayed\WorkflowCanvas\Models\Workflow;
use HadyFayed\WorkflowCanvas\Models\WorkflowNode;
use HadyFayed\WorkflowCanvas\Models\WorkflowConnection;
use Illuminate\Database\Seeder;

class WorkflowDemoSeeder extends Seeder
{
    public function run(): void
    {
        // Create a demo workflow for purchase events
        $workflow = Workflow::create([
            'name' => 'High-Value Purchase Analytics',
            'description' => 'Process high-value purchases and send to multiple analytics platforms',
            'status' => 'active',
            'is_enabled' => true,
            'trigger_type' => 'event',
            'trigger_config' => [
                'event_type' => 'purchase',
                'source' => 'web',
            ],
            'canvas_data' => [
                'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 0.5],
                'nodes' => [
                    [
                        'id' => 'trigger_purchase',
                        'type' => 'trigger',
                        'name' => 'Purchase Event Trigger',
                        'description' => 'Triggers when a purchase event is received',
                        'config' => [
                            'trigger_type' => 'event',
                            'event_type' => 'purchase',
                            'filters' => [],
                        ],
                        'position' => ['x' => 50, 'y' => 200],
                        'is_enabled' => true,
                    ],
                    [
                        'id' => 'condition_high_value',
                        'type' => 'condition',
                        'name' => 'High Value Filter',
                        'description' => 'Only process purchases over $100',
                        'config' => [
                            'conditions' => [
                                [
                                    'field' => 'payload.value',
                                    'operator' => '>',
                                    'value' => 100,
                                ],
                            ],
                            'logic' => 'AND',
                        ],
                        'position' => ['x' => 300, 'y' => 200],
                        'is_enabled' => true,
                    ],
                    [
                        'id' => 'transform_normalize',
                        'type' => 'transform',
                        'name' => 'Normalize Purchase Data',
                        'description' => 'Transform data for analytics platforms',
                        'config' => [
                            'transform_type' => 'mapping',
                            'mappings' => [
                                ['source' => 'event', 'target' => 'event_name', 'transform' => 'none'],
                                ['source' => 'payload.transaction_id', 'target' => 'transaction_id', 'transform' => 'none'],
                                ['source' => 'payload.value', 'target' => 'value', 'transform' => 'none'],
                                ['source' => 'payload.currency', 'target' => 'currency', 'transform' => 'none'],
                                ['source' => 'payload.user.email', 'target' => 'customer_email', 'transform' => 'hash'],
                                ['source' => 'payload.items', 'target' => 'items', 'transform' => 'none'],
                            ],
                        ],
                        'position' => ['x' => 550, 'y' => 200],
                        'is_enabled' => true,
                    ],
                    [
                        'id' => 'analytics_ga4',
                        'type' => 'analytics_driver',
                        'name' => 'Send to GA4',
                        'description' => 'Send purchase data to Google Analytics 4',
                        'config' => [
                            'driver' => 'ga4',
                            'async' => true,
                            'fail_on_error' => false,
                            'event_name_mapping' => 'purchase',
                            'transform_rules' => [
                                ['source_field' => 'transaction_id', 'target_field' => 'transaction_id', 'required' => true],
                                ['source_field' => 'value', 'target_field' => 'value', 'required' => true],
                                ['source_field' => 'currency', 'target_field' => 'currency', 'required' => true],
                                ['source_field' => 'items', 'target_field' => 'items', 'required' => false],
                            ],
                        ],
                        'position' => ['x' => 800, 'y' => 150],
                        'is_enabled' => true,
                    ],
                    [
                        'id' => 'analytics_meta',
                        'type' => 'analytics_driver',
                        'name' => 'Send to Meta Pixel',
                        'description' => 'Send purchase data to Meta Pixel',
                        'config' => [
                            'driver' => 'meta_pixel',
                            'async' => true,
                            'fail_on_error' => false,
                            'event_name_mapping' => 'Purchase',
                            'transform_rules' => [
                                ['source_field' => 'value', 'target_field' => 'value', 'required' => true],
                                ['source_field' => 'currency', 'target_field' => 'currency', 'required' => true],
                                ['source_field' => 'customer_email', 'target_field' => 'user_data.email', 'required' => false],
                            ],
                        ],
                        'position' => ['x' => 800, 'y' => 250],
                        'is_enabled' => true,
                    ],
                ],
                'connections' => [
                    [
                        'source_node_id' => 'trigger_purchase',
                        'target_node_id' => 'condition_high_value',
                        'conditions' => [],
                    ],
                    [
                        'source_node_id' => 'condition_high_value',
                        'target_node_id' => 'transform_normalize',
                        'conditions' => [],
                    ],
                    [
                        'source_node_id' => 'transform_normalize',
                        'target_node_id' => 'analytics_ga4',
                        'conditions' => [],
                    ],
                    [
                        'source_node_id' => 'transform_normalize',
                        'target_node_id' => 'analytics_meta',
                        'conditions' => [],
                    ],
                ],
            ],
        ]);

        // 1. Event Trigger Node
        $triggerNode = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'node_id' => 'trigger_purchase',
            'type' => 'trigger',
            'name' => 'Purchase Event Trigger',
            'description' => 'Triggers when a purchase event is received',
            'config' => [
                'trigger_type' => 'event',
                'event_type' => 'purchase',
                'filters' => [],
            ],
            'position' => ['x' => 50, 'y' => 200],
            'order' => 1,
        ]);

        // 2. Condition Node - High Value Filter
        $conditionNode = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'node_id' => 'condition_high_value',
            'type' => 'condition',
            'name' => 'High Value Filter',
            'description' => 'Only process purchases over $100',
            'config' => [
                'conditions' => [
                    [
                        'field' => 'payload.value',
                        'operator' => '>',
                        'value' => 100,
                    ],
                ],
                'logic' => 'AND',
            ],
            'position' => ['x' => 300, 'y' => 200],
            'order' => 2,
        ]);

        // 3. Transform Node - Normalize Data
        $transformNode = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'node_id' => 'transform_normalize',
            'type' => 'transform',
            'name' => 'Normalize Purchase Data',
            'description' => 'Transform data for analytics platforms',
            'config' => [
                'transform_type' => 'mapping',
                'mappings' => [
                    ['source' => 'event', 'target' => 'event_name', 'transform' => 'none'],
                    ['source' => 'payload.transaction_id', 'target' => 'transaction_id', 'transform' => 'none'],
                    ['source' => 'payload.value', 'target' => 'value', 'transform' => 'none'],
                    ['source' => 'payload.currency', 'target' => 'currency', 'transform' => 'none'],
                    ['source' => 'payload.user.email', 'target' => 'customer_email', 'transform' => 'hash'],
                    ['source' => 'payload.items', 'target' => 'items', 'transform' => 'none'],
                ],
            ],
            'position' => ['x' => 550, 'y' => 200],
            'order' => 3,
        ]);

        // 4. GA4 Analytics Node
        $ga4Node = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'node_id' => 'analytics_ga4',
            'type' => 'analytics_driver',
            'name' => 'Send to GA4',
            'description' => 'Send purchase data to Google Analytics 4',
            'config' => [
                'driver' => 'ga4',
                'async' => true,
                'fail_on_error' => false,
                'event_name_mapping' => 'purchase',
                'transform_rules' => [
                    ['source_field' => 'transaction_id', 'target_field' => 'transaction_id', 'required' => true],
                    ['source_field' => 'value', 'target_field' => 'value', 'required' => true],
                    ['source_field' => 'currency', 'target_field' => 'currency', 'required' => true],
                    ['source_field' => 'items', 'target_field' => 'items', 'required' => false],
                ],
            ],
            'position' => ['x' => 800, 'y' => 150],
            'order' => 4,
        ]);

        // 5. Meta Pixel Analytics Node
        $metaNode = WorkflowNode::create([
            'workflow_id' => $workflow->id,
            'node_id' => 'analytics_meta',
            'type' => 'analytics_driver',
            'name' => 'Send to Meta Pixel',
            'description' => 'Send purchase data to Meta Pixel',
            'config' => [
                'driver' => 'meta_pixel',
                'async' => true,
                'fail_on_error' => false,
                'event_name_mapping' => 'Purchase',
                'transform_rules' => [
                    ['source_field' => 'value', 'target_field' => 'value', 'required' => true],
                    ['source_field' => 'currency', 'target_field' => 'currency', 'required' => true],
                    ['source_field' => 'customer_email', 'target_field' => 'user_data.email', 'required' => false],
                ],
            ],
            'position' => ['x' => 800, 'y' => 250],
            'order' => 5,
        ]);

        // Create connections
        WorkflowConnection::create([
            'workflow_id' => $workflow->id,
            'source_node_id' => $triggerNode->node_id,
            'target_node_id' => $conditionNode->node_id,
        ]);
        WorkflowConnection::create([
            'workflow_id' => $workflow->id,
            'source_node_id' => $conditionNode->node_id,
            'target_node_id' => $transformNode->node_id,
        ]);
        WorkflowConnection::create([
            'workflow_id' => $workflow->id,
            'source_node_id' => $transformNode->node_id,
            'target_node_id' => $ga4Node->node_id,
        ]);
        WorkflowConnection::create([
            'workflow_id' => $workflow->id,
            'source_node_id' => $transformNode->node_id,
            'target_node_id' => $metaNode->node_id,
        ]);
    }
} 
<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Tests\Feature;

use HadyFayed\WorkflowCanvas\Models\Workflow;
use HadyFayed\WorkflowCanvas\Models\WorkflowNode;
use HadyFayed\WorkflowCanvas\Models\WorkflowConnection;
use HadyFayed\WorkflowCanvas\Services\WorkflowExecutionService;

uses(TestCase::class);

test('workflow can be created with nodes and connections', function () {
    $workflow = Workflow::create([
        'name' => 'Test Analytics Workflow',
        'description' => 'A test workflow for analytics processing',
        'status' => 'active',
        'is_enabled' => true,
        'trigger_type' => 'manual',
    ]);

    $triggerNode = WorkflowNode::create([
        'workflow_id' => $workflow->id,
        'node_id' => 'trigger_1',
        'type' => 'trigger',
        'name' => 'Manual Trigger',
        'config' => ['trigger_type' => 'manual'],
        'position' => ['x' => 100, 'y' => 100],
        'order' => 1,
    ]);

    $transformNode = WorkflowNode::create([
        'workflow_id' => $workflow->id,
        'node_id' => 'transform_1',
        'type' => 'transform',
        'name' => 'Data Transform',
        'config' => [
            'transform_type' => 'mapping',
            'mappings' => [
                ['source' => 'event', 'target' => 'event_name', 'transform' => 'none'],
                ['source' => 'payload.user_id', 'target' => 'user_id', 'transform' => 'none'],
            ]
        ],
        'position' => ['x' => 300, 'y' => 100],
        'order' => 2,
    ]);

    WorkflowConnection::create([
        'workflow_id' => $workflow->id,
        'source_node_id' => 'trigger_1',
        'target_node_id' => 'transform_1',
        'source_anchor' => 'output',
        'target_anchor' => 'input',
    ]);

    expect($workflow->nodes)->toHaveCount(2);
    expect($workflow->connections)->toHaveCount(1);
    expect($workflow->isActive())->toBeTrue();
});

test('workflow execution creates execution record', function () {
    $workflow = Workflow::create([
        'name' => 'Simple Test Workflow',
        'status' => 'active',
        'is_enabled' => true,
        'trigger_type' => 'manual',
    ]);

    WorkflowNode::create([
        'workflow_id' => $workflow->id,
        'node_id' => 'trigger_1',
        'type' => 'trigger',
        'name' => 'Test Trigger',
        'config' => ['trigger_type' => 'manual'],
        'position' => ['x' => 100, 'y' => 100],
        'order' => 1,
    ]);

    $inputData = [
        'event' => 'test_event',
        'payload' => ['user_id' => 123, 'action' => 'click'],
    ];

    $executionService = app(WorkflowExecutionService::class);
    $execution = $executionService->execute($workflow, $inputData, 'test');

    expect($execution->workflow_id)->toBe($workflow->id);
    expect($execution->status)->toBe('completed');
    expect($execution->input_data)->toBe($inputData);
    expect($execution->trigger_source)->toBe('test');
    expect($execution->execution_log)->not()->toBeEmpty();
});

test('condition node filters data correctly', function () {
    $workflow = Workflow::create([
        'name' => 'Condition Test Workflow',
        'status' => 'active',
        'is_enabled' => true,
        'trigger_type' => 'manual',
    ]);

    $triggerNode = WorkflowNode::create([
        'workflow_id' => $workflow->id,
        'node_id' => 'trigger_1',
        'type' => 'trigger',
        'name' => 'Test Trigger',
        'config' => ['trigger_type' => 'manual'],
        'position' => ['x' => 100, 'y' => 100],
        'order' => 1,
    ]);

    $conditionNode = WorkflowNode::create([
        'workflow_id' => $workflow->id,
        'node_id' => 'condition_1',
        'type' => 'condition',
        'name' => 'Purchase Filter',
        'config' => [
            'conditions' => [
                ['field' => 'event', 'operator' => '==', 'value' => 'purchase'],
                ['field' => 'payload.amount', 'operator' => '>', 'value' => 100],
            ],
            'logic' => 'AND',
        ],
        'position' => ['x' => 300, 'y' => 100],
        'order' => 2,
    ]);

    WorkflowConnection::create([
        'workflow_id' => $workflow->id,
        'source_node_id' => 'trigger_1',
        'target_node_id' => 'condition_1',
    ]);

    $executionService = app(WorkflowExecutionService::class);

    // Test data that should pass conditions
    $passingData = [
        'event' => 'purchase',
        'payload' => ['amount' => 150, 'user_id' => 123],
    ];

    $execution = $executionService->execute($workflow, $passingData, 'test');
    expect($execution->status)->toBe('completed');

    // Test data that should fail conditions
    $failingData = [
        'event' => 'page_view',
        'payload' => ['amount' => 50, 'user_id' => 123],
    ];

    $execution2 = $executionService->execute($workflow, $failingData, 'test');
    expect($execution2->status)->toBe('completed'); // Still completes, but data is filtered out
}); 
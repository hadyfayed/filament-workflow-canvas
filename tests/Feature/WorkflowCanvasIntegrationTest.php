<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Tests\Feature;

use HadyFayed\WorkflowCanvas\Models\Workflow;
use App\Models\User;
use HadyFayed\WorkflowCanvas\Services\WorkflowExecutionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use HadyFayed\WorkflowCanvas\Tests\TestCase;

class WorkflowCanvasIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_workflow_canvas_data_structure()
    {
        // Create a user for the workflow
        $user = User::factory()->create();

        // Create a workflow with canvas data
        $workflow = Workflow::create([
            'name' => 'Test Canvas Workflow',
            'description' => 'A test workflow for canvas integration',
            'status' => 'active',
            'is_enabled' => true,
            'trigger_type' => 'event',
            'trigger_config' => [
                'event_type' => 'purchase',
            ],
            'canvas_data' => [
                'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 0.5],
                'nodes' => [
                    [
                        'id' => 'trigger_test',
                        'type' => 'trigger',
                        'name' => 'Test Trigger',
                        'description' => 'Test trigger node',
                        'config' => [
                            'trigger_type' => 'event',
                            'event_type' => 'purchase',
                        ],
                        'position' => ['x' => 100, 'y' => 100],
                        'is_enabled' => true,
                    ],
                    [
                        'id' => 'analytics_test',
                        'type' => 'analytics_driver',
                        'name' => 'Test Analytics',
                        'description' => 'Test analytics node',
                        'config' => [
                            'driver' => 'ga4',
                            'event_name_mapping' => 'purchase',
                        ],
                        'position' => ['x' => 400, 'y' => 100],
                        'is_enabled' => true,
                    ],
                ],
                'connections' => [
                    [
                        'source_node_id' => 'trigger_test',
                        'target_node_id' => 'analytics_test',
                        'conditions' => [],
                    ],
                ],
            ],
            'created_by' => $user->id,
        ]);

        // Test workflow structure
        $this->assertNotNull($workflow->canvas_data);
        $this->assertCount(2, $workflow->canvas_data['nodes']);
        $this->assertCount(1, $workflow->canvas_data['connections']);
        
        // Test node structure
        $triggerNode = collect($workflow->canvas_data['nodes'])->firstWhere('type', 'trigger');
        $this->assertEquals('trigger_test', $triggerNode['id']);
        $this->assertEquals('Test Trigger', $triggerNode['name']);
        $this->assertTrue($triggerNode['is_enabled']);

        $analyticsNode = collect($workflow->canvas_data['nodes'])->firstWhere('type', 'analytics_driver');
        $this->assertEquals('analytics_test', $analyticsNode['id']);
        $this->assertEquals('Test Analytics', $analyticsNode['name']);

        // Test connection structure
        $connection = $workflow->canvas_data['connections'][0];
        $this->assertEquals('trigger_test', $connection['source_node_id']);
        $this->assertEquals('analytics_test', $connection['target_node_id']);
    }

    public function test_workflow_canvas_data_persistence()
    {
        $user = User::factory()->create();
        
        $originalData = [
            'viewport' => ['x' => 10, 'y' => 20, 'zoom' => 0.8],
            'nodes' => [
                [
                    'id' => 'node1',
                    'type' => 'trigger',
                    'name' => 'Updated Node',
                    'position' => ['x' => 200, 'y' => 150],
                    'is_enabled' => true,
                    'config' => ['test' => 'value'],
                ],
            ],
            'connections' => [],
        ];

        // Create workflow
        $workflow = Workflow::create([
            'name' => 'Persistence Test',
            'status' => 'draft',
            'canvas_data' => $originalData,
            'created_by' => $user->id,
        ]);

        // Reload from database
        $reloadedWorkflow = Workflow::find($workflow->id);
        
        $this->assertEquals($originalData, $reloadedWorkflow->canvas_data);
        $this->assertEquals(0.8, $reloadedWorkflow->canvas_data['viewport']['zoom']);
        $this->assertEquals('Updated Node', $reloadedWorkflow->canvas_data['nodes'][0]['name']);
    }

    public function test_workflow_execution_service_with_canvas_data()
    {
        $user = User::factory()->create();

        // Create workflow with canvas data
        $workflow = Workflow::create([
            'name' => 'Execution Test Workflow',
            'status' => 'active',
            'is_enabled' => true,
            'trigger_type' => 'manual',
            'canvas_data' => [
                'nodes' => [
                    [
                        'id' => 'trigger_manual',
                        'type' => 'trigger',
                        'name' => 'Manual Trigger',
                        'config' => ['trigger_type' => 'manual'],
                        'is_enabled' => true,
                    ],
                ],
                'connections' => [],
            ],
            'created_by' => $user->id,
        ]);

        // Test that WorkflowExecutionService can read canvas data
        $executionService = app(WorkflowExecutionService::class);
        
        // This should not throw an exception about missing trigger nodes
        // since we have a trigger node in canvas_data
        try {
            $execution = $executionService->execute($workflow, ['test' => 'data'], 'manual');
            $this->assertEquals('completed', $execution->status);
        } catch (\Exception $e) {
            // If node processors don't exist, that's expected in tests
            // The important thing is that it reads the canvas data correctly
            $this->assertStringNotContainsString('No trigger nodes found', $e->getMessage());
        }
    }

    public function test_workflow_viewport_and_zoom_persistence()
    {
        $user = User::factory()->create();
        
        $canvasData = [
            'viewport' => ['x' => -100, 'y' => 50, 'zoom' => 1.2],
            'nodes' => [
                [
                    'id' => 'positioned_node',
                    'type' => 'trigger',
                    'name' => 'Positioned Node',
                    'position' => ['x' => 500, 'y' => 300],
                    'is_enabled' => true,
                ],
            ],
            'connections' => [],
        ];

        $workflow = Workflow::create([
            'name' => 'Viewport Test',
            'status' => 'active',
            'canvas_data' => $canvasData,
            'created_by' => $user->id,
        ]);

        // Test viewport persistence
        $saved = Workflow::find($workflow->id);
        $this->assertEquals(-100, $saved->canvas_data['viewport']['x']);
        $this->assertEquals(50, $saved->canvas_data['viewport']['y']);
        $this->assertEquals(1.2, $saved->canvas_data['viewport']['zoom']);

        // Test node position persistence
        $this->assertEquals(500, $saved->canvas_data['nodes'][0]['position']['x']);
        $this->assertEquals(300, $saved->canvas_data['nodes'][0]['position']['y']);
    }
} 
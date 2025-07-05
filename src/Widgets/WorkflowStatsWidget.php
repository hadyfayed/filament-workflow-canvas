<?php

namespace HadyFayed\WorkflowCanvas\Widgets;

use HadyFayed\ReactWrapper\Widgets\ReactWidget;
use HadyFayed\WorkflowCanvas\Models\Workflow;
use HadyFayed\WorkflowCanvas\Models\WorkflowExecution;

class WorkflowStatsWidget extends ReactWidget
{
    protected static ?string $heading = 'Workflow Statistics';
    
    protected string $componentName = 'WorkflowStatsWidget';
    
    protected int | string | array $columnSpan = 'full';
    
    // React Wrapper v3.0 handles rendering directly, no view needed

    protected function setUp(): void
    {
        parent::setUp();
        
        // Configure with React Wrapper v3.0 patterns
        $this->lazy()
            ->height(400)
            ->refreshInterval(30); // 30 seconds
    }

    public function getData(): array
    {
        return $this->getWorkflowStats();
    }

    protected function getWorkflowStats(): array
    {
        $totalWorkflows = Workflow::count();
        $activeWorkflows = Workflow::where('status', 'active')->where('is_enabled', true)->count();
        $totalExecutions = WorkflowExecution::count();
        $successfulExecutions = WorkflowExecution::where('status', 'completed')->count();
        $failedExecutions = WorkflowExecution::where('status', 'failed')->count();
        
        // Recent executions (last 24 hours)
        $recentExecutions = WorkflowExecution::where('created_at', '>=', now()->subDay())->count();
        
        // Success rate
        $successRate = $totalExecutions > 0 ? round(($successfulExecutions / $totalExecutions) * 100, 2) : 0;
        
        // Average execution time (in seconds)
        $avgExecutionTime = WorkflowExecution::whereNotNull('completed_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(SECOND, started_at, completed_at)) as avg_time')
            ->value('avg_time') ?: 0;
        
        // Most active workflows
        $mostActiveWorkflows = Workflow::withCount('executions')
            ->orderBy('executions_count', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'executions_count']);
        
        // Execution trend (last 7 days)
        $executionTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $count = WorkflowExecution::whereDate('created_at', $date)->count();
            $executionTrend[] = [
                'date' => $date,
                'count' => $count,
                'label' => now()->subDays($i)->format('M j'),
            ];
        }
        
        // Node type distribution
        $nodeTypeDistribution = Workflow::select('canvas_data')
            ->get()
            ->flatMap(function ($workflow) {
                $canvasData = is_string($workflow->canvas_data) 
                    ? json_decode($workflow->canvas_data, true) 
                    : $workflow->canvas_data;
                
                if (!isset($canvasData['nodes'])) {
                    return [];
                }
                
                return collect($canvasData['nodes'])->pluck('type');
            })
            ->countBy()
            ->toArray();

        return [
            'overview' => [
                'total_workflows' => $totalWorkflows,
                'active_workflows' => $activeWorkflows,
                'total_executions' => $totalExecutions,
                'recent_executions' => $recentExecutions,
                'success_rate' => $successRate,
                'avg_execution_time' => round($avgExecutionTime, 2),
            ],
            'execution_status' => [
                'successful' => $successfulExecutions,
                'failed' => $failedExecutions,
                'running' => WorkflowExecution::where('status', 'running')->count(),
                'pending' => WorkflowExecution::where('status', 'pending')->count(),
            ],
            'most_active_workflows' => $mostActiveWorkflows->map(function ($workflow) {
                return [
                    'id' => $workflow->id,
                    'name' => $workflow->name,
                    'executions' => $workflow->executions_count,
                ];
            })->toArray(),
            'execution_trend' => $executionTrend,
            'node_types' => $nodeTypeDistribution,
        ];
    }

    public static function canView(): bool
    {
        return auth()->user()?->can('view_workflow_stats') ?? true;
    }
}
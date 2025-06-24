<?php

namespace HadyFayed\WorkflowCanvas\Filament\Widgets;

use HadyFayed\ReactWrapper\Widgets\ReactWidget;

class WorkflowCanvasWidget extends ReactWidget
{
    protected static string $view = 'react-wrapper::filament.widgets.react-widget';
    
    protected int | string | array $columnSpan = 'full';

    public function __construct()
    {
        parent::__construct();
        $this->componentName = 'WorkflowCanvas';
        $this->props([
            'initialData' => [
                'nodes' => [
                    [
                        'id' => 'demo-1',
                        'type' => 'trigger',
                        'position' => ['x' => 100, 'y' => 100],
                        'name' => 'Event Received',
                        'description' => 'Demo trigger node',
                        'config' => [],
                    ],
                    [
                        'id' => 'demo-2', 
                        'type' => 'transform',
                        'position' => ['x' => 300, 'y' => 100],
                        'name' => 'Transform Data',
                        'description' => 'Demo transform node',
                        'config' => [],
                    ],
                ],
                'connections' => [
                    [
                        'source_node_id' => 'demo-1',
                        'target_node_id' => 'demo-2',
                        'conditions' => [],
                    ],
                ],
            ],
            'onDataChange' => null, // Read-only for widget
        ]);
    }

    public static function canView(): bool
    {
        return true;
    }
} 
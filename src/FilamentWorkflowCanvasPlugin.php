<?php

namespace HadyFayed\WorkflowCanvas;

use Filament\Contracts\Plugin;
use Filament\Panel;
use Filament\Support\Assets\Js;
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;
use HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowResource;
use HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowExecutionResource;
use HadyFayed\ReactWrapper\FilamentReactWrapperPlugin;

class FilamentWorkflowCanvasPlugin implements Plugin
{
    public function getId(): string
    {
        return 'workflow-canvas';
    }

    public function register(Panel $panel): void
    {
        // Ensure React Wrapper plugin is registered first
        if (!$panel->hasPlugin('react-wrapper')) {
            $panel->plugin(FilamentReactWrapperPlugin::make());
        }

        // Register workflow resources
        $panel->resources([
            WorkflowResource::class,
            WorkflowExecutionResource::class,
        ]);

        // Register workflow canvas widgets if they exist
        if (class_exists(\HadyFayed\WorkflowCanvas\Widgets\WorkflowStatsWidget::class)) {
            $panel->widgets([
                \HadyFayed\WorkflowCanvas\Widgets\WorkflowStatsWidget::class,
            ]);
        }
    }

    public function boot(Panel $panel): void
    {
        // Register workflow canvas assets
        FilamentAsset::register([
            // Core workflow canvas components
            Js::make('workflow-canvas-core', $this->getAssetPath('WorkflowCanvas.tsx'))
                ->loadedOnRequest(),
            Js::make('workflow-canvas-properties', $this->getAssetPath('NodePropertiesPanel.tsx'))
                ->loadedOnRequest(),
            Js::make('workflow-canvas-toolbar', $this->getAssetPath('ToolbarPanel.tsx'))
                ->loadedOnRequest(),
            
            // Node components
            Js::make('workflow-canvas-nodes', $this->getAssetPath('nodes.tsx'))
                ->loadedOnRequest(),
            Js::make('workflow-canvas-trigger-panel', $this->getAssetPath('components/TriggerNodePanel.tsx'))
                ->loadedOnRequest(),
            Js::make('workflow-canvas-condition-panel', $this->getAssetPath('components/ConditionNodePanel.tsx'))
                ->loadedOnRequest(),
            Js::make('workflow-canvas-transform-panel', $this->getAssetPath('components/TransformNodePanel.tsx'))
                ->loadedOnRequest(),
            Js::make('workflow-canvas-analytics-panel', $this->getAssetPath('components/AnalyticsNodePanel.tsx'))
                ->loadedOnRequest(),
            
            // Utilities and types
            Js::make('workflow-canvas-utils', $this->getAssetPath('utils.ts'))
                ->loadedOnRequest(),
            Js::make('workflow-canvas-types', $this->getAssetPath('types.ts'))
                ->loadedOnRequest(),
            
            // Hooks
            Js::make('workflow-canvas-hooks', $this->getAssetPath('hooks/useNodeState.ts'))
                ->loadedOnRequest(),
            
            // Main index file (registers components)
            Js::make('workflow-canvas-index', $this->getAssetPath('index.tsx'))
                ->loadedOnRequest(),
                
        ], 'workflow-canvas');

        // Register ReactFlow CSS if needed
        FilamentAsset::register([
            Css::make('reactflow-styles', 'https://cdn.jsdelivr.net/npm/reactflow@11.10.4/dist/style.css')
                ->loadedOnRequest(),
        ], 'workflow-canvas-styles');
    }

    protected function getAssetPath(string $file): string
    {
        // Check if assets are published first
        $publishedPath = resource_path('js/workflow-canvas/' . $file);
        if (file_exists($publishedPath)) {
            return $publishedPath;
        }

        // Fall back to package path
        return __DIR__ . '/../resources/js/' . $file;
    }

    public static function make(): static
    {
        return app(static::class);
    }
}
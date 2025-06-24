<?php

namespace HadyFayed\WorkflowCanvas;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use HadyFayed\ReactWrapper\ReactWrapperServiceProvider;

class WorkflowCanvasServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register React Wrapper dependency
        $this->app->register(ReactWrapperServiceProvider::class);
        
        $this->mergeConfigFrom(__DIR__.'/../config/workflow-canvas.php', 'workflow-canvas');
        
        // Register workflow canvas components with React Wrapper
        $this->registerWorkflowComponents();
    }

    public function boot()
    {
        $this->publishes([
            __DIR__.'/../config/workflow-canvas.php' => config_path('workflow-canvas.php'),
        ], 'workflow-canvas-config');

        $this->publishes([
            __DIR__.'/../resources/js' => resource_path('js/workflow-canvas'),
        ], 'workflow-canvas-assets');

        $this->publishes([
            __DIR__.'/../database/migrations' => database_path('migrations'),
        ], 'workflow-canvas-migrations');

        $this->publishes([
            __DIR__.'/../database/seeders' => database_path('seeders'),
        ], 'workflow-canvas-seeders');

        $this->loadViewsFrom(__DIR__.'/../resources/views', 'workflow-canvas');
        
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        // Register Blade components
        $this->registerBladeComponents();

        // Register Filament plugin if Filament is available
        if (class_exists(\Filament\FilamentServiceProvider::class)) {
            // Plugin registration will be handled by auto-discovery
        }

        // Register information for Laravel's "About" command
        $this->registerAboutCommand();
    }

    protected function registerBladeComponents(): void
    {
        // Register any custom Blade components if needed
        // Blade::component('workflow-canvas::workflow-canvas', WorkflowCanvasComponent::class);
    }

    /**
     * Register information for Laravel's "About" command.
     */
    protected function registerAboutCommand(): void
    {
        if (class_exists(\Illuminate\Foundation\Console\AboutCommand::class)) {
            \Illuminate\Foundation\Console\AboutCommand::add('Workflow Canvas', fn () => [
                'Version' => '1.0.0',
                'Workflows Count' => \HadyFayed\WorkflowCanvas\Models\Workflow::count(),
                'ReactFlow Integration' => 'Enabled',
                'React Wrapper Dependency' => class_exists(\HadyFayed\ReactWrapper\ReactWrapperServiceProvider::class) ? 'Available' : 'Missing',
                'Assets Published' => file_exists(resource_path('js/workflow-canvas')) ? 'Yes' : 'No',
            ]);
        }
    }

    /**
     * Register workflow canvas components with React Wrapper
     */
    protected function registerWorkflowComponents(): void
    {
        $this->app->booted(function () {
            $registry = app('react-wrapper.registry');
            
            // Register WorkflowCanvas component
            $registry->register('WorkflowCanvas', 'WorkflowCanvas', [
                'props' => [],
                'defaultProps' => [
                    'initialData' => null,
                    'readonly' => false,
                ],
                'description' => 'Visual workflow builder with ReactFlow',
                'category' => 'workflow',
            ]);
            
            // Register NodePropertiesPanel component
            $registry->register('NodePropertiesPanel', 'NodePropertiesPanel', [
                'props' => [],
                'defaultProps' => [],
                'description' => 'Properties panel for workflow nodes',
                'category' => 'workflow',
            ]);
            
            // Register node-specific panels
            $nodePanels = [
                'TriggerNodePanel' => 'Trigger node configuration panel',
                'ConditionNodePanel' => 'Condition node configuration panel', 
                'TransformNodePanel' => 'Transform node configuration panel',
                'AnalyticsNodePanel' => 'Analytics node configuration panel',
            ];
            
            foreach ($nodePanels as $component => $description) {
                $registry->register($component, $component, [
                    'props' => [],
                    'defaultProps' => [],
                    'description' => $description,
                    'category' => 'workflow-nodes',
                ]);
            }
        });
    }
}
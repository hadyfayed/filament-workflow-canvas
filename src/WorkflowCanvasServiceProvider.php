<?php

namespace HadyFayed\WorkflowCanvas;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Filament\Support\Assets\Js;
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;

class WorkflowCanvasServiceProvider extends ServiceProvider
{
    public function register()
    {
        // React Wrapper v3.0 auto-registers itself, no manual registration needed
        $this->mergeConfigFrom(__DIR__.'/../config/workflow-canvas.php', 'workflow-canvas');
        
        // Register workflow canvas components with React Wrapper v3.0
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

        // Publish prebuilt assets for production use (no build step required)
        if (is_dir(__DIR__.'/../dist/laravel')) {
            $this->publishes([
                __DIR__.'/../dist/laravel' => public_path('vendor/workflow-canvas'),
            ], 'workflow-canvas-prebuilt');
        }

        // Note: Views removed - using FilamentAsset for script loading
        
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        // Register Blade components
        $this->registerBladeComponents();

        // Register assets directly with Filament (no plugin needed)
        if (class_exists(\Filament\FilamentServiceProvider::class)) {
            $this->registerFilamentAssets();
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
     * Register workflow canvas components with React Wrapper v3.0
     */
    protected function registerWorkflowComponents(): void
    {
        $this->app->booted(function () {
            // React Wrapper v3.0 uses the new registry pattern
            if (app()->bound('react-wrapper.registry')) {
                $registry = app('react-wrapper.registry');
                
                // Register WorkflowCanvas with lazy loading
                $registry->register('WorkflowCanvas', 'WorkflowCanvas', [
                    'lazy' => true,
                    'preload' => false,
                    'dependencies' => ['reactflow', '@heroicons/react', 'uuid'],
                    'category' => 'workflow',
                    'description' => 'Visual workflow builder with ReactFlow',
                    'defaultProps' => [
                        'initialData' => null,
                        'readonly' => false,
                        'showMinimap' => true,
                    ],
                ]);
                
                // Register supporting components
                $components = [
                    'NodePropertiesPanel' => 'Properties panel for workflow nodes',
                    'WorkflowToolbar' => 'Toolbar for workflow actions',
                    'WorkflowControls' => 'Custom controls for workflow canvas',
                    'TriggerNodePanel' => 'Trigger node configuration panel',
                    'ConditionNodePanel' => 'Condition node configuration panel', 
                    'TransformNodePanel' => 'Transform node configuration panel',
                    'AnalyticsNodePanel' => 'Analytics node configuration panel',
                ];
                
                foreach ($components as $component => $description) {
                    $registry->register($component, $component, [
                        'lazy' => true,
                        'category' => 'workflow',
                        'description' => $description,
                    ]);
                }
            }
        });
    }

    /**
     * Register assets directly with Filament (React Wrapper v3.0 no-plugin pattern)
     */
    protected function registerFilamentAssets(): void
    {
        // Register external dependencies
        FilamentAsset::register([
            Js::make('reactflow', 'https://unpkg.com/reactflow@11/dist/umd/index.js')
                ->loadedOnRequest(),
            Js::make('heroicons', 'https://unpkg.com/@heroicons/react@2/24/outline/index.js')
                ->loadedOnRequest(),
            Js::make('uuid', 'https://unpkg.com/uuid@11/dist/umd/uuidv4.min.js')
                ->loadedOnRequest(),
            Css::make('reactflow-styles', 'https://cdn.jsdelivr.net/npm/reactflow@11.10.4/dist/style.css')
                ->loadedOnRequest(),
        ], 'workflow-canvas-dependencies');

        // Register Workflow Canvas assets
        if ($this->hasPrebuiltAssets()) {
            FilamentAsset::register([
                Js::make('workflow-canvas', asset('vendor/workflow-canvas/js/workflow-canvas.js'))
                    ->loadedOnRequest(),
            ], 'workflow-canvas');
        } else {
            FilamentAsset::register([
                Js::make('workflow-canvas-dev', $this->getAssetPath('index.tsx'))
                    ->module()
                    ->loadedOnRequest(),
            ], 'workflow-canvas');
        }
    }

    protected function getAssetPath(string $file): string
    {
        $publishedPath = resource_path('js/workflow-canvas/' . $file);
        if (file_exists($publishedPath)) {
            return $publishedPath;
        }
        return __DIR__ . '/../resources/js/' . $file;
    }

    protected function hasPrebuiltAssets(): bool
    {
        return file_exists(public_path('vendor/workflow-canvas/js/workflow-canvas.js'));
    }
}
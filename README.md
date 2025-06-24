# Laravel Workflow Canvas

A visual workflow builder and canvas component for Laravel applications. Built on top of the React Wrapper package, providing a drag-and-drop interface for creating complex workflows.

## Features

- 🎨 **Visual Workflow Builder** - Drag-and-drop interface for building workflows
- 🔗 **Node-based System** - Trigger, Condition, Transform, and Analytics nodes
- 📊 **Real-time Preview** - Live workflow execution preview
- 💾 **Auto-save** - Automatic saving of workflow changes
- 🔄 **State Management** - Advanced state management with persistence
- 🎯 **Type Safe** - Full TypeScript support
- 🖥️ **Fullscreen Mode** - Expandable canvas for complex workflows
- 🔍 **Validation** - Built-in workflow validation and error detection
- 📱 **Responsive** - Works on desktop and tablet devices

## Installation

### Option 1: Using as Distributed Packages (Recommended)

```bash
composer require hadyfayed/filament-workflow-canvas
npm install @hadyfayed/filament-workflow-canvas
```

**Dependencies:**

This package requires the React Wrapper as a base:

```bash
composer require hadyfayed/filament-react-wrapper
npm install @hadyfayed/filament-react-wrapper
```

### Option 2: Using as Local Development Packages

```bash
# Copy package files to your resources directory
cp -r packages/react-wrapper/resources/js/* resources/js/react-wrapper/
cp -r packages/workflow-canvas/resources/js/* resources/js/workflow-canvas/
```

### Setup

Publish the configuration files:

```bash
php artisan vendor:publish --tag=workflow-canvas-config
```

Publish the assets:

```bash
php artisan vendor:publish --tag=workflow-canvas-assets
```

Run the migrations:

```bash
php artisan migrate
```

### Vite Configuration (Standard Laravel Approach)

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/bootstrap-react.tsx'
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
```

### Bootstrap Configuration

For distributed packages:
```tsx
// resources/js/bootstrap-react.tsx
import React from 'react';

// Initialize the React wrapper core system
import '@hadyfayed/filament-react-wrapper/bootstrap';

// Initialize workflow canvas components
import '@hadyfayed/filament-workflow-canvas/bootstrap';

console.log('React Wrapper and Workflow Canvas bootstrapped for Filament integration');

export default function bootstrap() {
    return true;
}
```

For local development:
```tsx
// resources/js/bootstrap-react.tsx
import React from 'react';

// Initialize the React wrapper core system
import './react-wrapper/core';

// Initialize workflow canvas components
import './workflow-canvas/index';

console.log('React Wrapper and Workflow Canvas bootstrapped for Filament integration');

export default function bootstrap() {
    return true;
}
```

## Basic Usage

### Blade Component

```blade
<x-workflow-canvas::workflow-canvas 
    :workflow="$workflow"
    :readonly="false"
    height="600px"
    state-path="workflow.canvas_data"
/>
```

### Livewire Integration

```php
use HadyFayed\WorkflowCanvas\Models\Workflow;

class WorkflowBuilder extends Component
{
    public Workflow $workflow;
    public array $canvasData = [];
    
    public function mount(Workflow $workflow)
    {
        $this->workflow = $workflow;
        $this->canvasData = $workflow->canvas_data ?? [];
    }
    
    public function updatedCanvasData()
    {
        $this->workflow->update(['canvas_data' => $this->canvasData]);
    }
    
    public function render()
    {
        return view('livewire.workflow-builder');
    }
}
```

```blade
<!-- livewire.workflow-builder.blade.php -->
<div>
    <x-workflow-canvas::workflow-canvas 
        :workflow="$workflow"
        state-path="canvasData"
    />
</div>
```

### Filament Integration

```php
use Filament\Forms\Components\ViewComponent;
use HadyFayed\WorkflowCanvas\WorkflowCanvasComponent;

ViewComponent::make('workflow-canvas')
    ->view('workflow-canvas::workflow-canvas')
    ->viewData(fn ($record) => [
        'component' => 'WorkflowCanvas',
        'props' => [
            'initialData' => $record->canvas_data,
            'nodeTypes' => config('workflow-canvas.node_types'),
        ],
        'statePath' => 'canvas_data',
    ])
```

## Node Types

The package comes with four built-in node types:

### Trigger Nodes
- Entry points for workflows
- Support event, webhook, schedule, and manual triggers
- Configuration options for event types and filters

### Condition Nodes  
- Filter data based on configurable conditions
- Support multiple operators (equals, contains, exists, etc.)
- AND/OR logic for multiple conditions

### Transform Nodes
- Modify and map data between workflow steps
- Support field mapping, JavaScript code, and templates
- Built-in transformations (uppercase, lowercase, hash, base64)

### Analytics Driver Nodes
- Send data to analytics platforms
- Support for GA4, Meta Pixel, Mixpanel, and more
- Configurable async processing and error handling

## Configuration

Customize the workflow canvas in `config/workflow-canvas.php`:

```php
return [
    'canvas' => [
        'default_height' => '600px',
        'fullscreen_enabled' => true,
        'auto_save' => true,
        'auto_save_delay' => 500,
    ],
    
    'node_types' => [
        'trigger' => [
            'label' => 'Trigger',
            'icon' => '⚡',
            'color' => 'blue',
            'processor' => TriggerProcessor::class,
        ],
        // ... more node types
    ],
    
    'validation' => [
        'max_nodes' => 100,
        'max_connections' => 200,
        'required_trigger' => true,
        'prevent_cycles' => true,
    ],
];
```

## Custom Node Types

Create custom node types by extending the base processor:

```php
use HadyFayed\WorkflowCanvas\Processors\BaseNodeProcessor;

class CustomProcessor extends BaseNodeProcessor
{
    public function process(mixed $node, array $inputData, WorkflowExecution $execution): array
    {
        // Your custom processing logic
        return $outputData;
    }
    
    public function getConfigSchema(): array
    {
        return [
            'custom_field' => [
                'type' => 'text',
                'label' => 'Custom Field',
                'required' => true,
            ],
        ];
    }
}
```

Register the custom node type:

```php
// config/workflow-canvas.php
'node_types' => [
    'custom' => [
        'label' => 'Custom Node',
        'icon' => '⭐',
        'color' => 'purple',
        'processor' => CustomProcessor::class,
    ],
],
```

## Workflow Execution

Execute workflows programmatically:

```php
use HadyFayed\WorkflowCanvas\Services\WorkflowExecutionService;

$executionService = app(WorkflowExecutionService::class);
$result = $executionService->execute($workflow, $inputData);

if ($result->isSuccessful()) {
    $outputData = $result->getOutputData();
} else {
    $errors = $result->getErrors();
}
```

## Events

The package dispatches several events during workflow execution:

```php
use HadyFayed\WorkflowCanvas\Events\WorkflowStarted;
use HadyFayed\WorkflowCanvas\Events\WorkflowCompleted;
use HadyFayed\WorkflowCanvas\Events\WorkflowFailed;

// Listen for workflow events
Event::listen(WorkflowStarted::class, function ($event) {
    Log::info('Workflow started', ['workflow_id' => $event->workflow->id]);
});
```

## API Reference

### Workflow Model

```php
$workflow = Workflow::create([
    'name' => 'My Workflow',
    'description' => 'A sample workflow',
    'canvas_data' => $canvasData,
    'is_active' => true,
]);

// Validate workflow structure
$errors = $workflow->validate();

// Duplicate workflow
$copy = $workflow->duplicate('New Name');

// Check for cycles
$hasCycles = $workflow->hasCycles();
```

### Canvas Component Props

```php
WorkflowCanvasComponent::make(
    workflow: $workflow,
    readonly: false,
    height: '800px',
    statePath: 'canvas_data'
)
```

## Development

### Package Development

When developing the packages locally:

```bash
# In the package directory
cd packages/workflow-canvas
npm install
npm run build  # Build distributable package

# Copy to main app for testing
cd ../../
cp -r packages/workflow-canvas/resources/js/* resources/js/workflow-canvas/
```

### TypeScript Compilation

```bash
# Check types in package
cd packages/workflow-canvas
npm run typecheck

# Build with type declarations
npm run build
```

### Main App Development

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### Testing

```bash
# Package tests
cd packages/workflow-canvas
composer test
npm test

# Main app tests
cd ../../
php artisan test
```

### Custom Node Development

Create custom nodes by extending the base components:

```tsx
// resources/js/components/CustomNode.tsx
import React from 'react';
import { NodeProps } from 'reactflow';

export default function CustomNode({ data }: NodeProps) {
    return (
        <div className="custom-node">
            <h3>{data.label}</h3>
            {/* Your custom UI */}
        </div>
    );
}
```

Register the custom node:

```tsx
// resources/js/bootstrap-react.tsx
import { componentRegistry } from './react-wrapper/core';
import CustomNode from './components/CustomNode';

componentRegistry.register({
    name: 'CustomNode',
    component: CustomNode,
    metadata: {
        category: 'custom',
        description: 'Custom workflow node'
    }
});
```

## License

MIT License. See [LICENSE](LICENSE) for details.
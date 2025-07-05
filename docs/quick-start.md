# Quick Start Guide

Get up and running with Workflow Canvas in under 10 minutes.

## Prerequisites

- Laravel project with Filament installed
- Node.js and npm/yarn installed
- Basic understanding of React

## Step 1: Installation

```bash
# Install the package
composer require hadyfayed/filament-workflow-canvas
npm install @hadyfayed/filament-workflow-canvas

# Run migrations
php artisan migrate
```

## Step 2: Basic Filament Setup

Add the plugin to your Filament panel:

```php
// app/Providers/Filament/AdminPanelProvider.php
use HadyFayed\FilamentWorkflowCanvas\FilamentWorkflowCanvasPlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        ->plugins([
            FilamentWorkflowCanvasPlugin::make(),
        ]);
}
```

## Step 3: Create Your First Workflow

### Using Filament Resource

1. Navigate to your Filament admin panel
2. Go to **Workflows** section
3. Click **New Workflow**
4. Give it a name: "My First Workflow"

### Using the Visual Builder

1. **Add a Trigger Node**:
   - Drag "Event Trigger" from the toolbar
   - Configure: Event Type = "page_view"

2. **Add a Transform Node** (optional):
   - Drag "Data Transform" node
   - Connect it to the trigger
   - Add transformation rules

3. **Add an Analytics Node**:
   - Drag "Analytics Event" node
   - Connect it to the previous node
   - Configure: Driver = "ga4"

4. **Save the Workflow**:
   - Click the save button
   - Your workflow is now active!

## Step 4: React Component Usage

### Basic Component

```jsx
import React from 'react';
import { WorkflowCanvas } from '@hadyfayed/filament-workflow-canvas';

function WorkflowBuilder() {
    const handleWorkflowChange = (workflowData) => {
        console.log('Workflow updated:', workflowData);
        // Save to your backend API
    };

    return (
        <div style={{ width: '100%', height: '600px' }}>
            <WorkflowCanvas
                initialData={null}
                readonly={false}
                showMinimap={true}
                showControls={true}
                autoSave={true}
                onDataChange={handleWorkflowChange}
            />
        </div>
    );
}

export default WorkflowBuilder;
```

### With Pre-loaded Data

```jsx
import React, { useState, useEffect } from 'react';
import { WorkflowCanvas } from '@hadyfayed/filament-workflow-canvas';

function ExistingWorkflowEditor({ workflowId }) {
    const [workflowData, setWorkflowData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load workflow from your API
        fetch(`/api/workflows/${workflowId}`)
            .then(response => response.json())
            .then(data => {
                setWorkflowData(data);
                setLoading(false);
            });
    }, [workflowId]);

    if (loading) return <div>Loading...</div>;

    return (
        <WorkflowCanvas
            initialData={workflowData}
            readonly={false}
            onDataChange={(data) => {
                // Auto-save changes
                fetch(`/api/workflows/${workflowId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            }}
        />
    );
}
```

## Step 5: Backend Integration

### Controller Example

```php
<?php

use HadyFayed\FilamentWorkflowCanvas\Models\Workflow;
use Illuminate\Http\Request;

class WorkflowController extends Controller
{
    public function store(Request $request)
    {
        $workflow = Workflow::create([
            'name' => $request->name,
            'description' => $request->description,
            'is_active' => true,
        ]);

        // Create nodes
        foreach ($request->nodes as $nodeData) {
            $workflow->nodes()->create([
                'type' => $nodeData['type'],
                'name' => $nodeData['name'],
                'config' => $nodeData['config'],
                'position' => $nodeData['position'],
                'is_enabled' => $nodeData['is_enabled'] ?? true,
            ]);
        }

        // Create connections
        foreach ($request->connections as $connectionData) {
            $workflow->connections()->create([
                'source_node_id' => $connectionData['source_node_id'],
                'target_node_id' => $connectionData['target_node_id'],
                'conditions' => $connectionData['conditions'] ?? [],
            ]);
        }

        return response()->json($workflow->load(['nodes', 'connections']));
    }

    public function execute(Workflow $workflow, Request $request)
    {
        $executionService = app(WorkflowExecutionService::class);
        
        $result = $executionService->execute($workflow, $request->all());
        
        return response()->json(['success' => true, 'result' => $result]);
    }
}
```

### API Routes

```php
// routes/api.php
Route::prefix('workflows')->group(function () {
    Route::get('/', [WorkflowController::class, 'index']);
    Route::post('/', [WorkflowController::class, 'store']);
    Route::get('/{workflow}', [WorkflowController::class, 'show']);
    Route::put('/{workflow}', [WorkflowController::class, 'update']);
    Route::post('/{workflow}/execute', [WorkflowController::class, 'execute']);
});
```

## Step 6: Testing Your Workflow

### Manual Testing

```bash
# Test workflow execution via artisan
php artisan workflow:execute 1 '{"event": "page_view", "url": "/home"}'
```

### Frontend Testing

```javascript
// Test the workflow canvas component
import { render, screen } from '@testing-library/react';
import { WorkflowCanvas } from '@hadyfayed/filament-workflow-canvas';

test('renders workflow canvas', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByText(/workflow/i)).toBeInTheDocument();
});
```

## Common Workflow Patterns

### 1. Simple Analytics Tracking

```
[Page View Trigger] → [Analytics Event (GA4)]
```

### 2. Conditional Analytics

```
[Button Click] → [Condition: User Type] → [Analytics Event (GA4/Mixpanel)]
                                       ↘ [Email Notification]
```

### 3. Data Transformation

```
[Form Submit] → [Transform: Add UTM] → [Analytics Event] → [Database Save]
```

## Next Steps

- [Learn about Node Types](./node-types.md) - Understand all available nodes
- [Visual Builder Guide](./visual-builder.md) - Master the drag & drop interface
- [Analytics Integration](./analytics-integration.md) - Connect to your analytics platforms
- [Custom Nodes](./custom-nodes.md) - Create your own node types

## Troubleshooting

### Component Not Rendering

```jsx
// Make sure to import ReactFlow styles
import 'reactflow/dist/style.css';

// Or in your CSS file
@import 'reactflow/dist/style.css';
```

### Backend Errors

```bash
# Clear cache
php artisan cache:clear
php artisan config:clear

# Re-run migrations
php artisan migrate:fresh
```

### Build Issues

```bash
# Clear and rebuild
npm run clean
npm run build
```

Need more help? Check our [troubleshooting guide](./troubleshooting.md) or [open an issue](https://github.com/hadyfayed/filament-workflow-canvas/issues).
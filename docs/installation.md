# Installation

Get started with Workflow Canvas in your Laravel application.

## Requirements

- **Laravel**: 10.x or 11.x
- **PHP**: 8.1 or higher
- **Node.js**: 18.x or higher
- **React**: 18.x or higher

## Installation Methods

### Method 1: Composer + NPM (Recommended)

#### 1. Install PHP Package

```bash
composer require hadyfayed/filament-workflow-canvas
```

#### 2. Install JavaScript Package

```bash
npm install @hadyfayed/filament-workflow-canvas
```

#### 3. Publish Configuration

```bash
php artisan vendor:publish --tag=workflow-canvas-config
```

#### 4. Run Migrations

```bash
php artisan migrate
```

### Method 2: Development Installation

For development or customization:

```bash
# Clone the repository
git clone https://github.com/hadyfayed/filament-workflow-canvas.git

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Build the package
npm run build
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Workflow Canvas Configuration
WORKFLOW_CANVAS_ENABLED=true
WORKFLOW_CANVAS_AUTO_SAVE=true
WORKFLOW_CANVAS_AUTO_SAVE_DELAY=2000

# Analytics Drivers (optional)
WORKFLOW_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
WORKFLOW_MIXPANEL_TOKEN=your_mixpanel_token
```

### Publishing Assets

If you need to customize the frontend components:

```bash
# Publish Blade views
php artisan vendor:publish --tag=workflow-canvas-views

# Publish JavaScript assets (for customization)
php artisan vendor:publish --tag=workflow-canvas-assets
```

## Framework Integration

### Laravel Setup

1. **Add Service Provider** (auto-discovered):
   ```php
   // config/app.php - only if auto-discovery disabled
   'providers' => [
       // ...
       HadyFayed\FilamentWorkflowCanvas\WorkflowCanvasServiceProvider::class,
   ],
   ```

2. **Register Filament Plugin**:
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

### React Integration

#### Basic React Setup

```jsx
import { WorkflowCanvas } from '@hadyfayed/filament-workflow-canvas';

function MyWorkflowBuilder() {
    return (
        <WorkflowCanvas
            initialData={null}
            readonly={false}
            showMinimap={true}
            onDataChange={(data) => console.log('Workflow changed:', data)}
        />
    );
}
```

#### With React Wrapper Integration

```jsx
import { StateManagerProvider } from '@hadyfayed/filament-react-wrapper';
import { WorkflowCanvas } from '@hadyfayed/filament-workflow-canvas';

function App() {
    return (
        <StateManagerProvider>
            <WorkflowCanvas
                autoSave={true}
                showControls={true}
            />
        </StateManagerProvider>
    );
}
```

## Verification

### Test PHP Installation

```bash
php artisan workflow-canvas:test
```

### Test Frontend Integration

```bash
npm run test
```

### Check Database

```sql
-- Verify tables were created
SHOW TABLES LIKE 'workflow%';

-- Should show:
-- workflows
-- workflow_nodes  
-- workflow_connections
-- workflow_executions
```

## Troubleshooting

### Common Issues

#### 1. Missing ReactFlow Styles

```bash
# Install ReactFlow if not already installed
npm install reactflow

# Import styles in your main CSS file
@import 'reactflow/dist/style.css';
```

#### 2. TypeScript Errors

```bash
# Install type definitions
npm install --save-dev @types/react @types/react-dom

# Add to tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

#### 3. Build Errors

```bash
# Clear build cache
npm run clean
npm run build

# Or with yarn
yarn clean
yarn build
```

#### 4. Permission Issues

```bash
# Fix storage permissions
sudo chown -R www-data:www-data storage/
sudo chmod -R 755 storage/
```

### Getting Help

- **Documentation**: [Full docs](./README.md)
- **Examples**: [Live examples](./examples/)
- **Issues**: [GitHub Issues](https://github.com/hadyfayed/filament-workflow-canvas/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hadyfayed/filament-workflow-canvas/discussions)

## Next Steps

- [Quick Start Guide](./quick-start.md) - Build your first workflow
- [Basic Usage](./basic-usage.md) - Learn core concepts
- [Node Types](./node-types.md) - Understand available node types
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Visual Workflow Canvas** package for FilamentPHP applications - a React-based drag-and-drop workflow builder that integrates seamlessly with Laravel and Filament. The package provides a complete workflow management system with visual node-based editing, real-time validation, and execution capabilities.

**Key Technologies**: React 18 + TypeScript + ReactFlow + Laravel + Filament + React Wrapper v3.0 + Vite

## Development Commands

### Package Building and Development
```bash
# Build the distributable package
npm run build

# Build Laravel-specific distribution
npm run build:laravel

# Build both distributions
npm run build:all

# Development with hot reload
npm run dev

# Build and watch for changes
npm run build:watch
```

### Code Quality and Testing
```bash
# Type checking
npm run typecheck

# Linting (auto-fix)
npm run lint

# Linting (check only)
npm run lint:check

# Code formatting
npm run format

# Format checking
npm run format:check

# Run all CI checks
npm run ci

# Testing
npm run test                # Run tests once
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
```

### PHP Integration Commands
```bash
# PHP tests (when used in Laravel context)
composer test

# Laravel setup commands
php artisan vendor:publish --tag=workflow-canvas-config
php artisan vendor:publish --tag=workflow-canvas-assets
php artisan migrate
```

## Architecture Overview

### Core Service Layer Pattern
The package follows a **service-oriented architecture** with dependency injection:

- **WorkflowManagerService**: Central workflow data management and persistence
- **NodeManagerService**: Node creation, validation, positioning, and lifecycle
- **ConnectionManagerService**: Connection validation, rules, and relationship management
- **ViewportManagerService**: Canvas viewport operations (zoom, pan, fit)
- **WorkflowEventService**: Event system for workflow actions and notifications
- **WorkflowPersistenceService**: Configurable persistence strategies (localStorage, memory, database)

### Component Architecture
```
components/
├── canvas/          # Core ReactFlow canvas components
├── controls/        # Viewport and workflow controls
├── properties/      # Node property panels and configuration
├── toolbar/         # Draggable node templates and actions  
├── providers/       # React Context providers and dependency injection
├── ui/             # Reusable UI components
└── layout/         # Layout and container components
```

### Node System
- **Node Types**: Trigger, Condition, Transform, Analytics (extensible)
- **Node Processors**: PHP backend processors for each node type
- **Node Templates**: Draggable templates in toolbar
- **Node Properties**: Dynamic configuration panels

### Data Flow
1. **Frontend**: React components manage UI state
2. **Service Layer**: Services handle business logic and persistence
3. **Backend**: Laravel/Filament handles server-side processing
4. **Database**: Workflow persistence with migrations

## Key Development Patterns

### React Wrapper v3.0 Integration Patterns

#### Form Field Integration
```php
use HadyFayed\WorkflowCanvas\Forms\Components\WorkflowCanvasField;

WorkflowCanvasField::make('canvas_data')
    ->reactive()
    ->lazy()
    ->enableAutoSave()
    ->showMinimap()
    ->enableFullscreen()
    ->nodeTypes(config('workflow-canvas.node_types'))
    ->onWorkflowChange(fn($state) => $this->processWorkflow($state));
```

#### Widget Integration
```php
use HadyFayed\WorkflowCanvas\Widgets\WorkflowStatsWidget;

class WorkflowStatsWidget extends ReactWidget
{
    protected string $componentName = 'WorkflowStatsWidget';
    
    public function getData(): array
    {
        return $this->getWorkflowStats();
    }
}
```

#### Variable Sharing (React Wrapper v3.0)
```php
// Share workflow data globally
app('react-wrapper.variables')->shareGlobal('workflowTypes', $nodeTypes);

// Share component-specific data
app('react-wrapper.variables')->shareToComponent(
    'WorkflowCanvas', 
    'canvasConfig', 
    config('workflow-canvas.defaults')
);
```

### Service Factory Pattern
Services are created through `WorkflowServiceFactory` which enables:
- Dependency injection configuration
- Multiple persistence strategy support
- Service composition and extension

### Provider Pattern
`WorkflowProvider` supplies services to components via React Context:
```tsx
const workflowManager = useWorkflowManager();
const nodeManager = useNodeManager();
```

### Component Composition
Components are designed for composition and reusability:
- Each component has a single responsibility
- Props-based configuration
- Consistent interface patterns

## File Organization

### Entry Points
- `resources/js/index.tsx` - Main package export and component registration
- `src/FilamentWorkflowCanvasPlugin.php` - Laravel/Filament integration
- `src/WorkflowCanvasServiceProvider.php` - Laravel service provider

### Core Directories
- `resources/js/components/` - React component library
- `resources/js/services/` - Business logic services
- `resources/js/factories/` - Service creation and configuration
- `resources/js/interfaces/` - TypeScript interfaces and contracts
- `resources/js/hooks/` - React hooks for common patterns
- `src/` - PHP backend classes and integration
- `database/migrations/` - Database schema for workflows

### Configuration
- `vite.config.js` - Main package build configuration
- `vite.laravel.config.js` - Laravel-specific build configuration
- `eslint.config.js` - ESLint configuration for TypeScript/React
- `vitest.config.ts` - Testing configuration with jsdom environment

## Testing Setup

The package uses **Vitest** with **React Testing Library**:
- Test files: `tests/**/*.{test,spec}.{ts,tsx}`
- Setup file: `tests/setup.ts` (mocks ResizeObserver, matchMedia)
- Environment: jsdom for React component testing
- Coverage: v8 provider with text, JSON, and HTML reports

## Build System

### Dual Build Configuration
1. **Package Build** (`vite.config.js`): Creates distributable ES modules
2. **Laravel Build** (`vite.laravel.config.js`): Laravel-specific assets

### External Dependencies
The package externalizes peer dependencies:
- `react`, `react-dom` - React runtime
- `reactflow` - Workflow canvas engine
- `@heroicons/react` - Icon system
- `uuid` - Unique ID generation
- `@hadyfayed/filament-react-wrapper` v3.0+ - Enterprise React-PHP bridge

### Code Splitting
Automatic chunking for optimal loading with React Wrapper v3.0 lazy loading:
- `workflow-core` - Core utilities and types
- `workflow-services` - Service layer
- `workflow-components` - Main components (lazy loaded)
- `workflow-interfaces` - Type definitions
- Smart dependency loading on component intersection

## React Wrapper v3.0 Best Practices

### Component Registration Pattern
Components are automatically registered with lazy loading and dependency management:
```typescript
// Bootstrap function uses React Wrapper v3.0 registry
registry.register('WorkflowCanvas', WorkflowCanvas, {
  lazy: true,
  preload: false,
  dependencies: ['reactflow', '@heroicons/react', 'uuid'],
  category: 'workflow',
});
```

### Form Field Best Practices
```php
// Always use reactive() for real-time updates
WorkflowCanvasField::make('canvas_data')
    ->reactive()  // Enables React-PHP state sync
    ->lazy()      // Loads component when visible
    ->validationRules(['array'])
    ->afterStateUpdated(fn($state) => $this->processWorkflow($state));
```

### Widget Development
```php
// Extend ReactWidget for dashboard components
class WorkflowStatsWidget extends ReactWidget
{
    protected string $componentName = 'WorkflowStatsWidget';
    
    protected function setUp(): void
    {
        $this->lazy()->refreshInterval(30);
    }
    
    public function getData(): array
    {
        return $this->getWorkflowStats(); // Data automatically shared
    }
}
```

### Asset Management
- Components load lazily when visible (intersection observer)
- Dependencies preloaded based on component requirements
- Automatic error boundaries and fallback UI
- Development mode uses Vite dev server integration

## Integration Notes

### React Wrapper v3.0 Direct Integration
This package uses `@hadyfayed/filament-react-wrapper` v3.0+ for **direct Filament integration**:
- **No plugin registration required** - Components work directly with Filament
- Enterprise-level React-PHP integration (90%+ function mapping)
- Smart asset loading and lazy component loading
- Automatic dependency resolution
- Advanced state management and variable sharing
- Service provider handles all registration automatically

### Filament Integration  
- **Direct integration** - No plugin registration needed
- Uses Filament's styling system (Tailwind CSS)
- Integrates with Filament forms and resources via ReactField
- Provides ReactWidget for dashboard widgets
- Components work immediately after package installation

### Laravel Integration
- Service provider auto-registration
- Database migrations for workflow data
- Queue job integration for async processing
- Event system for workflow lifecycle hooks
- React Wrapper v3.0 variable sharing service
- Asset management with lazy loading
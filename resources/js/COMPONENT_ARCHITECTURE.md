# Workflow Canvas Component Architecture

## Overview
The WorkflowCanvas package has been refactored following SOLID principles and component separation patterns. Each component now has a single responsibility and can be used independently.

## Component Structure

```
workflow-canvas/
├── components/
│   ├── providers/
│   │   ├── WorkflowProvider.tsx        # Dependency injection provider
│   │   └── index.ts
│   ├── canvas/
│   │   ├── WorkflowCore.tsx            # Core ReactFlow wrapper
│   │   ├── WorkflowBackground.tsx      # Configurable background
│   │   ├── WorkflowMiniMap.tsx         # Conditional minimap
│   │   ├── WorkflowAutoSave.tsx        # Auto-save logic
│   │   ├── WorkflowEventHandlers.tsx   # Drag & drop handlers
│   │   ├── EnhancedToolbar.tsx         # Service-aware toolbar
│   │   ├── RefactoredWorkflowCanvas.tsx # Main refactored canvas
│   │   └── index.ts
│   ├── controls/
│   │   ├── KeyboardShortcuts.tsx       # Keyboard event handling
│   │   └── index.ts
│   ├── layout/
│   │   ├── WorkflowLayout.tsx          # Layout container
│   │   └── index.ts
│   └── index.ts
├── services/                           # Business logic services
├── interfaces/                         # TypeScript contracts
├── factories/                          # Service factories
└── index.ts                           # Main exports
```

## Component Responsibilities

### Providers
- **WorkflowProvider**: Provides workflow services to child components via context
- **Hooks**: `useWorkflowServices`, `useWorkflowManager`, etc.

### Canvas Components
- **WorkflowCore**: Core ReactFlow wrapper with workflow-specific logic
- **WorkflowBackground**: Configurable background patterns and colors
- **WorkflowMiniMap**: Conditional minimap with customizable styling
- **WorkflowAutoSave**: Handles debounced auto-saving of workflow state
- **WorkflowEventHandlers**: Manages drag and drop event handling
- **EnhancedToolbar**: Service-aware toolbar with dynamic node types
- **RefactoredWorkflowCanvas**: Main component integrating all sub-components

### Controls
- **KeyboardShortcuts**: Handles all keyboard shortcuts and accessibility

### Layout
- **WorkflowLayout**: Provides consistent layout and fullscreen support

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
- Each component has one clear purpose
- Background rendering, minimap, auto-save, etc. are separate components
- Services handle specific business logic concerns

### Open/Closed Principle (OCP)
- Components are open for extension through props and composition
- New node types can be added without modifying existing components
- Service factory allows extending with new service implementations

### Liskov Substitution Principle (LSP)
- Interface implementations can be substituted without breaking functionality
- Different persistence strategies (localStorage, memory) are interchangeable

### Interface Segregation Principle (ISP)
- Focused interfaces for specific concerns (IWorkflowManager, INodeManager, etc.)
- Components only depend on interfaces they actually use

### Dependency Inversion Principle (DIP)
- Components depend on abstractions (interfaces) not concrete implementations
- Services are injected via provider pattern
- Factory pattern enables flexible service creation

## Usage Examples

### Basic Usage
```tsx
import { RefactoredWorkflowCanvas } from './workflow-canvas';

<RefactoredWorkflowCanvas
  initialData={workflowData}
  onDataChange={handleDataChange}
  showMinimap={true}
  autoSave={true}
/>
```

### Custom Service Configuration
```tsx
<RefactoredWorkflowCanvas
  serviceConfig={{
    persistenceType: 'localStorage',
    enableEvents: true
  }}
/>
```

### Using Individual Components
```tsx
import { 
  WorkflowProvider,
  WorkflowCore,
  WorkflowBackground,
  WorkflowMiniMap,
  KeyboardShortcuts
} from './workflow-canvas/components';

<WorkflowProvider>
  <WorkflowCore>
    <WorkflowBackground />
    <WorkflowMiniMap />
  </WorkflowCore>
  <KeyboardShortcuts onSave={handleSave} />
</WorkflowProvider>
```

## Benefits

1. **Maintainability**: Each component has a clear purpose and can be modified independently
2. **Testability**: Components can be tested in isolation with mocked dependencies
3. **Reusability**: Components can be used in different contexts and compositions
4. **Extensibility**: New features can be added without modifying existing code
5. **Type Safety**: Strong TypeScript interfaces ensure compile-time safety
6. **Performance**: Components can be optimized individually and support React.memo
7. **Accessibility**: Keyboard shortcuts and ARIA labels are handled consistently

## Migration Path

The original `WorkflowCanvas` is still available as `LegacyWorkflowCanvas` for backward compatibility. New applications should use `RefactoredWorkflowCanvas` which is exported as the default `WorkflowCanvas`.

```tsx
// Legacy (still works)
import LegacyWorkflowCanvas from './WorkflowCanvas';

// New (recommended)
import { WorkflowCanvas } from './workflow-canvas';
```
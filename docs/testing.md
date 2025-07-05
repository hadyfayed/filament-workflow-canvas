# Testing Guide

Comprehensive testing strategies and examples for Workflow Canvas.

## Testing Stack

- **Test Runner**: Vitest 3.2.4
- **Testing Library**: @testing-library/react 16.3.0
- **DOM Testing**: @testing-library/jest-dom 6.6.3
- **User Interactions**: @testing-library/user-event 14.6.1
- **Environment**: jsdom 26.1.0
- **Mocking**: Built-in Vitest mocks

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test WorkflowCanvas.test.tsx

# Run tests matching pattern
npm test -- --grep "workflow"
```

### CI Pipeline

```bash
# Complete CI pipeline (used in CI/CD)
npm run ci
# Runs: typecheck → lint:check → format:check → test
```

## Test Structure

### Test Organization

```
tests/
├── components/           # Component tests
│   └── WorkflowCanvas.test.tsx
├── utils/               # Utility function tests
│   └── workflow-utils.test.ts
├── setup.ts            # Test setup and mocks
└── __mocks__/          # Manual mocks (optional)
```

### Test Categories

1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: Component interactions
3. **Utility Tests**: Helper functions and utilities
4. **E2E Tests**: Complete user workflows (future)

## Component Testing

### Basic Component Test

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../../resources/js/components/ui/Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Complex Component Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkflowCanvas } from '../../resources/js/components/canvas/WorkflowCanvas';

// Mock ReactFlow since it requires DOM APIs
vi.mock('reactflow', () => ({
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="reactflow-provider">{children}</div>,
  useReactFlow: () => ({
    screenToFlowPosition: vi.fn(() => ({ x: 100, y: 100 })),
    fitView: vi.fn(),
    setViewport: vi.fn(),
  }),
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
}));

// Mock React Wrapper
vi.mock('@hadyfayed/filament-react-wrapper', () => ({
  StateManagerProvider: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="state-provider">{children}</div>,
  useStatePath: (key: string, defaultValue: any) => [defaultValue, vi.fn()],
  useStateManager: () => ({ setState: vi.fn() }),
}));

describe('WorkflowCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<WorkflowCanvas />);
    expect(screen.getByTestId('state-provider')).toBeInTheDocument();
  });

  it('accepts readonly prop', () => {
    render(<WorkflowCanvas readonly={true} />);
    expect(screen.getByTestId('state-provider')).toBeInTheDocument();
  });

  it('handles data changes', async () => {
    const handleDataChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <WorkflowCanvas 
        onDataChange={handleDataChange}
        initialData={{
          nodes: [],
          connections: [],
          viewport: { x: 0, y: 0, zoom: 1 }
        }}
      />
    );

    // Test data change interaction
    // Note: Actual implementation would depend on the component's interface
  });
});
```

## Utility Testing

### Function Testing

```typescript
import { describe, it, expect } from 'vitest';
import {
  validateWorkflowData,
  createWorkflowNode,
  createWorkflowConnection,
  hasWorkflowCycles,
  validateWorkflow
} from '../../resources/js/utils';

describe('Workflow Utils', () => {
  describe('validateWorkflowData', () => {
    it('validates correct workflow data', () => {
      const validData = {
        nodes: [],
        connections: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      };
      expect(validateWorkflowData(validData)).toBe(true);
    });

    it('rejects invalid workflow data', () => {
      expect(validateWorkflowData(null)).toBe(false);
      expect(validateWorkflowData({})).toBe(false);
      expect(validateWorkflowData({ nodes: 'invalid' })).toBe(false);
    });
  });

  describe('createWorkflowNode', () => {
    it('creates a node with default name', () => {
      const node = createWorkflowNode('action', { x: 100, y: 200 });
      
      expect(node.type).toBe('action');
      expect(node.position).toEqual({ x: 100, y: 200 });
      expect(node.name).toBe('Action Node');
      expect(node.label).toBe('Action Node');
      expect(node.is_enabled).toBe(true);
      expect(node.id).toMatch(/^node_/);
    });

    it('creates a node with custom name', () => {
      const node = createWorkflowNode('trigger', { x: 0, y: 0 }, 'My Trigger');
      expect(node.name).toBe('My Trigger');
      expect(node.label).toBe('My Trigger');
    });
  });

  describe('hasWorkflowCycles', () => {
    it('detects no cycles in linear workflow', () => {
      const data = {
        nodes: [
          { id: 'a', type: 'trigger', name: 'A', label: 'A', config: {}, position: { x: 0, y: 0 }, is_enabled: true },
          { id: 'b', type: 'action', name: 'B', label: 'B', config: {}, position: { x: 0, y: 0 }, is_enabled: true }
        ],
        connections: [
          { source_node_id: 'a', target_node_id: 'b', conditions: {} }
        ],
        viewport: { x: 0, y: 0, zoom: 1 }
      };
      
      expect(hasWorkflowCycles(data)).toBe(false);
    });

    it('detects cycles in circular workflow', () => {
      const data = {
        nodes: [
          { id: 'a', type: 'trigger', name: 'A', label: 'A', config: {}, position: { x: 0, y: 0 }, is_enabled: true },
          { id: 'b', type: 'action', name: 'B', label: 'B', config: {}, position: { x: 0, y: 0 }, is_enabled: true }
        ],
        connections: [
          { source_node_id: 'a', target_node_id: 'b', conditions: {} },
          { source_node_id: 'b', target_node_id: 'a', conditions: {} }
        ],
        viewport: { x: 0, y: 0, zoom: 1 }
      };
      
      expect(hasWorkflowCycles(data)).toBe(true);
    });
  });
});
```

## Mocking Strategies

### Setup File (tests/setup.ts)

```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock global objects
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### ReactFlow Mocking

```typescript
// Mock ReactFlow for component tests
vi.mock('reactflow', () => ({
  default: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="reactflow">{children}</div>,
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="reactflow-provider">{children}</div>,
  useReactFlow: () => ({
    screenToFlowPosition: vi.fn(() => ({ x: 100, y: 100 })),
    fitView: vi.fn(),
    setViewport: vi.fn(),
    getNodes: vi.fn(() => []),
    getEdges: vi.fn(() => []),
  }),
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
  SelectionMode: {
    Partial: 'partial',
    Full: 'full',
  },
  addEdge: vi.fn(),
  BackgroundVariant: {
    Dots: 'dots',
    Lines: 'lines',
    Cross: 'cross',
  },
  Panel: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="reactflow-panel">{children}</div>,
  MiniMap: () => <div data-testid="reactflow-minimap" />,
  Controls: () => <div data-testid="reactflow-controls" />,
  Background: () => <div data-testid="reactflow-background" />,
}));
```

### Service Mocking

```typescript
// Mock workflow services
vi.mock('../../resources/js/services/WorkflowManagerService', () => ({
  WorkflowManagerService: vi.fn().mockImplementation(() => ({
    saveWorkflow: vi.fn(),
    loadWorkflow: vi.fn(),
    validateWorkflow: vi.fn(() => true),
    exportWorkflow: vi.fn(),
  }))
}));
```

### API Mocking

```typescript
// Mock fetch for API calls
global.fetch = vi.fn();

const mockFetch = (data: any) => {
  (fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
};

// Usage in tests
it('loads workflow data from API', async () => {
  const mockData = { nodes: [], connections: [] };
  mockFetch(mockData);
  
  // Test component that makes API call
  render(<WorkflowLoader workflowId="123" />);
  
  expect(fetch).toHaveBeenCalledWith('/api/workflows/123');
});
```

## Test Patterns

### Arrange-Act-Assert

```typescript
it('calculates total correctly', () => {
  // Arrange
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(35);
});
```

### Given-When-Then

```typescript
it('should show error when invalid data is submitted', async () => {
  // Given
  const user = userEvent.setup();
  render(<WorkflowForm />);
  
  // When
  await user.type(screen.getByLabelText(/name/i), ''); // Invalid: empty name
  await user.click(screen.getByRole('button', { name: /save/i }));
  
  // Then
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
});
```

### Test Data Builders

```typescript
// Test data builder
const createWorkflowData = (overrides = {}) => ({
  id: 1,
  name: 'Test Workflow',
  nodes: [],
  connections: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  ...overrides,
});

// Usage
it('renders workflow with custom name', () => {
  const workflow = createWorkflowData({ name: 'Custom Workflow' });
  render(<WorkflowCanvas initialData={workflow} />);
  expect(screen.getByText('Custom Workflow')).toBeInTheDocument();
});
```

## Coverage Guidelines

### Coverage Targets

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

### What to Test

✅ **Do Test:**
- Public API behavior
- User interactions
- Error handling
- Edge cases
- Business logic
- Integration points

❌ **Don't Test:**
- Implementation details
- Third-party libraries
- Trivial getters/setters
- CSS styles (use visual testing)

### Coverage Commands

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html

# Coverage with specific threshold
npm run test:coverage -- --coverage.thresholds.statements=80
```

## Performance Testing

### Component Performance

```typescript
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';

it('renders large workflow efficiently', () => {
  const largeWorkflow = createWorkflowData({
    nodes: Array.from({ length: 1000 }, (_, i) => createNode(`node-${i}`))
  });
  
  const start = performance.now();
  render(<WorkflowCanvas initialData={largeWorkflow} />);
  const end = performance.now();
  
  expect(end - start).toBeLessThan(100); // Should render in under 100ms
});
```

### Memory Leak Testing

```typescript
it('cleans up resources on unmount', () => {
  const { unmount } = render(<WorkflowCanvas />);
  
  // Add listeners/timers/subscriptions check
  const initialListeners = process.listenerCount('unhandledRejection');
  
  unmount();
  
  const finalListeners = process.listenerCount('unhandledRejection');
  expect(finalListeners).toBe(initialListeners);
});
```

## Debugging Tests

### Debug Utilities

```typescript
import { screen, logRoles } from '@testing-library/react';

it('debug test', () => {
  render(<MyComponent />);
  
  // Log all available roles
  logRoles(screen.getByTestId('container'));
  
  // Debug specific element
  screen.debug(screen.getByRole('button'));
  
  // Debug entire document
  screen.debug();
});
```

### VS Code Integration

```json
// .vscode/launch.json
{
  "configurations": [
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Best Practices

### Test Organization

1. **Descriptive Names**: Use clear, descriptive test names
2. **Single Assertion**: One logical assertion per test
3. **Test Isolation**: Tests should not depend on each other
4. **Setup/Teardown**: Use beforeEach/afterEach for common setup

### User-Centric Testing

1. **Query by Role**: Use `getByRole` over `getByTestId`
2. **User Actions**: Use `@testing-library/user-event`
3. **Accessible Queries**: Test accessibility with proper queries
4. **Real Interactions**: Test how users actually interact

### Maintenance

1. **Refactor Tests**: Keep tests clean and maintainable
2. **Update with Code**: Update tests when code changes
3. **Remove Dead Tests**: Delete tests for removed features
4. **Documentation**: Document complex test scenarios

## Continuous Integration

### GitHub Actions (Future)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

For more testing examples, see our [test files](../tests/) and component test files.
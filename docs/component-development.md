# Component Development

Learn how to develop and test components using our development tools.

## Development Setup

### Prerequisites

```bash
# Clone the repository
git clone https://github.com/hadyfayed/filament-workflow-canvas.git
cd filament-workflow-canvas/packages/workflow-canvas

# Install dependencies
npm install

# Start development environment
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev                 # Build with watch mode
npm run build              # Production build
npm run build:watch        # Build with watch mode

# Testing
npm run test               # Run tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage

# Quality Assurance
npm run typecheck          # TypeScript type checking
npm run lint               # ESLint linting
npm run lint:check         # ESLint without fixes
npm run format             # Prettier formatting
npm run format:check       # Prettier format check
npm run ci                 # Complete CI pipeline

# Documentation
npm run build              # Build for production
```

## Component Development

### Component Testing

Use our comprehensive testing setup to validate components:

```bash
# Run component tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Component Documentation

Create comprehensive tests for your components to serve as living documentation:

```typescript
// MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders with different variants', () => {
    render(<MyComponent variant="primary">Primary</MyComponent>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });

  it('handles interactions', async () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick}>Click me</MyComponent>);
    
    await fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Component Architecture

### Component Structure

```
resources/js/components/
├── ui/                     # Basic UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Button.test.tsx
├── canvas/                 # Canvas-specific components
│   ├── WorkflowCanvas.tsx
│   ├── WorkflowCore.tsx
│   └── WorkflowCanvas.test.tsx
├── toolbar/                # Toolbar components
├── properties/             # Property panel components
├── controls/               # Control components
└── providers/              # Context providers
```

### Component Guidelines

#### 1. TypeScript First

```typescript
// Always define proper interfaces
interface MyComponentProps {
  title: string;
  optional?: boolean;
  children?: React.ReactNode;
}

// Use React.FC with proper typing
export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  optional = false, 
  children 
}) => {
  return (
    <div>
      <h2>{title}</h2>
      {optional && <p>Optional content</p>}
      {children}
    </div>
  );
};
```

#### 2. Consistent Styling

```typescript
// Use CSS modules or consistent class naming
const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  const className = `${baseClasses} ${variantClasses[variant]}`;
  
  return <button className={className} {...props} />;
};
```

#### 3. Accessibility

```typescript
// Include proper ARIA attributes
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  disabled, 
  loading,
  ...props 
}) => {
  return (
    <button
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-label={loading ? 'Loading...' : undefined}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

#### 4. Memo Optimization

```typescript
// Use React.memo for performance
export const ExpensiveComponent = React.memo<ExpensiveComponentProps>(({ 
  data, 
  onUpdate 
}) => {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

## Testing Components

### Unit Tests

```typescript
// MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<MyComponent title="Test" onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies conditional styling', () => {
    render(<MyComponent title="Test" variant="primary" />);
    const element = screen.getByRole('button');
    expect(element).toHaveClass('bg-blue-600');
  });
});
```

### Integration Tests

```typescript
// WorkflowCanvas.integration.test.tsx
import { render, screen } from '@testing-library/react';
import { WorkflowCanvas } from './WorkflowCanvas';
import { WorkflowProvider } from '../providers/WorkflowProvider';

const TestWorkflowCanvas = (props) => (
  <WorkflowProvider>
    <WorkflowCanvas {...props} />
  </WorkflowProvider>
);

describe('WorkflowCanvas Integration', () => {
  it('renders with initial data', () => {
    const initialData = {
      nodes: [{ id: '1', type: 'trigger', /* ... */ }],
      connections: [],
      viewport: { x: 0, y: 0, zoom: 1 }
    };

    render(<TestWorkflowCanvas initialData={initialData} />);
    // Test integration behavior
  });
});
```

## Development Workflow

### 1. Create Component

```bash
# Create component file
touch resources/js/components/ui/NewComponent.tsx

# Create test file
touch tests/components/NewComponent.test.tsx
```

### 2. Implement Component

```typescript
// NewComponent.tsx
export interface NewComponentProps {
  // Define props
}

export const NewComponent: React.FC<NewComponentProps> = (props) => {
  // Implement component
};
```

### 3. Write Tests

```typescript
// NewComponent.test.tsx
describe('NewComponent', () => {
  it('renders correctly', () => {
    // Test implementation
  });
});
```

### 4. Documentation

Update relevant documentation:
- Add to component index
- Update API documentation
- Add usage examples

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Use composition patterns
3. **Props Interface**: Always define clear TypeScript interfaces
4. **Default Props**: Provide sensible defaults
5. **Error Boundaries**: Handle errors gracefully

### Performance

1. **React.memo**: Use for expensive components
2. **useCallback**: Memoize event handlers
3. **useMemo**: Memoize expensive calculations
4. **Code Splitting**: Use dynamic imports for large components

### Accessibility

1. **ARIA Labels**: Include proper ARIA attributes
2. **Keyboard Navigation**: Support keyboard interaction
3. **Focus Management**: Handle focus properly
4. **Screen Readers**: Test with screen readers

### Testing

1. **Test Behavior**: Test what the component does, not how
2. **User Perspective**: Write tests from user perspective
3. **Edge Cases**: Test error states and edge cases
4. **Integration Testing**: Test component interactions

## Debugging

### React Developer Tools

```bash
# Install React DevTools browser extension
# Use React Profiler for performance debugging
```

### Console Debugging

```typescript
// Use environment-based logging
const debug = process.env.NODE_ENV === 'development';

export const MyComponent = (props) => {
  if (debug) {
    console.log('MyComponent props:', props);
  }
  
  // Component implementation
};
```

## Contributing

1. **Follow Guidelines**: Adhere to component guidelines
2. **Write Tests**: Include comprehensive tests
3. **Document Changes**: Update documentation
4. **Review Process**: Submit PRs for review

For more information, see our [Contributing Guide](../CONTRIBUTING.md).
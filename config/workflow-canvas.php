<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Canvas Settings
    |--------------------------------------------------------------------------
    |
    | These settings control the default behavior of the workflow canvas.
    |
    */
    'canvas' => [
        'default_height' => env('WORKFLOW_CANVAS_HEIGHT', '600px'),
        'fullscreen_enabled' => env('WORKFLOW_CANVAS_FULLSCREEN', true),
        'auto_save' => env('WORKFLOW_CANVAS_AUTO_SAVE', true),
        'auto_save_delay' => env('WORKFLOW_CANVAS_AUTO_SAVE_DELAY', 500), // milliseconds
    ],

    /*
    |--------------------------------------------------------------------------
    | Node Types Configuration
    |--------------------------------------------------------------------------
    |
    | Define the available node types and their default configurations.
    |
    */
    'node_types' => [
        'trigger' => [
            'label' => 'Trigger',
            'icon' => '⚡',
            'color' => 'blue',
            'category' => 'input',
            'has_input' => false,
            'has_output' => true,
            'processor' => \HadyFayed\WorkflowCanvas\NodeProcessors\TriggerProcessor::class,
            'extensions' => [],
        ],
        'condition' => [
            'label' => 'Condition',
            'icon' => '🔍',
            'color' => 'yellow',
            'category' => 'logic',
            'has_input' => true,
            'has_output' => true,
            'processor' => \HadyFayed\WorkflowCanvas\NodeProcessors\ConditionProcessor::class,
            'extensions' => [],
        ],
        'transform' => [
            'label' => 'Transform',
            'icon' => '🔄',
            'color' => 'purple',
            'category' => 'processing',
            'has_input' => true,
            'has_output' => true,
            'processor' => \HadyFayed\WorkflowCanvas\NodeProcessors\TransformProcessor::class,
            'extensions' => [],
        ],
        'analytics_driver' => [
            'label' => 'Analytics',
            'icon' => '📊',
            'color' => 'green',
            'category' => 'output',
            'has_input' => true,
            'has_output' => false,
            'processor' => \HadyFayed\WorkflowCanvas\NodeProcessors\AnalyticsDriverProcessor::class,
            'extensions' => [],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Database Configuration
    |--------------------------------------------------------------------------
    |
    | Configure the database tables and models used by the workflow system.
    |
    */
    'database' => [
        'tables' => [
            'workflows' => 'workflows',
            'workflow_nodes' => 'workflow_nodes',
            'workflow_connections' => 'workflow_connections',
            'workflow_executions' => 'workflow_executions',
        ],
        'models' => [
            'workflow' => \HadyFayed\WorkflowCanvas\Models\Workflow::class,
            'workflow_node' => \HadyFayed\WorkflowCanvas\Models\WorkflowNode::class,
            'workflow_connection' => \HadyFayed\WorkflowCanvas\Models\WorkflowConnection::class,
            'workflow_execution' => \HadyFayed\WorkflowCanvas\Models\WorkflowExecution::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Execution Configuration
    |--------------------------------------------------------------------------
    |
    | Settings for workflow execution and processing.
    |
    */
    'execution' => [
        'default_queue' => env('WORKFLOW_QUEUE', 'default'),
        'timeout' => env('WORKFLOW_TIMEOUT', 300), // seconds
        'max_retries' => env('WORKFLOW_MAX_RETRIES', 3),
        'enable_logging' => env('WORKFLOW_LOGGING', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Validation Rules
    |--------------------------------------------------------------------------
    |
    | Validation rules for workflow components.
    |
    */
    'validation' => [
        'max_nodes' => env('WORKFLOW_MAX_NODES', 100),
        'max_connections' => env('WORKFLOW_MAX_CONNECTIONS', 200),
        'max_canvas_size' => env('WORKFLOW_MAX_CANVAS_SIZE', 1024 * 1024), // 1MB
        'required_trigger' => true,
        'prevent_cycles' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | UI Customization
    |--------------------------------------------------------------------------
    |
    | Customize the appearance and behavior of the workflow canvas UI.
    |
    */
    'ui' => [
        'theme' => env('WORKFLOW_THEME', 'default'),
        'show_minimap' => env('WORKFLOW_SHOW_MINIMAP', true),
        'show_controls' => env('WORKFLOW_SHOW_CONTROLS', true),
        'show_background' => env('WORKFLOW_SHOW_BACKGROUND', true),
        'background_variant' => env('WORKFLOW_BACKGROUND_VARIANT', 'dots'), // dots, lines, cross
        'selection_mode' => env('WORKFLOW_SELECTION_MODE', 'partial'), // partial, full
        'properties_panel_width' => env('WORKFLOW_PROPERTIES_WIDTH', '384px'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Extensions and Plugins
    |--------------------------------------------------------------------------
    |
    | Configure extensibility features and plugin system.
    |
    */
    'extensions' => [
        'auto_discovery' => env('WORKFLOW_AUTO_DISCOVER_EXTENSIONS', true),
        'discovery_paths' => [
            'app/WorkflowExtensions',
            'vendor/*/src/WorkflowExtensions',
        ],
        'enabled' => [
            // Add extension names here
        ],
        'disabled' => [
            // Add extension names here to disable them
        ],
        'node_processors' => [
            'custom_discovery' => env('WORKFLOW_DISCOVER_PROCESSORS', true),
            'paths' => [
                'app/WorkflowProcessors',
                'vendor/*/src/WorkflowProcessors',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Event System
    |--------------------------------------------------------------------------
    |
    | Configure the workflow event system for extensibility.
    |
    */
    'events' => [
        'enabled' => env('WORKFLOW_EVENTS_ENABLED', true),
        'listeners' => [
            'workflow.created' => [],
            'workflow.updated' => [],
            'workflow.deleted' => [],
            'workflow.execution.started' => [],
            'workflow.execution.completed' => [],
            'workflow.execution.failed' => [],
            'node.added' => [],
            'node.removed' => [],
            'connection.created' => [],
            'connection.removed' => [],
        ],
        'middleware' => [
            'global' => [],
            'execution' => [],
            'validation' => [],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    |
    | Configure API endpoints and external integrations.
    |
    */
    'api' => [
        'enabled' => env('WORKFLOW_API_ENABLED', true),
        'prefix' => env('WORKFLOW_API_PREFIX', 'api/workflows'),
        'middleware' => ['api', 'auth:sanctum'],
        'rate_limiting' => [
            'enabled' => env('WORKFLOW_API_RATE_LIMIT', true),
            'max_attempts' => env('WORKFLOW_API_MAX_ATTEMPTS', 60),
            'decay_minutes' => env('WORKFLOW_API_DECAY_MINUTES', 1),
        ],
        'webhooks' => [
            'enabled' => env('WORKFLOW_WEBHOOKS_ENABLED', false),
            'secret' => env('WORKFLOW_WEBHOOK_SECRET'),
            'endpoints' => [],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance and Caching
    |--------------------------------------------------------------------------
    |
    | Performance optimization settings.
    |
    */
    'performance' => [
        'cache' => [
            'enabled' => env('WORKFLOW_CACHE_ENABLED', true),
            'driver' => env('WORKFLOW_CACHE_DRIVER', 'file'),
            'ttl' => env('WORKFLOW_CACHE_TTL', 3600),
            'tags' => ['workflows', 'workflow-canvas'],
        ],
        'optimization' => [
            'lazy_load_nodes' => env('WORKFLOW_LAZY_LOAD_NODES', true),
            'compress_data' => env('WORKFLOW_COMPRESS_DATA', false),
            'batch_operations' => env('WORKFLOW_BATCH_OPERATIONS', true),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Settings
    |--------------------------------------------------------------------------
    |
    | Security-related configuration for workflow execution.
    |
    */
    'security' => [
        'enable_javascript_nodes' => env('WORKFLOW_ENABLE_JS', false),
        'javascript_timeout' => env('WORKFLOW_JS_TIMEOUT', 5000), // milliseconds
        'max_execution_time' => env('WORKFLOW_MAX_EXECUTION_TIME', 300), // seconds
        'allowed_hosts' => env('WORKFLOW_ALLOWED_HOSTS', '*'),
        'sandbox_mode' => env('WORKFLOW_SANDBOX_MODE', true),
        'allowed_functions' => [
            // PHP functions allowed in custom nodes
        ],
        'blocked_functions' => [
            'exec', 'system', 'shell_exec', 'passthru',
            'file_get_contents', 'file_put_contents',
        ],
    ],
];
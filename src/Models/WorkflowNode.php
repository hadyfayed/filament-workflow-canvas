<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * WorkflowNode model representing individual nodes in a workflow.
 *
 * @property int $workflow_id
 * @property string $node_id
 * @property string $type
 * @property string $name
 * @property string $description
 * @property array $config
 * @property array $position
 * @property int $order
 * @property bool $is_enabled
 */
class WorkflowNode extends Model
{
    use HasFactory;

    protected $fillable = [
        'workflow_id',
        'node_id',
        'type',
        'name',
        'description',
        'config',
        'position',
        'order',
        'is_enabled',
    ];

    protected $casts = [
        'config' => 'array',
        'position' => 'array',
        'is_enabled' => 'boolean',
        'order' => 'integer',
    ];

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(Workflow::class);
    }

    public function outgoingConnections(): HasMany
    {
        return $this->hasMany(WorkflowConnection::class, 'source_node_id', 'node_id')
            ->where('workflow_id', $this->workflow_id);
    }

    public function incomingConnections(): HasMany
    {
        return $this->hasMany(WorkflowConnection::class, 'target_node_id', 'node_id')
            ->where('workflow_id', $this->workflow_id);
    }

    public function isTrigger(): bool
    {
        return $this->type === 'trigger';
    }

    public function isAnalyticsDriver(): bool
    {
        return $this->type === 'analytics_driver';
    }

    public function getNextNodes(): array
    {
        return $this->outgoingConnections
            ->map(fn($connection) => $connection->targetNode)
            ->filter()
            ->toArray();
    }
} 
<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * WorkflowConnection model representing connections between workflow nodes.
 *
 * @property int $workflow_id
 * @property string $source_node_id
 * @property string $source_anchor
 * @property string $target_node_id
 * @property string $target_anchor
 * @property array $config
 */
class WorkflowConnection extends Model
{
    use HasFactory;

    protected $fillable = [
        'workflow_id',
        'source_node_id',
        'source_anchor',
        'target_node_id',
        'target_anchor',
        'config',
    ];

    protected $casts = [
        'config' => 'array',
    ];

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(Workflow::class);
    }

    public function sourceNode(): BelongsTo
    {
        return $this->belongsTo(WorkflowNode::class, 'source_node_id', 'node_id')
            ->where('workflow_id', $this->workflow_id);
    }

    public function targetNode(): BelongsTo
    {
        return $this->belongsTo(WorkflowNode::class, 'target_node_id', 'node_id')
            ->where('workflow_id', $this->workflow_id);
    }

    public function hasConditions(): bool
    {
        return !empty($this->config['conditions']);
    }

    public function getConditions(): array
    {
        return $this->config['conditions'] ?? [];
    }
} 
<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

/**
 * Workflow model representing a visual workflow.
 *
 * @property string $name
 * @property string $description
 * @property string $status
 * @property array $settings
 * @property array $canvas_data
 * @property bool $is_enabled
 * @property \Carbon\Carbon $last_executed_at
 * @property int $execution_count
 * @property int $created_by
 */
class Workflow extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description', 
        'status',
        'settings',
        'canvas_data',
        'is_enabled',
        'last_executed_at',
        'execution_count',
        'created_by',
    ];

    protected $casts = [
        'settings' => 'array',
        'canvas_data' => 'array',
        'is_enabled' => 'boolean',
        'last_executed_at' => 'datetime',
        'execution_count' => 'integer',
    ];

    public function nodes(): HasMany
    {
        return $this->hasMany(WorkflowNode::class)->orderBy('order');
    }

    public function connections(): HasMany
    {
        return $this->hasMany(WorkflowConnection::class);
    }

    public function executions(): HasMany
    {
        return $this->hasMany(WorkflowExecution::class)->latest();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getLatestExecution(): ?WorkflowExecution
    {
        return $this->executions()->first();
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->is_enabled;
    }

    /**
     * Get trigger nodes from canvas data
     */
    public function getTriggerNodes(): array
    {
        $nodes = $this->canvas_data['nodes'] ?? [];
        return collect($nodes)->where('type', 'trigger')->toArray();
    }

    /**
     * Get trigger types used in this workflow
     */
    public function getTriggerTypes(): array
    {
        $triggerNodes = $this->getTriggerNodes();
        return collect($triggerNodes)
            ->pluck('config.trigger_type')
            ->filter()
            ->unique()
            ->values()
            ->toArray();
    }

    /**
     * Check if workflow has specific trigger type
     */
    public function hasTriggerType(string $type): bool
    {
        return in_array($type, $this->getTriggerTypes());
    }

    /**
     * Get primary trigger type (first one found)
     */
    public function getPrimaryTriggerType(): ?string
    {
        $types = $this->getTriggerTypes();
        return $types[0] ?? null;
    }
} 
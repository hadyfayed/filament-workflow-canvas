<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * WorkflowExecution model representing execution instances of workflows.
 *
 * @property int $workflow_id
 * @property string $status
 * @property array $input_data
 * @property array $output_data
 * @property array $execution_log
 * @property string $error_message
 * @property \Carbon\Carbon $started_at
 * @property \Carbon\Carbon $completed_at
 * @property int $duration_ms
 * @property string $trigger_source
 */
class WorkflowExecution extends Model
{
    use HasFactory;

    protected $fillable = [
        'workflow_id',
        'status',
        'input_data',
        'output_data',
        'execution_log',
        'error_message',
        'started_at',
        'completed_at',
        'duration_ms',
        'trigger_source',
    ];

    protected $casts = [
        'input_data' => 'array',
        'output_data' => 'array',
        'execution_log' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'duration_ms' => 'integer',
    ];

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(Workflow::class);
    }

    public function isRunning(): bool
    {
        return in_array($this->status, ['pending', 'running']);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function hasFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function addLogEntry(string $nodeId, string $message, array $data = []): void
    {
        $log = $this->execution_log ?? [];
        $log[] = [
            'timestamp' => now()->toISOString(),
            'node_id' => $nodeId,
            'message' => $message,
            'data' => $data,
        ];
        $this->execution_log = $log;
        $this->save();
    }

    public function markAsStarted(): void
    {
        $this->update([
            'status' => 'running',
            'started_at' => now(),
        ]);
    }

    public function markAsCompleted(array $outputData = []): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'output_data' => $outputData,
            'duration_ms' => $this->started_at ? now()->diffInMilliseconds($this->started_at) : null,
        ]);
    }

    public function markAsFailed(string $errorMessage): void
    {
        $this->update([
            'status' => 'failed',
            'completed_at' => now(),
            'error_message' => $errorMessage,
            'duration_ms' => $this->started_at ? now()->diffInMilliseconds($this->started_at) : null,
        ]);
    }
} 
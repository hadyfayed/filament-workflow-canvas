<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Jobs;

use HadyFayed\WorkflowCanvas\Contracts\AnalyticsDriverInterface;
use HadyFayed\WorkflowCanvas\Contracts\AnalyticsDriverProviderInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class DispatchAnalyticsEvent implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 5;
    public int $timeout = 60;
    public int $backoff = 120;

    private ?AnalyticsDriverInterface $driver;

    public function __construct(
        public string $driverName,
        public array $eventData
    ) {
        // Driver is resolved in handle method to ensure it's fresh in the queue worker
    }

    public function handle(AnalyticsDriverProviderInterface $driverProvider): void
    {
        $this->driver = $driverProvider->get($this->driverName);

        try {
            Log::info('📱 Dispatching event to driver: ' . $this->driverName, [
                'payload' => $this->eventData,
            ]);

            if (! $this->driver) {
                throw new RuntimeException("Driver '{$this->driverName}' not found or disabled.");
            }

            $success = $this->driver->sendEvent($this->eventData);

            if (! $success) {
                throw new RuntimeException("Driver '{$this->driverName}' failed to send event.");
            }

            Log::info('✅ Event dispatched via ' . $this->driverName . ' successfully.');
        } catch (Throwable $e) {
            Log::error('❌ Failed to dispatch event via ' . $this->driverName, [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function tags(): array
    {
        return ['analytics', "driver:{$this->driverName}"];
    }

    public function displayName(): string
    {
        return "DispatchAnalyticsEvent ({$this->driverName})";
    }

    public function viaQueue(): ?string
    {
        if (! isset($this->driver)) {
            // Temporarily resolve driver to get queue name
            $this->driver = resolve(AnalyticsDriverProviderInterface::class)->get($this->driverName);
        }

        if (! $this->driver) {
            Log::warning("Analytics driver {$this->driverName} not found for queue detection.");
            return 'analytics';
        }

        return $this->driver->getQueueName();
    }
} 
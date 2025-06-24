<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Contracts;

/**
 * Interface for analytics driver implementations.
 *
 * Defines the contract for sending events, configuring drivers, and retrieving configuration and platform info.
 */
interface AnalyticsDriverInterface
{
    /**
     * Send event data to the analytics platform.
     *
     * @return bool True on success, false on failure.
     */
    public function sendEvent(array $eventData): bool;

    /**
     * Configure the analytics driver with the given configuration.
     */
    public function configure(array $config): void;

    /**
     * Get the configuration fields required for this driver.
     */
    public function getConfigurationFields(): array;

    /**
     * Get the name of the analytics platform.
     */
    public function getPlatformName(): string;

    /**
     * Get the queue name for this analytics driver.
     */
    public function getQueueName(): string;
}

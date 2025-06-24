<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Contracts;

interface AnalyticsDriverProviderInterface
{
    public function get(string $name): ?AnalyticsDriverInterface;

    public function all(): array;
} 
<?php

declare(strict_types=1);

namespace HadyFayed\WorkflowCanvas\Services\WorkflowNodes;

use HadyFayed\WorkflowCanvas\Models\WorkflowExecution;
use HadyFayed\WorkflowCanvas\Models\WorkflowNode;

/**
 * Interface for workflow node processors.
 */
interface NodeProcessorInterface
{
    /**
     * Process a workflow node with input data.
     *
     * @param WorkflowNode|object $node The node to process (WorkflowNode model or canvas node object)
     * @param array $inputData Input data from previous nodes
     * @param WorkflowExecution $execution Current execution context
     * @return array Output data for next nodes
     */
    public function process(mixed $node, array $inputData, WorkflowExecution $execution): array;

    /**
     * Validate node configuration.
     *
     * @param array $config Node configuration
     * @return array Validation errors (empty if valid)
     */
    public function validateConfig(array $config): array;

    /**
     * Get configuration schema for this node type.
     *
     * @return array Configuration schema
     */
    public function getConfigSchema(): array;
} 
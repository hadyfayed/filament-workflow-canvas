<?php

namespace HadyFayed\WorkflowCanvas\Tests;

use HadyFayed\WorkflowCanvas\WorkflowCanvasServiceProvider;
use Orchestra\Testbench\TestCase as OrchestraTestCase;

class TestCase extends OrchestraTestCase
{
    protected function getPackageProviders($app)
    {
        return [
            WorkflowCanvasServiceProvider::class,
        ];
    }
} 
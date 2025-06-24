<?php

namespace HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowResource\Pages;

use HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateWorkflow extends CreateRecord
{
    protected static string $resource = WorkflowResource::class;
    
    protected static string $view = 'workflow-canvas::filament.resources.workflow-resource.pages.create-workflow';
} 
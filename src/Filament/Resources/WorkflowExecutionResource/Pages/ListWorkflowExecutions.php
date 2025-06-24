<?php

namespace HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowExecutionResource\Pages;

use HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowExecutionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListWorkflowExecutions extends ListRecords
{
    protected static string $resource = WorkflowExecutionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}

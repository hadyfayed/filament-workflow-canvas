<?php

namespace HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowExecutionResource\Pages;

use HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowExecutionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditWorkflowExecution extends EditRecord
{
    protected static string $resource = WorkflowExecutionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}

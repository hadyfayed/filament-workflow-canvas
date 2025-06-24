<?php

namespace HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowResource\Pages;

use HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListWorkflows extends ListRecords
{
    protected static string $resource = WorkflowResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
} 
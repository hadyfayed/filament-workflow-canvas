<?php

namespace HadyFayed\WorkflowCanvas\Filament\Resources;

use HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowExecutionResource\Pages;
use HadyFayed\WorkflowCanvas\Models\WorkflowExecution;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WorkflowExecutionResource extends Resource
{
    protected static ?string $model = WorkflowExecution::class;

    protected static ?string $navigationIcon = 'heroicon-o-play';
    
    protected static ?string $navigationGroup = 'Workflows';

    protected static ?string $navigationLabel = 'Executions';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('workflow_id')
                    ->relationship('workflow', 'name')
                    ->required(),
                
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'running' => 'Running',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->required(),
                
                Forms\Components\KeyValue::make('input_data')
                    ->label('Input Data'),
                
                Forms\Components\KeyValue::make('output_data')
                    ->label('Output Data'),
                
                Forms\Components\Textarea::make('error_message')
                    ->maxLength(65535),
                
                Forms\Components\DateTimePicker::make('started_at'),
                
                Forms\Components\DateTimePicker::make('completed_at'),
                
                Forms\Components\TextInput::make('duration_ms')
                    ->numeric()
                    ->suffix('ms'),
                
                Forms\Components\TextInput::make('trigger_source')
                    ->maxLength(255),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('workflow.name')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'secondary' => 'pending',
                        'warning' => 'running',
                        'success' => 'completed',
                        'danger' => 'failed',
                        'gray' => 'cancelled',
                    ])
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('trigger_source')
                    ->badge()
                    ->color('primary')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('duration_ms')
                    ->label('Duration')
                    ->formatStateUsing(fn ($state) => $state ? number_format($state) . 'ms' : '-')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('started_at')
                    ->dateTime()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('completed_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'running' => 'Running',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'cancelled' => 'Cancelled',
                    ]),
                
                Tables\Filters\SelectFilter::make('trigger_source')
                    ->options([
                        'manual' => 'Manual',
                        'event_controller' => 'Event Controller',
                        'webhook' => 'Webhook',
                        'schedule' => 'Schedule',
                    ]),
                
                Tables\Filters\SelectFilter::make('workflow')
                    ->relationship('workflow', 'name'),
            ])
            ->actions([
                Tables\Actions\Action::make('view_logs')
                    ->icon('heroicon-o-document-text')
                    ->color('info')
                    ->label('View Logs')
                    ->modalContent(fn (WorkflowExecution $record) => view(
                        'filament.pages.workflow-execution-logs',
                        ['execution' => $record]
                    ))
                    ->modalHeading('Execution Logs')
                    ->modalWidth('7xl'),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWorkflowExecutions::route('/'),
            'create' => Pages\CreateWorkflowExecution::route('/create'),
            'edit' => Pages\EditWorkflowExecution::route('/{record}/edit'),
        ];
    }
}
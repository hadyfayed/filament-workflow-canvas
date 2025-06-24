<?php

namespace HadyFayed\WorkflowCanvas\Filament\Resources;

use HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowResource\Pages;
use HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowResource\RelationManagers;
use HadyFayed\WorkflowCanvas\Forms\Components\WorkflowCanvasField;
use HadyFayed\WorkflowCanvas\Models\Workflow;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class WorkflowResource extends Resource
{
    protected static ?string $model = Workflow::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    
    protected static ?string $navigationGroup = 'Workflows';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        
                        Forms\Components\Textarea::make('description')
                            ->maxLength(65535)
                            ->columnSpanFull(),
                        
                        Forms\Components\Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                                'archived' => 'Archived',
                            ])
                            ->default('draft')
                            ->required(),
                        
                        Forms\Components\Toggle::make('is_enabled')
                            ->label('Enabled')
                            ->default(false),
                    ])
                    ->columns(2),
                
                Forms\Components\Section::make('Workflow Settings')
                    ->description('Global workflow configuration and metadata')
                    ->schema([
                        Forms\Components\KeyValue::make('settings.tags')
                            ->label('Tags')
                            ->helperText('Add tags for workflow organization and filtering'),
                        
                        Forms\Components\KeyValue::make('settings.variables')
                            ->label('Global Variables')
                            ->helperText('Default variables available to all nodes in this workflow'),
                    ])
                    ->columns(1)
                    ->collapsible(),
                
                Forms\Components\Section::make('Workflow Canvas')
                    ->schema([
                        WorkflowCanvasField::make('canvas_data')
                            ->label('Enhanced Workflow Editor')
                            ->height(600)
                            ->enableAutoSave(true, 1000)
                            ->nodeTypes(config('workflow-canvas.node_types', []))
                            ->columnSpanFull(),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'secondary' => 'draft',
                        'success' => 'active',
                        'warning' => 'inactive',
                        'danger' => 'archived',
                    ])
                    ->sortable(),
                
                Tables\Columns\IconColumn::make('is_enabled')
                    ->boolean()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('trigger_types')
                    ->label('Triggers')
                    ->badge()
                    ->getStateUsing(function ($record) {
                        $nodes = $record->canvas_data['nodes'] ?? [];
                        $triggerNodes = collect($nodes)->where('type', 'trigger');
                        $types = $triggerNodes->pluck('config.trigger_type')->filter()->unique();
                        return $types->isEmpty() ? ['none'] : $types->toArray();
                    })
                    ->separator(','),
                
                Tables\Columns\TextColumn::make('execution_count')
                    ->label('Executions')
                    ->numeric()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('last_executed_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                        'archived' => 'Archived',
                    ]),
                Tables\Filters\TernaryFilter::make('is_enabled')
                    ->label('Enabled'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
    
    public static function getRelations(): array
    {
        return [
            RelationManagers\NodesRelationManager::class,
        ];
    }
    
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWorkflows::route('/'),
            'create' => Pages\CreateWorkflow::route('/create'),
            'edit' => Pages\EditWorkflow::route('/{record}/edit'),
        ];
    }    
} 
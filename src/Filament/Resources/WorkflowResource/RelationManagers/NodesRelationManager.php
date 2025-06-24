<?php

namespace HadyFayed\WorkflowCanvas\Filament\Resources\WorkflowResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class NodesRelationManager extends RelationManager
{
    protected static string $relationship = 'nodes';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('node_id')
                    ->required()
                    ->maxLength(255)
                    ->default(fn () => 'node_' . time())
                    ->label('Node ID'),
                
                Forms\Components\Select::make('type')
                    ->required()
                    ->options([
                        'trigger' => 'Trigger',
                        'condition' => 'Condition',
                        'transform' => 'Transform',
                        'analytics_driver' => 'Analytics Driver',
                    ])
                    ->live(),
                
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                
                Forms\Components\Textarea::make('description')
                    ->maxLength(500),
                
                Forms\Components\KeyValue::make('config')
                    ->label('Configuration')
                    ->default([]),
                
                Forms\Components\Grid::make(2)->schema([
                    Forms\Components\TextInput::make('order')
                        ->numeric()
                        ->default(0)
                        ->label('Order'),
                    
                    Forms\Components\Toggle::make('is_enabled')
                        ->default(true)
                        ->label('Enabled'),
                ]),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->colors([
                        'primary' => 'trigger',
                        'warning' => 'condition',
                        'info' => 'transform',
                        'success' => 'analytics_driver',
                    ]),
                
                Tables\Columns\TextColumn::make('node_id')
                    ->label('Node ID')
                    ->searchable(),
                
                Tables\Columns\IconColumn::make('is_enabled')
                    ->boolean()
                    ->label('Enabled'),
                
                Tables\Columns\TextColumn::make('order')
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'trigger' => 'Trigger',
                        'condition' => 'Condition',
                        'transform' => 'Transform',
                        'analytics_driver' => 'Analytics Driver',
                    ]),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('order');
    }
} 
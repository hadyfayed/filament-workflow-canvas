<?php

namespace HadyFayed\WorkflowCanvas\Forms\Components;

use HadyFayed\ReactWrapper\Forms\Components\ReactField;

class WorkflowCanvasField extends ReactField
{
    protected string $view = 'workflow-canvas::filament.fields.workflow-canvas-field';

    protected function setUp(): void
    {
        parent::setUp();
        
        // Set default component and props for workflow canvas
        $this->component('WorkflowCanvas');
        $this->height(600);
        $this->resizable(true);
        $this->fullscreen(true);
        $this->toolbar([
            'save' => true,
            'export' => true,
            'import' => true,
            'minimap' => true,
            'zoom' => true,
            'fit_view' => true,
        ]);

        // Workflow-specific default props
        $this->props([
            'enableMinimap' => true,
            'enableControls' => true,
            'enableBackground' => true,
            'backgroundVariant' => 'dots',
            'selectionMode' => 'partial',
            'connectionType' => 'smoothstep',
            'snapToGrid' => true,
            'gridSize' => 20,
            'maxZoom' => 2,
            'minZoom' => 0.1,
            'defaultViewport' => [
                'x' => 0,
                'y' => 0,
                'zoom' => 0.5
            ],
        ]);

        // Set label if not already set
        if (!$this->getLabel()) {
            $this->label('Workflow Canvas');
        }

        // Temporarily removed validation to isolate closure issue
        // Will add back custom validation after resolving the closure problem
    }

    public function enableAutoSave(bool $enabled = true, int $delay = 500): static
    {
        $this->props([
            'autoSave' => $enabled,
            'autoSaveDelay' => $delay,
        ]);

        return $this;
    }

    public function nodeTypes(array $nodeTypes): static
    {
        $this->props([
            'nodeTypes' => $nodeTypes,
        ]);

        return $this;
    }

    public function connectionRules(array $rules): static
    {
        $this->props([
            'connectionRules' => $rules,
        ]);

        return $this;
    }

    public function theme(string $theme): static
    {
        $this->props([
            'theme' => $theme,
        ]);

        return $this;
    }

    public function readonly(bool $readonly = true): static
    {
        $this->props([
            'readonly' => $readonly,
        ]);

        if ($readonly) {
            $this->toolbar([]);
        }

        return $this;
    }

    public function required(\Closure|bool $condition = true): static
    {
        parent::required($condition);

        return $this;
    }
}
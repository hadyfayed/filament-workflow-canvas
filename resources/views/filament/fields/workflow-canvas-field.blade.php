@once
    @push('scripts')
        @include('react-wrapper::filament.scripts')
        @viteReactRefresh
        @vite(['resources/js/bootstrap-react.tsx'])
    @endpush
@endonce

<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <div 
        x-data="{ 
            containerId: '{{ $getContainerId() }}',
            componentName: '{{ $getComponentName() }}',
            componentProps: @js($getComponentProps()),
            isFullscreen: false,
            isResizing: false,
            originalHeight: {{ $getHeight() }},
            currentHeight: {{ $getHeight() }},
            
            initWorkflowCanvas() {
                if (window.ReactComponentRegistry) {
                    window.ReactComponentRegistry.mount(this.componentName, this.containerId, {
                        ...this.componentProps,
                        onDataChange: (data) => {
                            $wire.set('{{ $getStatePath() }}', data);
                        },
                        onFullscreen: (enabled) => {
                            this.isFullscreen = enabled;
                        }
                    });
                } else {
                    console.error('ReactComponentRegistry not found. Make sure React wrapper is properly loaded.');
                }
            },
            
            toggleFullscreen() {
                this.isFullscreen = !this.isFullscreen;
                if (this.isFullscreen) {
                    document.documentElement.requestFullscreen?.();
                } else {
                    document.exitFullscreen?.();
                }
            },
            
            startResize(event) {
                if (!{{ $isResizable() ? 'true' : 'false' }}) return;
                
                this.isResizing = true;
                const startY = event.clientY;
                const startHeight = this.currentHeight;
                
                const handleResize = (e) => {
                    const newHeight = Math.max(200, startHeight + (e.clientY - startY));
                    this.currentHeight = newHeight;
                    document.getElementById(this.containerId).style.height = newHeight + 'px';
                };
                
                const stopResize = () => {
                    this.isResizing = false;
                    document.removeEventListener('mousemove', handleResize);
                    document.removeEventListener('mouseup', stopResize);
                };
                
                document.addEventListener('mousemove', handleResize);
                document.addEventListener('mouseup', stopResize);
            }
        }"
        x-init="initWorkflowCanvas()"
        wire:ignore
        class="workflow-canvas-field-container"
        :class="{ 'fullscreen': isFullscreen, 'resizing': isResizing }"
    >
        <!-- Toolbar -->
        @if(!empty($getToolbar()))
        <div class="workflow-canvas-toolbar flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
            <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $getLabel() }}
                </span>
            </div>
            
            <div class="flex items-center space-x-2">
                @if($getToolbar()['save'] ?? false)
                <button 
                    type="button" 
                    class="btn-toolbar"
                    title="Save Workflow"
                    x-on:click="$wire.save()"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                </button>
                @endif
                
                @if($getToolbar()['export'] ?? false)
                <button 
                    type="button" 
                    class="btn-toolbar"
                    title="Export Workflow"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </button>
                @endif
                
                @if($getToolbar()['import'] ?? false)
                <button 
                    type="button" 
                    class="btn-toolbar"
                    title="Import Workflow"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                    </svg>
                </button>
                @endif
                
                @if($hasFullscreen())
                <button 
                    type="button" 
                    class="btn-toolbar"
                    title="Toggle Fullscreen"
                    x-on:click="toggleFullscreen()"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                    </svg>
                </button>
                @endif
            </div>
        </div>
        @endif
        
        <!-- Canvas Container -->
        <div class="workflow-canvas-wrapper relative">
            <div 
                id="{{ $getContainerId() }}" 
                class="workflow-canvas-mount border border-gray-200 dark:border-gray-700"
                style="height: {{ $getHeight() }}px;"
                :style="{ height: currentHeight + 'px' }"
            >
                <div class="flex items-center justify-center h-full text-gray-500">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p>Loading {{ $getComponentName() }} component...</p>
                    </div>
                </div>
            </div>
            
            <!-- Resize Handle -->
            @if($isResizable())
            <div 
                class="resize-handle absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
                x-on:mousedown="startResize($event)"
                title="Resize Canvas"
            ></div>
            @endif
        </div>
    </div>
    
    <!-- Styles -->
    <style>
        .workflow-canvas-field-container.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            background: white;
        }
        
        .workflow-canvas-field-container.fullscreen .workflow-canvas-mount {
            height: calc(100vh - 60px) !important;
        }
        
        .btn-toolbar {
            @apply p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors;
        }
        
        .resize-handle {
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        .workflow-canvas-wrapper:hover .resize-handle {
            opacity: 1;
        }
        
        .workflow-canvas-field-container.resizing .resize-handle {
            opacity: 1;
            background-color: rgb(59 130 246);
        }
    </style>
</x-dynamic-component>
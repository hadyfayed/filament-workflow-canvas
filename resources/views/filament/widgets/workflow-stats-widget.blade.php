@once
    @push('scripts')
        @include('react-wrapper::filament.scripts')
        @viteReactRefresh
        @vite(['resources/js/bootstrap-react.tsx'])
    @endpush
@endonce

<x-filament-widgets::widget class="fi-wi-workflow-stats">
    <x-filament::card>
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {{ static::$heading ?? 'Workflow Statistics' }}
            </h3>
        </div>
        
        <div 
            x-data="{ 
                containerId: '{{ $containerId }}',
                componentName: '{{ $componentName }}',
                componentProps: @js($componentProps),
                refreshTimer: null,
                
                initWorkflowStats() {
                    if (window.ReactComponentRegistry) {
                        window.ReactComponentRegistry.mount(this.componentName, this.containerId, {
                            ...this.componentProps,
                            onRefresh: () => {
                                $wire.refresh();
                            }
                        });
                        
                        // Set up auto-refresh if specified
                        if (this.componentProps.refreshInterval) {
                            this.startAutoRefresh();
                        }
                    } else {
                        console.error('ReactComponentRegistry not found. Make sure React wrapper is properly loaded.');
                    }
                },
                
                startAutoRefresh() {
                    if (this.refreshTimer) {
                        clearInterval(this.refreshTimer);
                    }
                    
                    this.refreshTimer = setInterval(() => {
                        $wire.refresh();
                    }, this.componentProps.refreshInterval);
                },
                
                stopAutoRefresh() {
                    if (this.refreshTimer) {
                        clearInterval(this.refreshTimer);
                        this.refreshTimer = null;
                    }
                }
            }"
            x-init="initWorkflowStats()"
            x-destroy="stopAutoRefresh()"
            wire:ignore.self
            class="workflow-stats-container"
        >
            <div 
                id="{{ $containerId }}" 
                class="workflow-stats-mount"
                style="min-height: {{ $height }}px;"
            >
                <!-- Fallback content while React component loads -->
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <div class="flex items-center">
                                <div class="animate-pulse bg-blue-200 dark:bg-blue-700 h-4 w-16 rounded mb-2"></div>
                            </div>
                            <div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-12 rounded"></div>
                        </div>
                        
                        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <div class="flex items-center">
                                <div class="animate-pulse bg-green-200 dark:bg-green-700 h-4 w-20 rounded mb-2"></div>
                            </div>
                            <div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-12 rounded"></div>
                        </div>
                        
                        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                            <div class="flex items-center">
                                <div class="animate-pulse bg-yellow-200 dark:bg-yellow-700 h-4 w-24 rounded mb-2"></div>
                            </div>
                            <div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-16 rounded"></div>
                        </div>
                        
                        <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <div class="flex items-center">
                                <div class="animate-pulse bg-purple-200 dark:bg-purple-700 h-4 w-18 rounded mb-2"></div>
                            </div>
                            <div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-14 rounded"></div>
                        </div>
                    </div>
                    
                    <div class="text-center text-gray-500">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p>Loading workflow statistics...</p>
                    </div>
                </div>
            </div>
        </div>
    </x-filament::card>
</x-filament-widgets::widget>
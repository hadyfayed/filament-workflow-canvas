<x-filament-panels::page>
    @push('scripts')
        @viteReactRefresh
        @vite(['resources/js/bootstrap-react.tsx'])
    @endpush
    <x-filament-panels::form wire:submit="create">
        {{ $this->form }}
        
        <x-filament-panels::form.actions
            :actions="$this->getCachedFormActions()"
            :full-width="$this->hasFullWidthFormActions()"
        />
    </x-filament-panels::form>
</x-filament-panels::page> 
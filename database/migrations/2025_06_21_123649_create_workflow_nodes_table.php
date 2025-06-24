<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('workflow_nodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained()->cascadeOnDelete();
            $table->string('node_id'); // Unique within workflow for canvas
            $table->string('type'); // trigger, action, condition, transform, analytics_driver, etc.
            $table->string('name');
            $table->text('description')->nullable();
            $table->json('config'); // Node-specific configuration
            $table->json('position')->nullable(); // Canvas position {x, y}
            $table->integer('order')->default(0);
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();
            
            $table->unique(['workflow_id', 'node_id']);
            $table->index(['workflow_id', 'type']);
            $table->index(['workflow_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflow_nodes');
    }
}; 
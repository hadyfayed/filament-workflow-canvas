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
        Schema::create('workflow_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained()->cascadeOnDelete();
            $table->string('source_node_id'); // Source node
            $table->string('source_anchor')->default('output'); // Output anchor point
            $table->string('target_node_id'); // Target node
            $table->string('target_anchor')->default('input'); // Input anchor point
            $table->json('config')->nullable(); // Connection-specific config (conditions, etc.)
            $table->timestamps();
            
            $table->index(['workflow_id', 'source_node_id']);
            $table->index(['workflow_id', 'target_node_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflow_connections');
    }
}; 
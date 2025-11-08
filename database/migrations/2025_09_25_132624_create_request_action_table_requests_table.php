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
        Schema::create('request_action_table_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('table_id')->constrained('tables')->cascadeOnDelete();
            $table->foreignId('request_action_id')->constrained('request_actions')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->enum('status', ['pending', 'seen', 'done'])->default('pending'); // cashier workflow
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_action_table_requests');
    }
};

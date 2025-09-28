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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('menu_item_id')->constrained('menu_items')->onDelete('cascade');
            $table->foreignId('variant_id')->nullable()->constrained('menu_item_variants')->onDelete('cascade');

            $table->text('notes')->nullable();
            $table->enum('status', [
                'pending',     // waiting for kitchen
                'preparing',   // being cooked
                'ready',       // finished, waiting to serve/deliver
                'served',      // served to table / handed to customer
                'cancelled',   // item cancelled
            ])->default('pending');
            $table->decimal('unit_price', 10, 2);   // price per item
            $table->integer('quantity')->default(1);           // number of units
            $table->decimal('total_price', 10, 2); // unit_price * quantity
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};

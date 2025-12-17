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
        Schema::create('saving_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');            // 目標名 (例: 夏休み旅行, 新車購入)
            $table->integer('target_amount');   // 目標金額
            $table->integer('current_amount')->default(0); // 現在の積立額
            $table->date('deadline')->nullable(); // 希望達成期限
            $table->string('color')->default('#0066CC'); // グラフ表示用の色
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saving_goals');
    }
};

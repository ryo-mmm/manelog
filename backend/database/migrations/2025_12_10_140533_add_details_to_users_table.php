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
        Schema::table('users', function (Blueprint $table) {
            // ニックネームの追加 (必須フィールドとする)
            $table->string('nickname')->unique()->after('name');
            // 生年月日の追加 (日付型)
            $table->date('birthday')->nullable()->after('nickname');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // upで追加したカラムを down で削除する
            $table->dropColumn('nickname');
            $table->dropColumn('birthday');
        });
    }
};

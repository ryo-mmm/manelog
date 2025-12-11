<?php

use App\Http\Controllers\Api\AnalysisController;
use Illuminate\Support\Facades\Route;

// Sanctumミドルウェアを適用し、認証済みユーザーのみアクセス可能とする
// 認証には Laravel SanctumのSPA認証 (Cookieベース) を推奨
Route::middleware('auth:sanctum')->group(function () {
    // コア機能1: 支出パターン分析
    // GET /api/analysis/patterns
    Route::get('analysis/patterns', [AnalysisController::class, 'getSpendingPatterns']);

    // 他のAPIエンドポイントもここに追加されます
    // 例: Route::get('goals', [GoalController::class, 'index']);
});

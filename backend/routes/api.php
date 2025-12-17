<?php

use App\Http\Controllers\Api\AnalysisController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PredictionController;
use App\Http\Controllers\Api\SavingGoalController;

Route::middleware('auth:sanctum')->group(function () {
    // コア機能1: 支出パターン分析
    // GET /api/analysis/patterns
    Route::get('analysis/patterns', [AnalysisController::class, 'getSpendingPatterns']);

    // 他のAPIエンドポイントもここに追加されます
    Route::get('analysis/patterns', [AnalysisController::class, 'getSpendingPatterns']);

    // コア機能3: 未来予測用ベースデータ取得
    Route::get('prediction/base-data', [PredictionController::class, 'getBaseData']);

    // 目標管理（バケット）
    Route::apiResource('saving-goals', SavingGoalController::class);
});

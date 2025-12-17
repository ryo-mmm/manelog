<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExpenseAnalysisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PredictionController extends Controller
{
    protected $analysisService;

    public function __construct(ExpenseAnalysisService $analysisService)
    {
        $this->analysisService = $analysisService;
    }

    /**
     * 未来予測に必要な基礎データを取得する
     */
    public function getBaseData()
    {
        $userId = Auth::id();

        // 1. 過去90日の分析データを取得
        $analysis = $this->analysisService->analyzeSpendingPatterns($userId, 90);

        // 2. 数値の算出（1回にまとめます）
        $weekdayAvg = $analysis['patterns']['weekday_average'] ?? 0;
        $weekendAvg = $analysis['patterns']['weekend_average'] ?? 0;

        // 月間平均支出の計算 (週5日平日、週2日週末と仮定して4週間分)
        $monthlyAvgExpense = (($weekdayAvg * 5) + ($weekendAvg * 2)) * 4;

        // デモ用の固定値（将来的にDB化する部分）
        $estimatedMonthlyIncome = 250000;

        // 3. ユーザーの目標データを取得
        // ※ファイルの冒頭に use App\Models\SavingGoal; を書く場合は \App\Models\ は不要です
        $goals = \App\Models\SavingGoal::where('user_id', $userId)->get();

        return response()->json([
            'status' => 'success',
            'base_data' => [
                'current_balance' => 500000, // TODO: 資産テーブルから取得
                'monthly_income' => $estimatedMonthlyIncome,
                'monthly_avg_expense' => round($monthlyAvgExpense),
                'monthly_surplus' => round($estimatedMonthlyIncome - $monthlyAvgExpense),
                'goals' => $goals
            ]
        ]);
    }
}
<?php

namespace App\Services;

use App\Models\Expense;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * 支出データに基づき、ユーザーの消費パターンを分析し、警告を生成するサービス
 * Modelを厚く保つ原則に基づき、複雑な集計ロジックを担う。
 */
class ExpenseAnalysisService
{
    /**
     * 過去N日間の支出データを取得し、主要な消費パターンを分析する
     *
     * @param int $userId
     * @param int $days 期間 (例: 90日)
     * @return array
     */
    public function analyzeSpendingPatterns(int $userId, int $days = 90): array
    {
        $startDate = Carbon::now()->subDays($days);

        // 1. 基本データの取得
        $expenses = Expense::where('user_id', $userId)
            ->where('spent_at', '>=', $startDate)
            ->with('category') // N+1問題を避けるためEager Loadingを使用
            ->get();

        // 支出がない場合は早期リターン
        if ($expenses->isEmpty()) {
            return [
                'summary' => '過去' . $days . '日間の支出データが見つかりませんでした。',
                'patterns' => [],
                'warnings' => []
            ];
        }

        // 2. パターン抽出: 平日/週末の平均支出
        $weekdaySpending = $this->calculateDailyAverage($expenses, false);
        $weekendSpending = $this->calculateDailyAverage($expenses, true);

        // 3. パターン抽出: 時間帯別傾向（例：夜間の支出）
        $eveningSpendingPattern = $this->calculateTimeOfDayPattern($expenses, 18, 24);

        // 4. 警告の生成
        $warnings = $this->generateWarnings($expenses, $weekdaySpending, $weekendSpending);

        return [
            'summary' => '過去' . $days . '日間の消費パターン分析レポート',
            'patterns' => [
                'weekday_average' => $weekdaySpending,
                'weekend_average' => $weekendSpending,
                'evening_spending' => $eveningSpendingPattern,
            ],
            'warnings' => $warnings
        ];
    }

    /**
     * 平日または週末の平均支出を計算するヘルパーメソッド
     */
    protected function calculateDailyAverage($expenses, bool $isWeekend): float
    {
        // Carbon::isWeekend() を利用してフィルタリング
        $filtered = $expenses->filter(function ($expense) use ($isWeekend) {
            $date = Carbon::parse($expense->spent_at);
            return $isWeekend ? $date->isWeekend() : $date->isWeekday();
        });

        if ($filtered->isEmpty()) {
            return 0.00;
        }

        // 実際の日数で割る
        $totalDays = Carbon::now()->diffInDays($filtered->min('spent_at')) + 1;

        $spendingDays = $filtered->unique(function ($item) {
            return Carbon::parse($item->spent_at)->toDateString();
        })->count();

        // 平日/週末に該当する日数で集計
        $totalAmount = $filtered->sum('amount');
        return $spendingDays > 0 ? round($totalAmount / $spendingDays, 2) : 0.00;
    }

    /**
     * 特定の時間帯の支出パターンを計算するヘルパーメソッド
     */
    protected function calculateTimeOfDayPattern($expenses, int $startHour, int $endHour): float
    {
        $filtered = $expenses->filter(function ($expense) use ($startHour, $endHour) {
            $hour = Carbon::parse($expense->spent_at)->hour;
            return $hour >= $startHour && $hour < $endHour;
        });

        return round($filtered->sum('amount'), 2);
    }

    /**
     * 分析結果に基づき、具体的な浪費傾向の警告を生成する（コア機能1の要件）
     */
    protected function generateWarnings($expenses, $weekdayAvg, $weekendAvg): array
    {
        $warnings = [];

        // 警告 1: 特定のカテゴリでの浪費傾向 (例: 外食)
        // 外食カテゴリの支出が平均（平日平均のX倍）を超えていないかチェック
        $eatingOutId = 1; // 実際はCategoriesテーブルから取得する
        $eatingOutExpenses = $expenses->where('category_id', $eatingOutId)->sum('amount');

        // 仮の基準: 外食費が全体の平均支出額（平日/週末平均の平均）を大きく超える場合
        $overallAvg = ($weekdayAvg + $weekendAvg) / 2;
        $totalSpending = $expenses->sum('amount');

        // 外食費が全体の15%を超え、かつ平均日額の30日分（月間予算仮定）を超えている場合
        if ($totalSpending > 0 && ($eatingOutExpenses / $totalSpending) > 0.15 && $eatingOutExpenses > ($overallAvg * 30 * 0.5)) {
            $warnings[] = [
                'type' => 'HighCategorySpending',
                'message' => '過去3ヶ月間で、外食費が全体の' . round(($eatingOutExpenses / $totalSpending) * 100) . '%を占めています。予算超過の兆候です。',
                'category' => '外食'
            ];
        }

        // 警告 2: 週末の浪費傾向
        if ($weekendAvg > ($weekdayAvg * 1.5) && $weekdayAvg > 0) {
            $warnings[] = [
                'type' => 'WeekendExcess',
                'message' => '週末の平均支出額（' . number_format($weekendAvg) . '円）が平日の1.5倍を超えています。週末の浪費傾向を再評価しましょう。',
                'difference' => $weekendAvg - $weekdayAvg
            ];
        }

        // 警告 3: 特定の曜日・時間帯の増加傾向 (要件例: 水曜日18時以降のコンビニ)
        // 実際の分析では、過去の同期間と比較して増加しているかを見るべきだが、ここではロジックのデモとして記述
        $wednesdayEveningSpending = $expenses->filter(function ($expense) {
            $dt = Carbon::parse($expense->spent_at);
            // 水曜日 (3) かつ 18時以降
            return $dt->dayOfWeek === Carbon::WEDNESDAY && $dt->hour >= 18;
        })->sum('amount');

        // 仮の基準: 水曜日18時以降の支出が、他の曜日・時間帯の平均を大きく上回る場合
        if ($wednesdayEveningSpending > 10000 && $totalSpending > 0) {
            $warnings[] = [
                'type' => 'SpecificTimePattern',
                'message' => '水曜日の18時以降の支出が顕著に高い傾向が見られます。習慣的なコンビニ・テイクアウト支出がないか確認しましょう。',
                'amount' => $wednesdayEveningSpending
            ];
        }

        return $warnings;
    }
}

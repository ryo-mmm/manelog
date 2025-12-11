<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 分析結果をReact側が扱いやすい一貫したJSON構造に整形する
 */
class AnalysisResource extends JsonResource
{
    /**
     * リソースを配列に変換する
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // $this->resource は AnalysisService から返された配列 ($analysisData) を参照
        return [
            'status' => 'success',
            'report_summary' => $this->resource['summary'], // レポートの要約メッセージ

            // 抽出されたパターンの構造化
            'patterns' => [
                'weekday_average' => number_format($this->resource['patterns']['weekday_average'], 2, '.', ''),
                'weekend_average' => number_format($this->resource['patterns']['weekend_average'], 2, '.', ''),
                'evening_spending_total' => number_format($this->resource['patterns']['evening_spending'], 2, '.', ''),
            ],

            // 警告リストの構造化
            'warnings' => $this->resource['warnings'],

            // 分析が実行された日時（デバッグ/ロギング用）
            'analyzed_at' => now()->toDateTimeString(),
        ];
    }
}

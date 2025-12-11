/**
 * 支出パターン分析サービスから返される警告メッセージの型
 */
export interface Warning {
    type: 'HighCategorySpending' | 'WeekendExcess' | 'SpecificTimePattern';
    message: string;
    // 必要に応じて、警告に関係する数値データなどを追加
    amount?: number;
    difference?: number;
    category?: string;
}

/**
 * APIエンドポイント `/api/analysis/patterns` から返されるレポート全体の型
 */
export interface AnalysisData {
    status: string;
    report_summary: string;
    patterns: {
        weekday_average: string;
        weekend_average: string;
        evening_spending_total: string;
    };
    warnings: Warning[];
    analyzed_at: string;
}
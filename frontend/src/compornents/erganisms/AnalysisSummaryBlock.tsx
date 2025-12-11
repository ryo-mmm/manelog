import React from 'react';
import { useQuery } from '@tanstack/react-query'; // React Queryを推奨
import axios from 'axios';
import { AnalysisData } from '../../types/Analysis'; // 型定義をインポート

// --- [TypeScript 型定義の分離] ---
// 実際の開発では types/Analysis.ts に定義します
// ここでは説明のためインラインで記述
interface Warning {
    type: string;
    message: string;
    // ... 他のデータフィールド
}

interface AnalysisData {
    report_summary: string;
    patterns: {
        weekday_average: string;
        weekend_average: string;
        evening_spending_total: string;
    };
    warnings: Warning[];
    analyzed_at: string;
}
// ---------------------------------

/**
 * APIから支出傾向分析データを取得するフック (React Query)
 */
const useAnalysisData = () => {
    // キャッシュ機能を持つ React Query の導入を強く推奨
    return useQuery<AnalysisData>({
        queryKey: ['analysisPatterns'],
        queryFn: async () => {
            // LaravelのAPIエンドポイントを呼び出し
            const { data } = await axios.get<AnalysisData>('/api/analysis/patterns');
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5分間はキャッシュを利用
        retry: 1,
    });
};

/**
 * [AnalysisSummaryBlock]
 * コア機能1「支出パターン分析」の結果を表示する Organism コンポーネント。
 */
const AnalysisSummaryBlock: React.FC = () => {
    const { data, isLoading, isError, error } = useAnalysisData();

    // 1. ロード中/エラー時のUX/UI設計 (必須)
    if (isLoading) {
        // スケルトンスクリーンなど、より親切な表示が望ましい
        return <div className="AnalysisBlock AnalysisBlock--loading">分析データを取得中...</div>;
    }

    if (isError) {
        return (
            <div className="AnalysisBlock AnalysisBlock--error">
                分析レポートの取得中にエラーが発生しました: {error instanceof Error ? error.message : '不明なエラー'}
            </div>
        );
    }

    // データがない場合も対応
    if (!data) {
        return <div className="AnalysisBlock">分析データが見つかりませんでした。支出を記録してみましょう。</div>;
    }

    // 2. 正常データ表示
    return (
        <div className="AnalysisBlock">
            <h2 className="AnalysisBlock__title">
                📊 支出パターン分析レポート
            </h2>
            <p className="AnalysisBlock__summary">{data.report_summary}</p>
            <p className="AnalysisBlock__date">分析日時: {data.analyzed_at}</p>

            {/* 警告エリア: アクセントカラーを効果的に使用するエリア */}
            {data.warnings.length > 0 && (
                <div className="AnalysisBlock__warnings">
                    <h3 className="AnalysisBlock__warningsTitle">🚨 浪費習慣アラート</h3>
                    <ul className="AnalysisBlock__warningsList">
                        {data.warnings.map((warning, index) => (
                            // 近接の法則に基づき、警告メッセージを視覚的に強調
                            <li key={index} className="AnalysisBlock__warningItem AnalysisBlock__warningItem--accent">
                                {warning.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 主要パターンの表示 */}
            <div className="AnalysisBlock__patterns">
                <h3 className="AnalysisBlock__patternsTitle">📝 主要な支出傾向</h3>
                <div className="AnalysisBlock__patternItem">
                    <p>平日平均支出: <strong>¥{data.patterns.weekday_average}</strong></p>
                </div>
                <div className="AnalysisBlock__patternItem">
                    <p>週末平均支出: <strong>¥{data.patterns.weekend_average}</strong></p>
                </div>
                <div className="AnalysisBlock__patternItem">
                    <p>夜間（18時以降）合計支出: <strong>¥{data.patterns.evening_spending_total}</strong></p>
                </div>
            </div>

            {/* CTA: 習慣を変える次の行動へ誘導 */}
            <div className="AnalysisBlock__cta">
                {/* アクセントカラー (#FFC107) を使用し、CVへ誘導 [cite: 5] */}
                <button className="AnalysisBlock__ctaButton AnalysisBlock__ctaButton--accent">
                    この傾向を基に目標を見直す（コア機能2へ）
                </button>
            </div>
        </div>
    );
};

export default AnalysisSummaryBlock;
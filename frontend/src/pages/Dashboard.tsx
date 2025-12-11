import React from 'react';
import AppLayoutTemplate from '../templates/AppLayoutTemplate';
import AnalysisSummaryBlock from '../components/organisms/AnalysisSummaryBlock';
// 他の Organism コンポーネントのインポートを想定
// import GoalProgressBlock from '../components/organisms/GoalProgressBlock';
// import LatestTransactionsTable from '../components/organisms/LatestTransactionsTable';

/**
 * [ダッシュボード]
 * ユーザーがログイン後に最初にアクセスするページ。
 * 現状のサマリー（分析警告、目標進捗）を提供し、行動を促す。
 */
const Dashboard: React.FC = () => {
    // ユーザー情報（認証コンテキストから取得を想定）
    const user = { nickname: 'マネログユーザー' };

    return (
        // AppLayoutTemplate: 左サイドバーとメインコンテンツエリアを定義
        <AppLayoutTemplate>
            <div className="Dashboard__wrapper">
                {/* 1. ページヘッダー */}
                <h1 className="Dashboard__title">
                    ようこそ、{user.nickname}さん！
                </h1>
                <p className="Dashboard__subtitle">
                    習慣と未来を変えるための、今日の財務サマリーです。
                </p>

                {/* 2. メインコンテンツエリア - 情報量の多いマルチカラムの実現 */}
                <section className="Dashboard__grid">
                    {/* コア機能1: 支出パターン分析サマリーの表示 */}
                    <div className="Dashboard__gridItem Dashboard__gridItem--lg">
                        <AnalysisSummaryBlock />
                    </div>

                    {/* コア機能2: 目標進捗サマリーの表示 */}
                    <div className="Dashboard__gridItem Dashboard__gridItem--sm">
                        {/* <GoalProgressBlock /> */}
                        {/* 現状は未実装のため、プレースホルダー */}
                        <div className="Placeholder">
                            <h2>目標管理サマリー (コア機能2)</h2>
                            <p>目標達成までの進捗と残り期間を表示します。</p>
                        </div>
                    </div>

                    {/* 最新の収支記録など、その他の情報ブロック */}
                    <div className="Dashboard__gridItem Dashboard__gridItem--full">
                        {/* <LatestTransactionsTable /> */}
                        <div className="Placeholder">
                            <h2>直近の収支記録</h2>
                            <p>ユーザーの直近の記録に基づいた傾向を示します。</p>
                        </div>
                    </div>

                </section>
            </div>
        </AppLayoutTemplate>
    );
};

export default Dashboard;
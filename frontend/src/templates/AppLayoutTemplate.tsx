import React, { useState } from 'react';
import SidebarNavigation from '../components/organisms/SidebarNavigation'; // ナビゲーションコンポーネントを想定

interface AppLayoutProps {
    children: React.ReactNode;
}

/**
 * [AppLayoutTemplate]
 * アプリケーション全体の左固定サイドバーとメインコンテンツの構造を定義するテンプレート。
 */
const AppLayoutTemplate: React.FC<AppLayoutProps> = ({ children }) => {
    // モバイルでのみサイドバーの開閉状態を管理する
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    /**
     * サイドバーの開閉を切り替えるトグル関数
     */
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`AppLayout ${isSidebarOpen ? 'AppLayout--sidebarOpen' : ''}`}>
            {/* -------------------------------------- */}
            {/* 1. モバイル用トグルボタン */}
            {/* -------------------------------------- */}
            <button
                className="Sidebar__toggleButton"
                onClick={toggleSidebar}
                aria-expanded={isSidebarOpen}
                aria-controls="SidebarNavigation"
                // WCAG: アクセシビリティ確保のため、テキストやアイコンの説明を追加
                aria-label={isSidebarOpen ? "メニューを閉じる" : "メニューを開く"}
            >
                {isSidebarOpen ? '✕' : '☰'}
            </button>

            {/* -------------------------------------- */}
            {/* 2. サイドバーナビゲーション */}
            {/* -------------------------------------- */}
            <div id="SidebarNavigation" className="AppLayout__sidebar">
                <SidebarNavigation />
            </div>

            {/* -------------------------------------- */}
            {/* 3. メインコンテンツエリア */}
            {/* -------------------------------------- */}
            <main className="AppLayout__mainContent">
                {children}
            </main>

            {/* モバイルでサイドバーが開いているとき、コンテンツを隠すためのオーバーレイ */}
            {isSidebarOpen && (
                <div
                    className="AppLayout__overlay"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

export default AppLayoutTemplate;
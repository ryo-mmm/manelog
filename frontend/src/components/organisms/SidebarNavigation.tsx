import React from 'react';

/**
 * サイドバーナビゲーションの仮コンポーネント
 */
const SidebarNavigation: React.FC = () => {
    return (
        <nav className="SidebarNavigation">
            <div className="SidebarNavigation__logo">マネログ</div>
            <ul className="SidebarNavigation__list">
                <li className="SidebarNavigation__item">ダッシュボード</li>
                <li className="SidebarNavigation__item">分析レポート</li>
                <li className="SidebarNavigation__item">目標管理</li>
                <li className="SidebarNavigation__item">未来予測</li>
            </ul>
        </nav>
    );
};

// これが重要：外部から import できるようにする
export default SidebarNavigation;
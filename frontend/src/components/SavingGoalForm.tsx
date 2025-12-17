import React, { useState } from 'react';
import axios from 'axios';

interface SavingGoalFormProps {
    onGoalAdded: () => void; // 登録完了後に親コンポーネントのデータを再取得するためのコールバック
}

const SavingGoalForm: React.FC<SavingGoalFormProps> = ({ onGoalAdded }) => {
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState<number | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetAmount) return;

        setIsSubmitting(true);
        try {
            await axios.post('/api/saving-goals', {
                title,
                target_amount: Number(targetAmount),
            });
            setTitle('');
            setTargetAmount('');
            onGoalAdded(); // 親のデータを更新
            alert('目標を登録しました！');
        } catch (error) {
            console.error('目標の登録に失敗しました', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="GoalForm" onSubmit={handleSubmit}>
            <h4 className="GoalForm__title">新しい目標を追加</h4>
            <div className="GoalForm__inputGroup">
                <input
                    type="text"
                    placeholder="例: 夏休み旅行, 新車購入"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="GoalForm__inputGroup">
                <input
                    type="number"
                    placeholder="目標金額 (円)"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                />
            </div>
            <button
                type="submit"
                className="GoalForm__submitBtn"
                disabled={isSubmitting}
            >
                {isSubmitting ? '保存中...' : '目標を保存する'}
            </button>
        </form>
    );
};

export default SavingGoalForm;
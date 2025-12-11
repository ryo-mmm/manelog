import { useState } from 'react';

/**
 * [useFormSubmit]
 * フォームの送信状態を管理し、二重送信防止とUXフィードバックを提供するカスタムフック。
 *
 * @param onSubmitFn 実際にAPIを呼び出す非同期関数
 * @returns State (isSubmitting, error, success) と submitHandler
 */
export const useFormSubmit = <T>(onSubmitFn: (data: T) => Promise<void>) => {
    // 状態管理
    const [isSubmitting, setIsSubmitting] = useState(false); // 二重送信防止の核
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (data: T) => {
        // 既に送信中の場合は処理を中断 (二重送信防止)
        if (isSubmitting) return;

        setIsSubmitting(true); // 送信開始: ボタンを無効化
        setError(null);
        setIsSuccess(false);

        try {
            await onSubmitFn(data); // 実際のAPI呼び出しを実行
            setIsSuccess(true);     // 成功フィードバック
            // ここでフォームをリセットすることも可能

            // 教育的解説: フォームの成功時に、ゴール達成（CV）のための分析イベント（例: Google Analytics）を送信する。
            // window.dataLayer.push({ 'event': 'user_registered', 'method': 'email' });

        } catch (err: any) {
            // エラー処理: Laravelのバリデーションエラー (422) などに対応
            const errorMessage = err.response?.data?.message || '登録中に予期せぬエラーが発生しました。';
            setError(errorMessage);
            setIsSuccess(false);
        } finally {
            setIsSubmitting(false); // 送信完了: ボタンを再有効化
        }
    };

    return {
        isSubmitting,
        error,
        isSuccess,
        handleSubmit,
    };
};

// フォームコンポーネント (例: RegisterForm.tsx) での使用例:
/*
const RegisterForm: React.FC = () => {
    const handleApiSubmit = async (formData: FormData) => {
        // 実際はaxios.post('/api/register', formData) を実行
        console.log('APIを呼び出し中...', formData);
        await new Promise(resolve => setTimeout(resolve, 1500)); // 擬似的な遅延
    };

    const { isSubmitting, error, isSuccess, handleSubmit } = useFormSubmit(handleApiSubmit);

    return (
        <form onSubmit={e => { e.preventDefault(); handleSubmit({ name: 'User' }); }}>
            // ... 入力フィールド ...

            <button
                type="submit"
                disabled={isSubmitting} // 二重送信防止
                className={`Button Button--accent ${isSubmitting ? 'Button--loading' : ''}`}
            >
                {isSubmitting ? '登録中...' : 'ユーザー登録を完了する'}
            </button>

            {error && <p className="Form__error">{error}</p>}
            {isSuccess && <p className="Form__success">登録が完了しました！ダッシュボードへ移動します。</p>}
        </form>
    );
};
*/
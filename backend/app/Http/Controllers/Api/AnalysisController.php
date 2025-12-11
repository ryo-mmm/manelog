<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnalysisResource; // レスポンスの整形に利用
use App\Services\ExpenseAnalysisService; // ビジネスロジックを委譲
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnalysisController extends Controller
{
    protected $analysisService;

    /**
     * 依存性注入によりサービスを初期化
     * @param ExpenseAnalysisService $analysisService
     */
    public function __construct(ExpenseAnalysisService $analysisService)
    {
        // 認証済みのユーザーのみアクセス可能であることを保証するミドルウェア
        // ミドルウェアは routes/api.php で適用するため、ここでは何も行わない
        $this->analysisService = $analysisService;
    }

    /**
     * 支出傾向分析レポートを取得する (GET /api/analysis/patterns)
     * * @param Request $request
     * @return AnalysisResource
     */
    public function getSpendingPatterns(Request $request)
    {
        // 1. 入力値の検証（ここでは期間のみ）
        // React側から期間(days)を受け取ることを想定し、デフォルト値を90日とする
        $days = $request->get('days', 90);

        if (!is_numeric($days) || $days < 30) {
            // バリデーションエラーを標準の422形式で返す
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => ['days' => ['分析期間は30日以上の数値で指定してください。']],
            ], 422);
        }

        // 2. ビジネスロジックをサービス層に委譲
        // Auth::id()で認証済みユーザーのIDを取得し、サービスに渡す
        $analysisData = $this->analysisService->analyzeSpendingPatterns(Auth::id(), (int)$days);

        // 3. レスポンスの整形と返却
        // AnalysisResourceを使用して、Reactが期待する構造に整形
        return new AnalysisResource($analysisData);
    }

    // 必要に応じて、getWarnings() など、他の分析結果取得メソッドを追加可能
}

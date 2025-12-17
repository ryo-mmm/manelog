<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavingGoalController extends Controller
{
    /**
     * 目標一覧を取得
     */
    public function index()
    {
        $goals = SavingGoal::where('user_id', Auth::id())->orderBy('created_at', 'desc')->get();
        return response()->json($goals);
    }

    /**
     * 目標を新規登録
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:50',
            'target_amount' => 'required|integer|min:1',
            'deadline' => 'nullable|date',
            'color' => 'nullable|string'
        ]);

        $goal = SavingGoal::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'target_amount' => $validated['target_amount'],
            'deadline' => $validated['deadline'],
            'color' => $validated['color'] ?? '#0066CC',
        ]);

        return response()->json($goal, 201);
    }

    /**
     * 目標の削除
     */
    public function destroy(SavingGoal $savingGoal)
    {
        // 自分の目標か確認
        if ($savingGoal->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $savingGoal->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
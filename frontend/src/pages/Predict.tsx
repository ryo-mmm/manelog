import React, { useState, useMemo, useEffect, useCallback } from 'react'; // useCallbackを追加
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label} from 'recharts';
import AppLayoutTemplate from '../templates/AppLayoutTemplate';
import SavingGoalForm from '../components/SavingGoalForm';
import '../styles/app.css';

interface SavingGoal {
    id: number;
    title: string;
    target_amount: number;
    color: string;
}

const Predict: React.FC = () => {
    const [monthlyReduction, setMonthlyReduction] = useState(20000);
    const [baseData, setBaseData] = useState({
        currentBalance: 0,
        monthlySurplus: 0,
        goals: [] as SavingGoal[]
    });
    const [isLoading, setIsLoading] = useState(true);

    // 1. データ取得関数を独立させる (目標追加後にも呼び出せるようにするため)
    const fetchBaseData = useCallback(async () => {
        try {
            const response = await axios.get('/api/prediction/base-data');
            const { current_balance, monthly_surplus, goals } = response.data.base_data;

            setBaseData({
                currentBalance: current_balance,
                monthlySurplus: monthly_surplus,
                goals: goals || []
            });
            setIsLoading(false);
        } catch (error) {
            console.error("データの取得に失敗しました", error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBaseData();
    }, [fetchBaseData]);

    const projectionData = useMemo(() => {
        const data = [];
        const months = 24; // 2年分の方が目標達成が見えやすいため延長を推奨

        for (let i = 0; i <= months; i++) {
            data.push({
                name: `${i}ヶ月後`,
                baseline: baseData.currentBalance + (baseData.monthlySurplus * i),
                improved: baseData.currentBalance + ((baseData.monthlySurplus + monthlyReduction) * i),
                savedTotal: monthlyReduction * i,
            });
        }
        return data;
    }, [monthlyReduction, baseData]);

    const totalSaved = monthlyReduction * 12;

    if (isLoading) return <AppLayoutTemplate><div>読み込み中...</div></AppLayoutTemplate>;

    return (
        <AppLayoutTemplate>
        <div className="Predict">
            <h1 className="Predict__title">未来予測シミュレーション</h1>

            <div className="Predict__container">
                <div className="Predict__settingsArea">
                    <div className="Predict__settingsCard">
                        <h3>シミュレーション設定</h3>
                        <div className="Predict__inputGroup">
                            <label>毎月の節約目標: <strong>¥{monthlyReduction.toLocaleString()}</strong></label>
                            <input
                                type="range"
                                min="0" max="100000" step="1000"
                                value={monthlyReduction}
                                onChange={(e) => setMonthlyReduction(Number(e.target.value))}
                            />
                        </div>
                        <div className="Predict__resultHighlight">
                            <p>1年間の節約合計額</p>
                            <span className="Predict__savedAmount">¥{totalSaved.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="Predict__goalFormCard">
                        <SavingGoalForm onGoalAdded={fetchBaseData} />
                    </div>
                </div>

                <div className="Predict__chartCard">
                    <h3>24ヶ月の資産推移予測</h3>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <LineChart data={projectionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} tickFormatter={(value) => `${value/10000}万`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value: any) => `¥${Number(value).toLocaleString()}`} 
                                />
                                <Legend iconType="circle" verticalAlign="top" align="right" height={36}/>

                                {baseData.goals.map(goal => (
                                    <ReferenceLine 
                                        key={goal.id}
                                        y={goal.target_amount} 
                                        stroke="#EBCB8B" /* 北欧らしいゴールド */
                                        strokeDasharray="4 4"
                                    >
                                        <Label value={`${goal.title}`} position="insideBottomRight" fill="#D08770" fontSize={12} />
                                    </ReferenceLine>
                                ))}

                                <Line type="monotone" dataKey="improved" name="節約実行後" stroke="#5E81AC" strokeWidth={4} dot={false} />
                                <Line type="monotone" dataKey="baseline" name="現状維持" stroke="#D8DEE9" strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    </AppLayoutTemplate>
    );
};

export default Predict;
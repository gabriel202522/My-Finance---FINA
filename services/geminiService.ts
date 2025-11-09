import { GoogleGenAI } from "@google/genai";
import { UserData, Transaction } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const getTodaysTransactions = (transactions: Transaction[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return transactions.filter(t => new Date(t.date) >= today);
};

export const getDailySummaryInsight = async (userData: UserData): Promise<string> => {
    if (!API_KEY) return "AI desativada. Configure a API Key.";
    
    const todayTransactions = getTodaysTransactions(userData.transactions);
    const spentToday = todayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const earnedToday = todayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const dailyIncome = userData.monthlyIncome / 30;

    const prompt = `
        Analise o resumo financeiro diário do usuário ${userData.userName} e forneça um insight curto, amigável e motivacional em português.
        - Renda mensal do usuário: R$${userData.monthlyIncome.toFixed(2)}
        - Média de renda diária: R$${dailyIncome.toFixed(2)}
        - Gastos de hoje: R$${spentToday.toFixed(2)}
        - Ganhos de hoje: R$${earnedToday.toFixed(2)}
        - Saldo atual: R$${userData.currentBalance.toFixed(2)}

        Se os gastos estiverem abaixo de 50% da renda diária, elogie de forma calorosa.
        Se os gastos estiverem entre 50% e 100%, comente que está no caminho certo.
        Se os gastos ultrapassarem a renda diária, envie um alerta amigável e encorajador.
        Se não houve gastos, incentive a economia.
        Seja breve (1-2 frases) e use um emoji.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating daily summary insight:", error);
        return "Não foi possível gerar o insight diário.";
    }
};

export const getFinaResponse = async (userData: UserData, chatHistory: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
    if (!API_KEY) return "Desculpe, meu cérebro de IA está offline. Verifique a configuração da API Key.";

    const prompt = `
        Você é a FINA, uma assistente financeira de IA amigável, empática e proativa. Seu objetivo é ajudar os usuários a entenderem e melhorarem suas finanças. Use um tom de conversa leve, motivacional e encorajador, como um coach financeiro.

        **REGRAS IMPORTANTES:**
        - Seja extremamente concisa e use frases curtas.
        - NUNCA escreva parágrafos longos ou "textões".
        - Use emojis para deixar a conversa mais leve e divertida. 👍💸
        - Chame o usuário pelo nome: ${userData.userName}.

        Aqui estão os dados financeiros do usuário (${userData.userName}):
        - Renda Mensal: R$${userData.monthlyIncome.toFixed(2)}
        - Saldo Atual: R$${userData.currentBalance.toFixed(2)}
        - Metas: ${userData.goals.map(g => `${g.name} (R$${g.currentAmount.toFixed(2)} de R$${g.targetAmount.toFixed(2)})`).join(', ')}
        - Últimas 5 Transações: ${userData.transactions.slice(-5).map(t => `${t.type === 'expense' ? 'Gasto' : 'Ganho'} de R$${t.amount.toFixed(2)} em ${t.category}`).join(', ')}

        Baseado nesses dados e no histórico da conversa, responda à seguinte mensagem do usuário de forma útil e personalizada.
    `;
    
    const contents = [
        ...chatHistory,
        { role: 'user', parts: [{ text: newMessage }] }
    ];
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: prompt
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting FINA response:", error);
        return "Ocorreu um erro ao processar sua solicitação.";
    }
};

export const getExpenseInsight = (spentToday: number, dailyIncome: number): string => {
    if (dailyIncome <= 0) return "";
    const percentage = ((spentToday / dailyIncome) * 100).toFixed(0);
    return `Hoje você gastou R$${spentToday.toFixed(2)}, o que representa ${percentage}% da sua renda diária.`;
};
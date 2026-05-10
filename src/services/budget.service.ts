export interface BudgetData {
  id: string;
  tripId: string;
  category: string;
  estimatedAmount: number | string;
  actualAmount: number | string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export const budgetService = {
  async getBudgets(tripId: string) {
    const res = await fetch(`/api/v1/trips/${tripId}/budget`);
    if (!res.ok) throw new Error('Failed to fetch budgets');
    return res.json() as Promise<{ success: boolean; data: BudgetData[] }>;
  },

  async updateBudget(budgetId: string, data: { estimatedAmount?: number; actualAmount?: number }) {
    const res = await fetch(`/api/v1/budget/${budgetId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update budget');
    return res.json() as Promise<{ success: boolean; data: BudgetData }>;
  }
};

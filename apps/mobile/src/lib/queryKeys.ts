// src/lib/queryKeys.ts
export const groupKeys = {
    all: ['groups'] as const,
    details: (groupId: number | string) => [...groupKeys.all, groupId] as const,
    balances: (groupId: number | string) => [...groupKeys.details(groupId), 'balances'] as const,
  };
  
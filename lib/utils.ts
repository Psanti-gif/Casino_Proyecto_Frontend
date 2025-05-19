import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to local format
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Calculate profit based on counters
export function calculateProfit(
  startIn: number,
  endIn: number,
  startOut: number,
  endOut: number,
  jackpot: number,
  billetero: number,
  denomination: number
): number {
  const inDiff = endIn - startIn;
  const outDiff = endOut - startOut;
  
  // Calculate played credits
  const playedCredits = inDiff - outDiff;
  
  // Convert to money based on denomination
  const playedMoney = playedCredits * denomination;
  
  // Calculate net profit
  const netProfit = playedMoney - jackpot - billetero;
  
  return netProfit;
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Check if user has permission
export function hasPermission(
  userRole: string,
  requiredRoles: string[]
): boolean {
  return requiredRoles.includes(userRole);
}
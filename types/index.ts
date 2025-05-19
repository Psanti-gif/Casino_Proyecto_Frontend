// Machine type
export interface Machine {
  id: string;
  brand: string;
  model: string;
  serial: string;
  assetCode: string;
  denomination: number;
  locationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Location type
export interface Location {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Counter Record type
export interface CounterRecord {
  id: string;
  machineId: string;
  date: string;
  inValue: number;
  outValue: number;
  jackpotValue: number;
  billeteroValue: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

// User type
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'Admin' | 'Support' | 'Operator';
  active: boolean;
  createdAt: string;
}

// Change Log type for audit trail
export interface ChangeLog {
  id: string;
  entityType: 'machine' | 'location' | 'counter' | 'user' | 'settings';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  changes: Record<string, { old: any; new: any }>;
  createdAt: string;
  userId: string;
}

// System Settings type
export interface SystemSettings {
  id: string;
  companyName: string;
  companyLogo?: string;
  theme: 'light' | 'dark' | 'system';
  defaultDenomination: number;
  currency: string;
  decimalPlaces: number;
  updatedAt: string;
  updatedBy: string;
}

// Report Filter type
export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  locationId?: string;
  machineId?: string;
  brand?: string;
  model?: string;
  profitThreshold?: number;
}

// Machine Balance type (calculated)
export interface MachineBalance {
  machineId: string;
  startDate: string;
  endDate: string;
  initialIn: number;
  finalIn: number;
  initialOut: number;
  finalOut: number;
  totalJackpot: number;
  totalBilletero: number;
  playedCredits: number;
  playedMoney: number;
  netProfit: number;
  denomination: number;
}

// Casino Balance type (calculated)
export interface CasinoBalance {
  locationId: string;
  startDate: string;
  endDate: string;
  machineCount: number;
  totalPlayedCredits: number;
  totalPlayedMoney: number;
  totalJackpot: number;
  totalBilletero: number;
  totalNetProfit: number;
  machineBalances: MachineBalance[];
}

// Profit Participation type
export interface ProfitParticipation {
  id: string;
  machineId: string;
  name: string;
  percentage: number;
  startDate: string;
  endDate?: string;
  active: boolean;
}
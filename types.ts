
export type DressType = 'soiree' | 'wedding' | 'engagement' | 'kids' | 'accessories';
export type DressQuality = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor' | 'very-poor';
export type DressStatus = 'available' | 'booked' | 'rented' | 'maintenance' | 'sold';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'network';
export type OperationType = 'rental' | 'sale';
export type ReturnCondition = 'intact' | 'needs_cleaning' | 'damaged';

export type AccountType = 'cash' | 'bank' | 'network' | 'revenue' | 'insurance_liability' | 'maintenance_expense' | 'operating_expense';
export type TransactionType = 'debit' | 'credit';

export type UserRole = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  password?: string;
  createdAt: string;
}

export interface WorkingDay {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface AppSettings {
  currency: string;
  paymentMethods: {
    id: PaymentMethod;
    label: string;
    enabled: boolean;
  }[];
  discountPresets: number[];
  businessHours: WorkingDay[];
  users: User[];
}

export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  account: AccountType;
  referenceId: string; // Rental ID or Expense ID
  description: string;
}

export interface OperatingExpense {
  id: string;
  amount: number;
  reason: string;
  date: string;
  category: string;
}

export interface AdditionalIncome {
  id: string;
  amount: number;
  category: string;
  categoryLabel?: string;
  reason: string;
  paymentMethod: PaymentMethod;
  customerName?: string;
  date: string;
  notes?: string;
}

export interface Dress {
  id: string;
  barcode: string;
  images: string[];
  name: string;
  type: DressType;
  material: string;
  style: string;
  color: string;
  description: string;
  size: string;
  designer: string;
  addedDate: string;
  costPrice: number;
  salePrice: number;
  rentalPrice: number;
  insurancePrice: number;
  quality: DressQuality;
  status: DressStatus;
  rentalCount: number;
  notes: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  idNumber?: string;
  address?: string;
  size?: string;
  weight?: string;
  height?: string;
  occasionDate?: string;
  notes?: string;
  history?: string[]; 
  isFlagged?: boolean; 
  isVIP?: boolean;
}

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'sick_leave';
export type FinancialRecordType = 'allowance' | 'bonus' | 'overtime_pay' | 'deduction' | 'advance';

export interface EmployeeAttendance {
  id: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  overtimeHours?: number;
  notes?: string;
}

export interface EmployeeFinancial {
  id: string;
  date: string;
  type: FinancialRecordType;
  amount: number;
  reason: string;
}

export interface EmployeeSalarySlipItem {
  id: string;
  type: FinancialRecordType;
  amount: number;
  reason: string;
  date: string;
}

export interface EmployeeMonthlySalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string; // e.g. "2026-10"
  monthLabel: string; // e.g. "أكتوبر 2026"
  closingDate: string; // e.g. "2026-10-19"
  baseSalary: number;
  totalAllowances: number;
  totalBonuses: number;
  totalOvertimePay: number;
  totalDeductions: number;
  totalAdvances: number;
  netSalary: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'network' | 'unpaid';
  status: 'paid' | 'closed';
  notes?: string;
  closedBy?: string;
  transactionId?: string;
  attendanceSnapshot?: {
    presentDays: number;
    absentDays: number;
    leaveDays: number;
    sickLeaveDays: number;
    overtimeHours: number;
  };
  financialItemsSnapshot?: EmployeeSalarySlipItem[];
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  position: string;
  salary: number;
  hireDate: string;
  notes?: string;
  attendance?: EmployeeAttendance[];
  financials?: EmployeeFinancial[];
  salaryRecords?: EmployeeMonthlySalaryRecord[];
}

export interface MaintenanceExpense {
  id: string;
  rentalId: string;
  dressId: string;
  amount: number;
  reason: string;
  date: string;
}

export interface Rental {
  id: string;
  items: {
    dressId: string;
    price: number;
  }[];
  customerId: string;
  operationType: OperationType;
  startDate?: string;
  endDate?: string;
  totalPrice: number;
  discount: number;
  depositPaid: number;
  insurancePaid: number;
  paymentMethod: PaymentMethod;
  status: 'booked' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  returnDetails?: {
    returnDate: string;
    condition: ReturnCondition;
    insuranceDeduction: number;
    maintenanceCost: number;
    notes: string;
  };
  customAddons?: string[];
  notes?: string; // Added field for measurement notes
}

export interface DailyShift {
  id: string;
  shiftNumber: number;
  openedAt: string;
  closedAt?: string;
  status: 'open' | 'closed';
  openedByUserId: string;
  openedByUserName: string;
  closedByUserId?: string;
  closedByUserName?: string;
  openingCash: number;
  closingActualCash?: number;
  closingExpectedCash?: number;
  cashDifference?: number;
  openingInsuranceCash?: number;
  closingActualInsuranceCash?: number;
  closingExpectedInsuranceCash?: number;
  insuranceCashDifference?: number;
  notes?: string;
  closingNotes?: string;
  summary?: {
    totalCashIn: number;
    totalCashOut: number;
    netCash: number;
    cardPayments: number;
    bankPayments: number;
    totalRevenue: number;
    newBookingsCount: number;
    handoversCount: number;
    returnsCount: number;
    activeInsurancesBalance: number;
    activeInsurancesCount: number;
    // Separated Insurance Drawer metrics
    insuranceCashIn?: number;
    insuranceCashOut?: number;
    insuranceCashDeducted?: number;
    insuranceElectronicIn?: number;
    insuranceElectronicOut?: number;
    activeInsurancesCashBalance?: number;
    activeInsurancesElectronicBalance?: number;
    // Breakdown of operations cash
    depositsCashIn?: number;
    handoversCashIn?: number;
    otherOperationsCashIn?: number;
    operatingExpensesCashOut?: number;
    maintenanceCashOut?: number;
  };
}

export type NotificationCategory = 'delivery' | 'return' | 'offer_alert' | 'due_today' | 'overdue' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationCategory;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  rentalId?: string;
  dressId?: string;
  dressName?: string;
  dressBarcode?: string;
  customerName?: string;
  rentalCount?: number;
  actionTab?: string;
}

export interface AppState {
  dresses: Dress[];
  customers: Customer[];
  employees: Employee[];
  rentals: Rental[];
  expenses: MaintenanceExpense[];
  operatingExpenses: OperatingExpense[];
  additionalIncomes?: AdditionalIncome[];
  transactions: FinancialTransaction[];
  shifts?: DailyShift[];
  notifications?: AppNotification[];
  settings: AppSettings;
  language: 'ar' | 'en';
  currentUser: User | null;
}

export type Action =
  | { type: 'ADD_DRESS'; payload: Dress }
  | { type: 'UPDATE_DRESS'; payload: Dress }
  | { type: 'DELETE_DRESS'; payload: string }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'CLOSE_EMPLOYEE_SALARY'; payload: { employeeId: string; record: EmployeeMonthlySalaryRecord; recordTransaction: boolean } }
  | { type: 'DELETE_SALARY_RECORD'; payload: { employeeId: string; recordId: string } }
  | { type: 'ADD_RENTAL'; payload: Rental }
  | { type: 'UPDATE_RENTAL'; payload: Rental }
  | { type: 'UPDATE_RENTAL_NOTES'; payload: { id: string; notes: string } }
  | { type: 'RETURN_RENTAL'; payload: { rentalId: string, returnData: NonNullable<Rental['returnDetails']>, expense?: MaintenanceExpense } }
  | { type: 'UPDATE_RENTAL_STATUS'; payload: { id: string; status: Rental['status'] } }
  | { type: 'CANCEL_RENTAL'; payload: { id: string; penalty: number } }
  | { type: 'DELETE_RENTAL'; payload: string }
  | { type: 'ADD_OPERATING_EXPENSE'; payload: OperatingExpense }
  | { type: 'DELETE_OPERATING_EXPENSE'; payload: string }
  | { type: 'ADD_INCOME'; payload: AdditionalIncome }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'OPEN_SHIFT'; payload: { openingCash: number; openingInsuranceCash?: number; notes?: string } }
  | { type: 'CLOSE_SHIFT'; payload: { shiftId: string; closingActualCash: number; closingActualInsuranceCash?: number; closingExpectedInsuranceCash?: number; notes?: string; summary: NonNullable<DailyShift['summary']> } }
  | { type: 'DELETE_SHIFT'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: AppSettings }
  | { type: 'SET_LANGUAGE'; payload: 'ar' | 'en' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'RESET_FINANCIALS' };

export enum ModificationType {
  REFACTOR = 'REFACTOR',
  BUG_FIX = 'BUG_FIX',
  OPTIMIZE = 'OPTIMIZE',
  ADD_COMMENTS = 'ADD_COMMENTS',
  CONVERT_LANG = 'CONVERT_LANG',
  CUSTOM = 'CUSTOM',
}

export enum ModelType {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview',
}

export interface GenerateRequest {
  model: string;
  input: string;
  type: ModificationType;
  customInstruction?: string;
}

export interface GenerateResponse {
  text: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  type: ModificationType;
  original: string;
  result: string;
  timestamp: number;
  customInstruction?: string;
}

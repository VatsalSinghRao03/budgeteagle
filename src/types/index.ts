
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'hr' | 'manager' | 'finance';
  department: string;
  avatar?: string;
}

export interface AppUser extends User {
  // Additional fields for app-specific user data
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  description: string;
  fileUrl?: string;
  fileName?: string;
  submittedBy: string;
  submitterName: string;
  submitterDepartment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface AppStats {
  totalRequests: number;
  totalAmount: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
}

import { api } from "./client";

export type ParentDashboardResponse = {
  stats: {
    requirements: number;
    unlocks: number;
    payments: number;
  };
  requirements: Array<{
    id: number;
    child_name: string;
    class_name: string;
    board: string;
    city: string;
    area: string;
    budget: number;
    preferred_time: string;
    status: string;
    created_at: string;
  }>;
  payments: Array<{
    id: number;
    amount: number;
    purpose: string;
    status: string;
    created_at: string;
  }>;
};

export type TutorDashboardResponse = {
  stats: {
    availabilities: number;
    unlocks: number;
    payments: number;
  };
  profile: {
    bio: string | null;
    experience_years: number;
    fees: number | null;
    subjects: string[];
    class_range: string | null;
    approved_status: string;
  } | null;
  availabilities: Array<{
    id: number;
    subjects: string[];
    class_range: string;
    city: string;
    area: string;
    fees: number;
    available_time: string;
    approved_status: string;
    created_at: string;
  }>;
  subscription: {
    plan_name: string;
    lead_credits: number;
    price: number;
    ends_at: string;
  } | null;
  payments: Array<{
    id: number;
    amount: number;
    purpose: string;
    status: string;
    created_at: string;
  }>;
};

export type AdminDashboardResponse = {
  analytics: {
    users: number;
    payments: number;
    verified_payments: number;
    parent_leads: number;
    tutor_leads: number;
    lead_unlocks: number;
  };
  recent_payments: Array<{
    id: number;
    amount: number;
    purpose: string;
    status: string;
    created_at: string;
  }>;
  pending_tutors: Array<{
    id: number;
    approved_status: string;
    experience_years: number;
    subjects: string[];
    class_range: string | null;
  }>;
  pending_leads: Array<{
    id: number;
    tutor_name: string;
    subjects: string[];
    city: string;
    approved_status: string;
    created_at: string;
  }>;
};

export async function fetchParentDashboard() {
  const response = await api.get<ParentDashboardResponse>("/parent/dashboard");
  return response.data;
}

export async function fetchTutorDashboard() {
  const response = await api.get<TutorDashboardResponse>("/tutor/dashboard");
  return response.data;
}

export async function fetchAdminDashboard() {
  const response = await api.get<AdminDashboardResponse>("/admin/dashboard");
  return response.data;
}


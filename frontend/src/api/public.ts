import { api } from "./client";

export type TutorListing = {
  id: number;
  name: string;
  bio: string | null;
  subjects: string[];
  class_range: string | null;
  experience_years: number;
  fees: number | null;
  modes: string[];
  featured: boolean;
  profile_photo_url: string | null;
};

export type ParentLeadListing = {
  id: number;
  parent_name: string;
  child_name: string;
  class_name: string;
  board: string;
  subjects: string[];
  mode: string;
  city: string;
  area: string;
  budget: number;
  preferred_time: string;
  status: string;
  notes: string | null;
  created_at: string;
};

export type ReviewListing = {
  id: number;
  rating: number;
  comment: string | null;
  parent_name: string;
  tutor_name: string;
};

export type DirectoryItem = {
  id: number;
  name: string;
};

export async function fetchTutors(params?: { city?: string; subject?: string }) {
  const response = await api.get<TutorListing[]>("/public/tutors", { params });
  return response.data;
}

export async function fetchParentLeads(params?: { city?: string; subject?: string }) {
  const response = await api.get<ParentLeadListing[]>("/public/parent-leads", { params });
  return response.data;
}

export async function fetchReviews() {
  const response = await api.get<ReviewListing[]>("/public/reviews");
  return response.data;
}

export async function fetchCities() {
  const response = await api.get<DirectoryItem[]>("/public/cities");
  return response.data;
}

export async function fetchSubjects() {
  const response = await api.get<DirectoryItem[]>("/public/subjects");
  return response.data;
}


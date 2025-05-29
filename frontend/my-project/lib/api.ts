// Centralized API utilities for resume CRUD operations
// Uses fetch and expects a Bearer token for authentication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/resumes";

export async function fetchResumeById(token: string, resumeId: string) {
  const res = await fetch(`${API_BASE_URL}/${resumeId}`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Failed to fetch resume");
  return res.json();
}

export async function fetchResumes(token: string) {
  const res = await fetch(`${API_BASE_URL}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Failed to fetch resumes");
  return res.json();
}

export async function deleteResume(token: string, resumeId: string) {
  const res = await fetch(`${API_BASE_URL}/${resumeId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Failed to delete resume");
  return res.json();
}

import type { ResumeData } from "@/app/types";

export async function createResume(token: string, resume: ResumeData) {
  const res = await fetch(`${API_BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(resume),
    credentials: "include",
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Failed to create resume");
  return res.json();
}

export async function updateResume(token: string, resumeId: string, resume: ResumeData) {
  const res = await fetch(`${API_BASE_URL}/${resumeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(resume),
    credentials: "include",
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Failed to update resume");
  return res.json();
}

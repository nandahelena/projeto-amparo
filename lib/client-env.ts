"use client";

export function getPublicBackendUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
}

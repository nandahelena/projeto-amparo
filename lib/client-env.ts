"use client";

export function getPublicBackendUrl() {
  // Force build-time injection of NEXT_PUBLIC_BACKEND_URL
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  console.log('[client-env] Backend URL:', url);
  return url;
}

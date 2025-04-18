"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Admin = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type AdminContextType = {
  admin: Admin | null;
  isLoading: boolean;
  error: string | null;
  refreshAdmin: () => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch admin data");
      }

      const data = await response.json();
      setAdmin(data.admin);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const refreshAdmin = async () => {
    await fetchAdminData();
  };

  return (
    <AdminContext.Provider value={{ admin, isLoading, error, refreshAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
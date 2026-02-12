import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import type { Bike, InsertBike, BikeFilterParams } from "@shared/schema";

// Type guard for valid API responses
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    // In production, we might return a fallback or rethrow. 
    // Here we throw to catch integration issues early.
    throw result.error;
  }
  return result.data;
}

// GET /api/bikes (List with filters)
export function useBikes(filters?: BikeFilterParams) {
  // Create a stable query key based on filters
  const queryKey = [api.bikes.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Construct URL with query params
      const url = new URL(api.bikes.list.path, window.location.origin);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bikes");
      
      const data = await res.json();
      return parseWithLogging(api.bikes.list.responses[200], data, "bikes.list");
    },
  });
}

// GET /api/bikes/:id (Detail)
export function useBike(id: number) {
  return useQuery({
    queryKey: [api.bikes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.bikes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch bike details");
      
      const data = await res.json();
      return parseWithLogging(api.bikes.get.responses[200], data, "bikes.get");
    },
    enabled: !!id,
  });
}

// POST /api/bikes (Create - for admin/seeding mostly)
export function useCreateBike() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bike: InsertBike) => {
      const res = await fetch(api.bikes.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bike),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create bike: ${errorText}`);
      }
      
      const data = await res.json();
      return parseWithLogging(api.bikes.create.responses[201], data, "bikes.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bikes.list.path] });
    },
  });
}

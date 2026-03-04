import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Bike, InsertBike, BikeFilterParams } from "@shared/schema";


// GET /api/bikes (List with filters)
export function useBikes(filters?: BikeFilterParams) {
  // Create a stable query key based on filters
  const queryKey = [api.bikes.list.path, filters];

  return useQuery({
    queryKey,
    retry: 1,
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
      if (!res.ok) throw new Error(`Failed to fetch bikes: ${res.status}`);

      return res.json() as Promise<Bike[]>;
    },
  });
}

// GET /api/bikes/:id (Detail)
export function useBike(id: number) {
  return useQuery({
    queryKey: [api.bikes.get.path, id],
    retry: 1,
    queryFn: async () => {
      const url = buildUrl(api.bikes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });

      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to fetch bike details: ${res.status}`);

      return res.json() as Promise<Bike | null>;
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

      return res.json() as Promise<Bike>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.bikes.list.path] });
    },
  });
}

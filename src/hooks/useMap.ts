import { useQuery } from "@tanstack/react-query";
import mapService, { type MapBounds } from "../services/mapService";

// Get posts within map bounds
export function useMapPosts(bounds: MapBounds | null, plantType?: string) {
  return useQuery({
    queryKey: ["map", "posts", bounds, plantType],
    queryFn: () => mapService.getMapPosts(bounds!, plantType),
    enabled: !!bounds,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5,
  });
}

// Get posts near a location
export function useNearbyPosts(lat?: number, lng?: number, radius: number = 5) {
  return useQuery({
    queryKey: ["map", "nearby", lat, lng, radius],
    queryFn: () => mapService.getNearbyPosts([lat!, lng!], radius),
    enabled: typeof lat === "number" && typeof lng === "number",
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5,
  });
}

// Get map statistics
export function useMapStatistics() {
  return useQuery({
    queryKey: ["map", "statistics"],
    queryFn: () => mapService.getMapStatistics(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 30,
  });
}

// Get posts in a cluster
export function useClusterPosts(clusterId: string | null) {
  return useQuery({
    queryKey: ["map", "cluster", clusterId],
    queryFn: () => mapService.getClusterPosts(clusterId!),
    enabled: !!clusterId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5,
  });
}

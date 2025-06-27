import api from "./api";
import { type Post } from "./postsService";

// Types
export interface MapBounds {
  north: number; // Max lat
  south: number; // Min lat
  east: number; // Max lng
  west: number; // Min lng
}

export interface MapPost extends Omit<Post, "location"> {
  location: {
    coordinates: [number, number];
    name?: string;
  };
}

export interface MapCluster {
  id: string;
  coordinates: [number, number];
  count: number;
  postIds?: string[];
}

export interface MapData {
  posts: MapPost[];
  clusters: MapCluster[];
}

export interface MapStats {
  totalPlants: number;
  topRegions: Array<{ name: string; count: number }>;
  mostPlantedType: string;
}

class MapService {
  // Get posts within a map bounds
  async getMapPosts(bounds: MapBounds, plantType?: string): Promise<MapData> {
    return api.get("/map/posts", {
      params: {
        ...bounds,
        plantType,
      },
    });
  }

  // Get posts near a specific location
  async getNearbyPosts(
    coordinates: [number, number],
    radius: number = 5
  ): Promise<MapPost[]> {
    return api.get("/map/nearby", {
      params: { latitude: coordinates[0], longitude: coordinates[1], radius },
    });
  }

  // Get map statistics
  async getMapStatistics(): Promise<MapStats> {
    return api.get("/map/statistics");
  }

  // Get post details from cluster
  async getClusterPosts(clusterId: string): Promise<MapPost[]> {
    return api.get(`/map/clusters/${clusterId}`);
  }
}

export const mapService = new MapService();
export default mapService;

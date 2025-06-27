import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { motion } from "framer-motion";
import { Filter, TreePine, Sprout, Info, Loader2 } from "lucide-react";

import { useNearbyPosts } from "../hooks/usePosts";
import type { Post, NearbyPostsFilters } from "../services/postsService";
import { createCustomMarkerIcon, getMapOptions } from "../utils/mapHelpers";

// Set your Google Maps API key here
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface MapFilter {
  plantType: string;
  timeRange: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194, // San Francisco
};

const CommunityMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [filter, setFilter] = useState<MapFilter>({
    plantType: "all",
    timeRange: "all",
  });

  const mapRef = useRef<GoogleMap>(null);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default center
          setUserLocation(defaultCenter);
        }
      );
    } else {
      // Fallback to default center
      setUserLocation(defaultCenter);
    }
  }, []);

  // Prepare filters for API
  const apiFilters: NearbyPostsFilters | null = useMemo(() => {
    if (!userLocation) return null;

    return {
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      radius: 10, // 10km radius
      plantType: filter.plantType === "all" ? undefined : filter.plantType,
      timeRange:
        filter.timeRange === "all" ? undefined : (filter.timeRange as any),
      limit: 100,
    };
  }, [userLocation, filter]);

  // Fetch nearby posts
  const {
    data: posts = { posts: [], totalCount: 0, hasMore: false },
    isLoading,
    error,
  } = useNearbyPosts(apiFilters!);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalPlants: posts.posts.length,
      co2Saved: posts.posts.length * 21.77, // Average CO2 absorbed per tree per year in kg
    };
  }, [posts]);

  const onMarkerClick = useCallback((post: Post) => {
    setSelectedPost(post);
  }, []);

  const onInfoWindowClose = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      if (userLocation) {
        map.setCenter(userLocation); // Set center to user location
        map.setZoom(12); // City-level zoom
      }
    },
    [userLocation]
  );

  const onUnmount = useCallback((_: any) => {}, []);

  if (!isLoaded) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-muted">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-muted">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      {/* Map Container */}
      <GoogleMap
        ref={mapRef}
        mapContainerStyle={mapContainerStyle}
        center={userLocation}
        zoom={10}
        options={getMapOptions()}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Markers */}
        {posts.posts.map((post) => {
          if (!post.location) return null;

          return (
            <Marker
              key={post.id}
              position={{
                lat: post.location.coordinates[1],
                lng: post.location.coordinates[0],
              }}
              onClick={() => onMarkerClick(post)}
              icon={createCustomMarkerIcon(post.userAvatar, post.userName)}
            />
          );
        })}

        {/* Info Window */}
        {selectedPost && selectedPost.location && (
          <InfoWindow
            position={{
              lat: selectedPost.location.coordinates[1],
              lng: selectedPost.location.coordinates[0],
            }}
            onCloseClick={onInfoWindowClose}
          >
            <div className="p-2 max-w-xs">
              <div className="flex items-center mb-2">
                {selectedPost.userAvatar ? (
                  <img
                    src={selectedPost.userAvatar}
                    alt={selectedPost.userName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center mr-2">
                    <span className="text-primary font-semibold text-sm">
                      {selectedPost.userName.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-sm">
                  {selectedPost.userName}
                </h3>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {selectedPost.caption.substring(0, 100)}...
              </p>
              <span className="inline-block px-2 py-1 bg-primary-light text-primary text-xs rounded-full capitalize">
                {selectedPost.plantType}
              </span>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Filter Panel */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64 z-10"
      >
        <div className="flex items-center mb-4">
          <Filter className="text-primary mr-2" size={20} />
          <h3 className="font-heading font-semibold text-text dark:text-white">
            Filters
          </h3>
        </div>

        {/* Plant Type Filter */}
        <div className="mb-4">
          <label className="text-sm font-medium text-text-muted dark:text-gray-300 mb-2 block">
            Plant Type
          </label>
          <select
            value={filter.plantType}
            onChange={(e) =>
              setFilter({ ...filter, plantType: e.target.value })
            }
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Plants</option>
            <option value="tree">Trees</option>
            <option value="flower">Flowers</option>
            <option value="herb">Herbs</option>
            <option value="palm">Palms</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Time Range Filter */}
        <div className="mb-4">
          <label className="text-sm font-medium text-text-muted dark:text-gray-300 mb-2 block">
            Time Period
          </label>
          <select
            value={filter.timeRange}
            onChange={(e) =>
              setFilter({ ...filter, timeRange: e.target.value })
            }
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />
            <span className="text-sm text-text-muted">Loading posts...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-2">
            <span className="text-sm text-red-500">
              Failed to load nearby posts
            </span>
          </div>
        )}
      </motion.div>

      {/* Stats Panel */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-10"
      >
        <h3 className="font-heading font-semibold text-text dark:text-white mb-3">
          Community Impact
        </h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <TreePine className="text-primary mr-2" size={20} />
            <div>
              <p className="text-sm text-text-muted dark:text-gray-300">
                Plants
              </p>
              <p className="text-xl font-bold text-primary">
                {stats.totalPlants}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Sprout className="text-primary mr-2" size={20} />
            <div>
              <p className="text-sm text-text-muted dark:text-gray-300">
                CO₂ Saved
              </p>
              <p className="text-xl font-bold text-primary">
                {stats.co2Saved.toFixed(1)} tons
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-10"
      >
        <div className="flex items-center mb-2">
          <Info className="text-primary mr-2" size={16} />
          <h4 className="font-medium text-text dark:text-white">Legend</h4>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-2" />
            <span className="text-text-muted dark:text-gray-300">
              User location
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent rounded-full mr-2" />
            <span className="text-text-muted dark:text-gray-300">
              Plant cluster
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CommunityMap;

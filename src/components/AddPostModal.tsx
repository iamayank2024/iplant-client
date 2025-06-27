import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  X,
  Upload,
  MapPin,
  TreePine,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import { type AppDispatch } from "../store";
import { closeAddPostModal } from "../store/uiSlice";
import { useCreatePost } from "../hooks/usePosts";
import type { CreatePostRequest } from "../services/postsService";

interface PostFormData {
  caption: string;
  plantType: string;
}

const AddPostModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    name?: string;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Use the createPost mutation hook
  const createPostMutation = useCreatePost();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PostFormData>();

  // Get user location
  const fetchLocation = useCallback(async () => {
    setLoadingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const { latitude, longitude } = position.coords;
      setLocation({
        lat: latitude,
        lng: longitude,
        name: "Current Location",
      });
      toast.success("Location added!");
    } catch (error) {
      toast.error("Could not get your location");
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const onSubmit = async (data: PostFormData) => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      // Create post data object
      const postData: CreatePostRequest = {
        caption: data.caption,
        plantType: data.plantType,
        imageFile: imageFile,
        location: location
          ? {
              coordinates: [location.lng, location.lat] as [number, number],
              name: location.name,
            }
          : undefined,
      };

      // Call the create post mutation
      await createPostMutation.mutateAsync(postData);

      // Close the modal after successful post creation
      handleClose();
    } catch (error) {
      toast.error("Failed to create post");
      console.error("Error creating post:", error);
    }
  };

  const handleClose = () => {
    dispatch(closeAddPostModal());
    reset();
    setImageFile(null);
    setImagePreview(null);
    setLocation(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border dark:border-gray-700">
            <h2 className="text-2xl font-heading font-semibold text-text dark:text-white flex items-center">
              <TreePine className="mr-2 text-primary" size={28} />
              Plant Something New
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-secondary dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={24} className="text-text-muted" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text dark:text-white mb-2">
                Plant Photo
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-primary bg-primary-light/10"
                    : "border-border dark:border-gray-700 hover:border-primary"
                }`}
              >
                <input {...getInputProps()} />
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-card dark:bg-gray-800 rounded-full shadow-lg"
                    >
                      <X size={20} className="text-text-muted" />
                    </button>
                  </div>
                ) : (
                  <div className="py-8">
                    <ImageIcon
                      className="mx-auto mb-4 text-text-muted"
                      size={48}
                    />
                    <p className="text-text-muted mb-2">
                      {isDragActive
                        ? "Drop your image here"
                        : "Drag & drop your image here, or click to browse"}
                    </p>
                    <p className="text-xs text-text-muted">
                      JPG, PNG, GIF, WEBP up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Caption */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text dark:text-white mb-2">
                Caption
              </label>
              <textarea
                {...register("caption", {
                  required: "Caption is required",
                  maxLength: {
                    value: 500,
                    message: "Caption must be less than 500 characters",
                  },
                })}
                rows={3}
                className="w-full px-4 py-3 bg-card dark:bg-gray-700 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Tell us about your plant..."
              />
              {errors.caption && (
                <p className="mt-1 text-sm text-error">
                  {errors.caption.message}
                </p>
              )}
            </div>

            {/* Plant Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text dark:text-white mb-2">
                Plant Type
              </label>
              <select
                {...register("plantType", {
                  required: "Please select a plant type",
                })}
                className="w-full px-4 py-3 bg-card dark:bg-gray-700 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Select a type</option>
                <option value="tree">Tree</option>
                <option value="flower">Flower</option>
                <option value="shrub">Shrub</option>
                <option value="herb">Herb</option>
                <option value="vegetable">Vegetable</option>
                <option value="fruit">Fruit</option>
                <option value="succulent">Succulent</option>
                <option value="other">Other</option>
              </select>
              {errors.plantType && (
                <p className="mt-1 text-sm text-error">
                  {errors.plantType.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-text dark:text-white">
                  Location (Optional)
                </label>
                <button
                  type="button"
                  onClick={fetchLocation}
                  className="text-xs flex items-center text-primary hover:text-primary-dark transition-colors"
                  disabled={loadingLocation}
                >
                  {loadingLocation ? (
                    <Loader2 className="animate-spin mr-1" size={14} />
                  ) : (
                    <MapPin size={14} className="mr-1" />
                  )}
                  {loadingLocation
                    ? "Getting location..."
                    : "Use current location"}
                </button>
              </div>
              <div className="flex items-center px-4 py-3 bg-card dark:bg-gray-700 border border-border dark:border-gray-600 rounded-lg">
                {location ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <MapPin className="text-primary mr-2" size={18} />
                      <span className="text-text dark:text-white">
                        {location.name || "Current Location"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocation(null)}
                      className="p-1 hover:bg-secondary dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                      <X size={16} className="text-text-muted" />
                    </button>
                  </div>
                ) : (
                  <span className="text-text-muted">No location added</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-border dark:border-gray-600 rounded-lg text-text dark:text-white hover:bg-secondary dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || createPostMutation.isPending}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center"
              >
                {createPostMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Posting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2" size={18} />
                    Post Plant
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddPostModal;

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useUpdateProfile } from "../hooks/useUser";

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const updateProfileMutation = useUpdateProfile();

  // Handle file drop
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

  const handleSubmit = async () => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        avatar: imageFile,
      });
      onClose();
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to update profile picture");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border dark:border-gray-700">
            <h2 className="text-lg font-heading font-semibold text-text dark:text-white">
              Update Profile Picture
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} className="text-text-muted" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
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
                    className="w-48 h-48 rounded-full object-cover mx-auto"
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
                      : "Drag & drop your profile picture here, or click to browse"}
                  </p>
                  <p className="text-xs text-text-muted">
                    JPG, PNG, GIF, WEBP up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-4 border-t border-border dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border dark:border-gray-600 rounded-lg text-text dark:text-white hover:bg-secondary dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={updateProfileMutation.isPending}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={18} />
                  Upload
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfilePictureModal;

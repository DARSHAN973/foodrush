"use client";

import { useState, useRef } from "react";
import { uploadImageAction } from "@/app/actions/uploadActions";

export default function ImageUpload({ onUploadSuccess, defaultImageUrl = "" }) {
  const [previewUrl, setPreviewUrl] = useState(defaultImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Client-side Validation (size limit 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size is too large (max 5MB)");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    setError("");
    setIsUploading(true);

    // 2. Set instant local preview URL for beautiful UX
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // 3. Prepare FormData and call the Server Action
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadImageAction(formData);

      if (result.error) {
        setError(result.error);
        setPreviewUrl(defaultImageUrl); // rollback preview on error
      } else if (result.success && result.url) {
        onUploadSuccess(result.url);
      }
    } catch (err) {
      setError("An unexpected error occurred during upload");
      setPreviewUrl(defaultImageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Restaurant Image
      </label>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

      {/* Uploader Box */}
      <div
        onClick={!isUploading ? triggerFileInput : undefined}
        className={`relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
          isUploading
            ? "border-orange-300 bg-orange-50/10 cursor-not-allowed"
            : "border-gray-300 bg-gray-50/50 hover:border-orange-500 hover:bg-orange-50/20"
        }`}
      >
        {previewUrl ? (
          <div className="relative h-full w-full p-2">
            {/* Image Preview */}
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full rounded-lg object-cover"
            />
            {/* Hover overlay indicator */}
            {!isUploading && (
              <div className="absolute inset-2 flex items-center justify-center rounded-lg bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs font-semibold text-white">
                  Click to change image
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-4">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-lg">
              📷
            </div>
            <p className="mt-2 text-xs font-medium text-gray-700">
              Click to select or upload image
            </p>
            <p className="mt-1 text-[10px] text-gray-400">
              Supports JPEG, PNG, WEBP (Max 5MB)
            </p>
          </div>
        )}

        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/80">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <span className="mt-2 text-xs font-semibold text-orange-600">
              Uploading to Cloudinary...
            </span>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

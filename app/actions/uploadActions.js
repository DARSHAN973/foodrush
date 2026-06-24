"use server";

import { uploadImageToCloudinary } from "@/lib/cloudinary";

/**
 * Server Action: Uploads an image file received from a client component to Cloudinary.
 * @param {FormData} formData - Form data containing the key 'file'
 */
export async function uploadImageAction(formData) {
  try {
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return { error: "No valid file selected" };
    }

    // 1. Convert Web API File object (browser format) to standard array buffer
    const arrayBuffer = await file.arrayBuffer();

    // 2. Convert array buffer to Node.js Buffer for stream piping
    const buffer = Buffer.from(arrayBuffer);

    // 3. Trigger your utility stream helper
    const uploadResult = await uploadImageToCloudinary(buffer);

    return {
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };
  } catch (error) {
    console.error("Upload action crash:", error);
    return { error: error.message || "Failed to upload image to Cloudinary" };
  }
}

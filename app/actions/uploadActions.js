"use server";

import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function uploadImageAction(formData) {
  try {
    const file = formData.get("file");

    // Guard clause: Ensures the received form field is a valid Web API File object 
    // rather than plain text, preventing runtime errors on type mismatch.
    if (!file || !(file instanceof File)) {
      return { error: "No valid file selected" };
    }

    // Web-to-Node bridge: A browser File object is a client-side metadata pointer. 
    // Since Node.js SDKs cannot read browser File objects directly:
    // 1. Read raw binary bytes from the file into a standard JavaScript ArrayBuffer.
    const arrayBuffer = await file.arrayBuffer();

    // 2. Wrap the ArrayBuffer in a Node-native Buffer class to prepare it for streaming.
    const buffer = Buffer.from(arrayBuffer);

    // 3. Trigger our custom utility which pipes the Node Buffer to Cloudinary.
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

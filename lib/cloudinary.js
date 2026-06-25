import { v2 as cloudinary } from "cloudinary";

// Configure via environment variables
// Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Debug logging in development
if (process.env.NODE_ENV === "development") {
  console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "NOT SET",
    api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET",
  });
}

export default cloudinary;

export async function uploadImageToCloudinary(imageBuffer, options = {}) {
  try {
    const {
      folder = "food-rush",
      public_id,
      overwrite = false,
      transformation,
    } = options;

    // Validate environment variables
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error(
        "Missing Cloudinary environment variables. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET",
      );
    }

    // Validate buffer length. Node.js Buffers behave like specialized arrays of bytes,
    // so imageBuffer.length returns the exact byte count (e.g. 1048576 for 1MB).
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("Invalid image buffer provided");
    }

    console.log("Attempting Cloudinary upload with options:", {
      folder,
      public_id,
      overwrite,
    });
    console.log("Image buffer size:", imageBuffer.length, "bytes");

    // The Cloudinary Node.js SDK's upload_stream is legacy callback-based and does not
    // support async/await natively. We wrap it in a custom Promise so we can pause
    // server execution until the remote upload succeeds (resolve) or fails (reject).
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id,
          overwrite,
          transformation,
          resource_type: "auto", // Automatically detect media type (image, video, etc.)
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload_stream error:", error);
            console.error("Error details:", {
              message: error.message,
              http_code: error.http_code,
              name: error.name,
            });
            reject(error); // Trigger try/catch block error path
          } else {
            console.log("Cloudinary upload successful:", result.secure_url);
            console.log("Upload details:", {
              public_id: result.public_id,
              format: result.format,
              bytes: result.bytes,
            });
            resolve(result); // Pass the populated Cloudinary response object back
          }
        },
      );

      // Writes the binary Buffer into the Cloudinary stream and closes it.
      // Without stream.end(), the connection would stay open and hang indefinitely.
      stream.end(imageBuffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImageFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedImageUrl(publicId, options = {}) {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    format,
    secure: true,
  });
}

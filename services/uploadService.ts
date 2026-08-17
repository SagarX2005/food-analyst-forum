import { createClient } from "@lib/supabase/client";

export type BucketName = "avatars" | "company-logos" | "resumes" | "resources" | "course-materials";

export interface UploadOptions {
  bucket: BucketName;
  file: File;
  userId: string;
  onProgress?: (progress: number) => void;
}

export class UploadService {
  /**
   * Upload file to Supabase Storage bucket and return public URL
   */
  public static async uploadFile({ bucket, file, userId, onProgress }: UploadOptions): Promise<string> {
    const supabase = createClient();

    // 1. Validate file size (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error("File size exceeds 5MB limit.");
    }

    // 2. Generate unique filename path
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    if (onProgress) onProgress(20);

    // 3. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    if (onProgress) onProgress(80);

    // 4. Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    if (onProgress) onProgress(100);

    return publicUrl;
  }
}

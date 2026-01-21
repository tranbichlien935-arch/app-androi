/**
 * Image Utilities for Firebase Storage Upload
 * Provides helper functions for image processing and validation
 */

/**
 * Convert image URI to Blob object
 * Works for both web and mobile platforms
 * @param {string} uri - Image URI (can be from ImagePicker, Camera, or local file)
 * @returns {Promise<Blob>} Image blob
 */
export async function convertImageToBlob(uri) {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    } catch (error) {
        throw new Error('Không thể chuyển đổi hình ảnh: ' + error.message);
    }
}

/**
 * Validate image file size
 * @param {Blob} blob - Image blob
 * @param {number} maxSizeMB - Maximum size in MB (default: 5MB)
 * @returns {boolean} True if valid
 * @throws {Error} If file is too large
 */
export function validateImageSize(blob, maxSizeMB = 5) {
    const maxBytes = maxSizeMB * 1024 * 1024;

    if (blob.size > maxBytes) {
        throw new Error(`Hình ảnh quá lớn. Kích thước tối đa: ${maxSizeMB}MB`);
    }

    return true;
}

/**
 * Validate image file type
 * @param {Blob} blob - Image blob
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @returns {boolean} True if valid
 * @throws {Error} If file type is not allowed
 */
export function validateImageType(blob, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']) {
    if (!allowedTypes.includes(blob.type)) {
        throw new Error(`Định dạng không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`);
    }

    return true;
}

/**
 * Resize image to maximum dimensions while maintaining aspect ratio
 * @param {string} uri - Image URI
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<Blob>} Resized image blob
 */
export async function resizeImage(uri, maxWidth = 1024, maxHeight = 1024) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            // Calculate new dimensions
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            // Create canvas and resize
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Không thể resize hình ảnh'));
                    }
                },
                'image/jpeg',
                0.9 // Quality: 90%
            );
        };

        img.onerror = () => {
            reject(new Error('Không thể load hình ảnh'));
        };

        img.src = uri;
    });
}

/**
 * Compress image quality
 * @param {Blob} blob - Image blob
 * @param {number} quality - Compression quality (0-1, default: 0.8)
 * @returns {Promise<Blob>} Compressed image blob
 */
export async function compressImage(blob, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(
                    (compressedBlob) => {
                        if (compressedBlob) {
                            resolve(compressedBlob);
                        } else {
                            reject(new Error('Không thể nén hình ảnh'));
                        }
                    },
                    blob.type,
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error('Không thể load hình ảnh'));
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            reject(new Error('Không thể đọc file'));
        };

        reader.readAsDataURL(blob);
    });
}

/**
 * Generate unique filename for upload
 * @param {string} userId - User ID
 * @param {string} prefix - Filename prefix (default: 'profile')
 * @param {string} extension - File extension (default: 'jpg')
 * @returns {string} Unique filename
 */
export function generateUniqueFilename(userId, prefix = 'profile', extension = 'jpg') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${prefix}_${userId}_${timestamp}_${random}.${extension}`;
}

/**
 * Extract file extension from blob type
 * @param {Blob} blob - Image blob
 * @returns {string} File extension (e.g., 'jpg', 'png')
 */
export function getFileExtension(blob) {
    const mimeToExt = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
    };

    return mimeToExt[blob.type] || 'jpg';
}

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., '2.5 MB')
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Process image before upload
 * Combines validation, resizing, and compression
 * @param {string} uri - Image URI
 * @param {Object} options - Processing options
 * @returns {Promise<{blob: Blob, filename: string, size: string}>}
 */
export async function processImageForUpload(uri, options = {}) {
    const {
        userId = 'unknown',
        maxWidth = 1024,
        maxHeight = 1024,
        maxSizeMB = 5,
        quality = 0.85,
        resize = true,
        compress = true,
    } = options;

    try {
        // Step 1: Convert to blob
        let blob = await convertImageToBlob(uri);

        // Step 2: Validate type
        validateImageType(blob);

        // Step 3: Resize if needed
        if (resize) {
            blob = await resizeImage(uri, maxWidth, maxHeight);
        }

        // Step 4: Compress if needed
        if (compress && blob.size > 500 * 1024) { // Only compress if > 500KB
            blob = await compressImage(blob, quality);
        }

        // Step 5: Final size validation
        validateImageSize(blob, maxSizeMB);

        // Step 6: Generate filename
        const extension = getFileExtension(blob);
        const filename = generateUniqueFilename(userId, 'profile', extension);

        return {
            blob,
            filename,
            size: formatFileSize(blob.size),
            originalSize: blob.size,
        };
    } catch (error) {
        throw new Error('Không thể xử lý hình ảnh: ' + error.message);
    }
}

/**
 * Get image dimensions from URI
 * @param {string} uri - Image URI
 * @returns {Promise<{width: number, height: number}>}
 */
export function getImageDimensions(uri) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height,
            });
        };

        img.onerror = () => {
            reject(new Error('Không thể load hình ảnh'));
        };

        img.src = uri;
    });
}

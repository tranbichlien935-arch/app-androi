import cloudinaryConfig from '../config/cloudinary';

class CloudinaryService {
    /**
     * Upload image to Cloudinary
     * @param {string} imageUri - Local image URI from image picker
     * @param {Object} options - Upload options
     * @returns {Promise<Object>} - Upload result with URL
     */
    async uploadImage(imageUri, options = {}) {
        const {
            transformation = null,
            maxFileSize = 10 * 1024 * 1024, // 10MB default
        } = options;

        try {
            // Validate configuration
            if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
                throw new Error(
                    'Cloudinary chưa được cấu hình. Vui lòng điền thông tin vào config/cloudinary.js'
                );
            }

            // Prepare form data
            const formData = new FormData();

            // Parse the image URI and create file object
            const filename = imageUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            // Append image file
            formData.append('file', {
                uri: imageUri,
                type: type,
                name: filename,
            });

            // Append upload preset
            formData.append('upload_preset', cloudinaryConfig.uploadPreset);

            // Note: Folder will be set by the upload preset configuration
            // Don't manually set it here to avoid conflicts

            // Add timestamp for unique filename
            const timestamp = Date.now();
            const baseFilename = filename.split('.')[0];
            formData.append('public_id', `${timestamp}_${baseFilename}`);

            // Optional: Add transformation (usually not needed, preset handles it)
            if (transformation) {
                formData.append('transformation', transformation);
            }

            // Upload to Cloudinary
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

            console.log('Uploading to Cloudinary...', cloudinaryUrl);

            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Cloudinary upload error:', errorData);
                throw new Error(
                    errorData.error?.message || 'Upload to Cloudinary failed'
                );
            }

            const data = await response.json();

            console.log('Cloudinary upload successful:', data.secure_url);

            return {
                success: true,
                url: data.secure_url,
                publicId: data.public_id,
                format: data.format,
                width: data.width,
                height: data.height,
                bytes: data.bytes,
                createdAt: data.created_at,
            };
        } catch (error) {
            console.error('Cloudinary upload error:', error);

            // Handle specific errors
            if (error.message.includes('chưa được cấu hình')) {
                throw error;
            } else if (error.message.includes('Network request failed')) {
                throw new Error('Không thể kết nối đến Cloudinary. Vui lòng kiểm tra kết nối internet');
            } else {
                throw new Error('Lỗi khi upload ảnh: ' + error.message);
            }
        }
    }

    /**
     * Upload profile picture with preset optimizations
     * @param {string} imageUri - Local image URI
     * @returns {Promise<Object>} - Upload result
     */
    async uploadProfilePicture(imageUri) {
        return this.uploadImage(imageUri, {
            // All settings (folder, transformations, etc.) are handled by the upload preset
        });
    }

    /**
     * Delete image from Cloudinary
     * Note: This requires backend API with authentication
     * For now, we'll just remove the reference from Firebase
     * @param {string} publicId - Cloudinary public ID
     */
    async deleteImage(publicId) {
        console.warn('Delete from Cloudinary requires backend API. Only removing Firebase reference.');
        return { success: false, message: 'Deletion requires backend implementation' };
    }

    /**
     * Get optimized URL with transformations
     * @param {string} url - Original Cloudinary URL
     * @param {Object} transformations - Transformation options
     * @returns {string} - Transformed URL
     */
    getTransformedUrl(url, transformations = {}) {
        const {
            width = null,
            height = null,
            crop = 'fill',
            quality = 'auto',
            format = 'auto',
        } = transformations;

        if (!url || !url.includes('cloudinary.com')) {
            return url;
        }

        // Build transformation string
        const transforms = [];
        if (width) transforms.push(`w_${width}`);
        if (height) transforms.push(`h_${height}`);
        transforms.push(`c_${crop}`);
        transforms.push(`q_${quality}`);
        transforms.push(`f_${format}`);

        const transformString = transforms.join(',');

        // Insert transformation into URL
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
        return url.replace('/upload/', `/upload/${transformString}/`);
    }
}

// Export singleton instance
const cloudinaryService = new CloudinaryService();
export default cloudinaryService;

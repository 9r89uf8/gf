import { NextResponse } from 'next/server';

class CloudflareService {
  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN;
    this.baseUrl = 'https://api.cloudflare.com/client/v4';
  }

  async getDirectUploadUrl(metadata = {}, mediaType = 'image') {
    if (mediaType === 'video') {
      return this.getStreamUploadUrl(metadata);
    }
    return this.getImageUploadUrl(metadata);
  }

  async getImageUploadUrl(metadata = {}) {
    try {
      if (!this.accountId || !this.apiToken) {
        throw new Error('Cloudflare credentials not configured');
      }

      const formData = new FormData();
      formData.append('requireSignedURLs', 'false');
      
      if (Object.keys(metadata).length > 0) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      const response = await fetch(
        `${this.baseUrl}/accounts/${this.accountId}/images/v2/direct_upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cloudflare API error: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.result) {
        throw new Error('Invalid response from Cloudflare');
      }

      return {
        uploadURL: data.result.uploadURL,
        id: data.result.id
      };
    } catch (error) {
      console.error('Error getting Cloudflare upload URL:', error);
      throw error;
    }
  }

  async getStreamUploadUrl(metadata = {}) {
    try {
      if (!this.accountId || !this.apiToken) {
        throw new Error('Cloudflare credentials not configured');
      }

      // Ensure all metadata values are strings (Cloudflare Stream requirement)
      const stringifiedMetadata = {};
      for (const [key, value] of Object.entries(metadata)) {
        stringifiedMetadata[key] = String(value);
      }

      const response = await fetch(
        `${this.baseUrl}/accounts/${this.accountId}/stream/direct_upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            maxDurationSeconds: 3600,
            meta: stringifiedMetadata
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cloudflare Stream API error: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.result) {
        throw new Error('Invalid response from Cloudflare Stream');
      }

      return {
        uploadURL: data.result.uploadURL,
        id: data.result.uid,
        isVideo: true
      };
    } catch (error) {
      console.error('Error getting Cloudflare Stream upload URL:', error);
      throw error;
    }
  }

  async deleteMedia(mediaId, isVideo = false) {
    if (isVideo) {
      return this.deleteVideo(mediaId);
    }
    return this.deleteImage(mediaId);
  }

  async deleteImage(imageId) {
    try {
      if (!this.accountId || !this.apiToken) {
        throw new Error('Cloudflare credentials not configured');
      }

      const response = await fetch(
        `${this.baseUrl}/accounts/${this.accountId}/images/v1/${imageId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cloudflare API error: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting Cloudflare image:', error);
      throw error;
    }
  }

  async deleteVideo(videoId) {
    try {
      if (!this.accountId || !this.apiToken) {
        throw new Error('Cloudflare credentials not configured');
      }

      const response = await fetch(
        `${this.baseUrl}/accounts/${this.accountId}/stream/${videoId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cloudflare Stream API error: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error deleting Cloudflare video:', error);
      throw error;
    }
  }

  async getImageDetails(imageId) {
    try {
      if (!this.accountId || !this.apiToken) {
        throw new Error('Cloudflare credentials not configured');
      }

      const response = await fetch(
        `${this.baseUrl}/accounts/${this.accountId}/images/v1/${imageId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cloudflare API error: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error getting Cloudflare image details:', error);
      throw error;
    }
  }
}

export default new CloudflareService();
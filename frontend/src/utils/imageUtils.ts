import { getImageUrl as getApiImageUrl } from './api';

/**
 * Utility functions for handling image URLs consistently across the application
 */

/**
 * Get the proper image URL for display
 * @param imagePath - The image path from the database
 * @param fallbackText - Text to show in placeholder if no image
 * @returns Properly formatted image URL
 */
export const getImageUrl = (imagePath: string, fallbackText: string = 'No Image'): string => {
  // Handle null/undefined/empty cases
  if (!imagePath || imagePath.trim() === '') {
    return `https://via.placeholder.com/600x300/1a2332/00fff7?text=${encodeURIComponent(fallbackText)}`;
  }
  
  // Handle external URLs (http/https)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Use the centralized API configuration
  return getApiImageUrl(imagePath);
};

/**
 * Get a placeholder image URL
 * @param text - Text to display in the placeholder
 * @param width - Image width (default: 600)
 * @param height - Image height (default: 300)
 * @returns Placeholder image URL
 */
export const getPlaceholderUrl = (text: string, width: number = 600, height: number = 300): string => {
  return `https://via.placeholder.com/${width}x${height}/1a2332/00fff7?text=${encodeURIComponent(text)}`;
};

/**
 * Check if an image URL is valid
 * @param url - The URL to check
 * @returns True if the URL is valid
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  if (url.includes('uploads/')) return true;
  return false;
};

/**
 * Debug image URL processing
 * @param imagePath - The original image path
 * @param context - Context for debugging
 */
export const debugImageUrl = (imagePath: string, context: string = 'Unknown'): void => {
  console.log(`[Image Debug - ${context}]`, {
    original: imagePath,
    processed: getImageUrl(imagePath),
    type: typeof imagePath,
    length: imagePath?.length,
    startsWithUploads: imagePath?.startsWith('/uploads/'),
    startsWithHttp: imagePath?.startsWith('http'),
    includesProjects: imagePath?.includes('projects/')
  });
};

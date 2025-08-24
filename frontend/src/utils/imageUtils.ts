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
  if (!imagePath) {
    return `https://via.placeholder.com/600x300/1a2332/00fff7?text=${encodeURIComponent(fallbackText)}`;
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:5000${imagePath}`;
  }
  
  return imagePath;
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
  if (url.startsWith('http')) return true;
  if (url.startsWith('/uploads/')) return true;
  return false;
};

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug with ID fallback
 */
export function generateEventSlug(title: string, id: string): string {
    const baseSlug = generateSlug(title);
    // If slug is empty or too short, use ID as fallback
    if (!baseSlug || baseSlug.length < 3) {
        return id;
    }
    // Append ID to ensure uniqueness
    return `${baseSlug}-${id}`;
}

/**
 * Extract ID from slug (if slug format is title-id)
 */
export function extractIdFromSlug(slug: string): string {
    const parts = slug.split('-');
    // Last part should be the ID
    return parts[parts.length - 1] || slug;
}



/**
 * Generate SHA-256 hash from file content
 */
export async function generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `Qm${hashHex.substring(0, 40)}`; // IPFS-style hash format
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: Record<string, string | number | boolean | null>[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',')
                    ? `"${value}"`
                    : value;
            }).join(',')
        ),
    ];

    return csvRows.join('\n');
}

/**
 * Download data as file
 */
export function downloadFile(content: string, filename: string, type: string = 'text/csv') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Truncate hash for display
 */
export function truncateHash(hash: string, startChars: number = 8, endChars: number = 6): string {
    if (hash.length <= startChars + endChars) return hash;
    return `${hash.substring(0, startChars)}...${hash.substring(hash.length - endChars)}`;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
        case 'granted':
            return 'text-green-500';
        case 'denied':
            return 'text-red-500';
        case 'pending':
            return 'text-yellow-500';
        default:
            return 'text-gray-500';
    }
}

/**
 * Utility function to combine class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

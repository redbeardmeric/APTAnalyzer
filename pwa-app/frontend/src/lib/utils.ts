import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a percentage match for display
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * Get match tier label based on percentage
 */
export function getMatchTier(percentage: number): string {
  if (percentage >= 90) return '90%+';
  if (percentage >= 80) return '80-89%';
  if (percentage >= 70) return '70-79%';
  if (percentage >= 60) return '60-69%';
  return '50-59%';
}

/**
 * Get color class based on percentage
 */
export function getPercentageColor(percentage: number): string {
  if (percentage >= 90) return 'text-danger';
  if (percentage >= 80) return 'text-warning';
  if (percentage >= 70) return 'text-warning/80';
  if (percentage >= 60) return 'text-primary';
  return 'text-primary/60';
}

/**
 * Format date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

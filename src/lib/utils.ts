import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), 'yyyy-MM-dd HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function calculateAccuracy(correct: number, total: number): string {
  if (!total || total === 0) return '0%';
  return `${Math.round((correct / total) * 100)}%`;
}

export function getRoleLabel(role: string): string {
  if (!role) return 'User';
  
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'creator':
      return 'Question Creator';
    case 'solver':
      return 'Question Solver';
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

export function getYesNoLabel(value: string): string {
  return value === 'Y' ? 'Yes' : 'No';
}
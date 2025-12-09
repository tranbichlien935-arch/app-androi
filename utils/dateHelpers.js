import { differenceInDays, format, isToday, isYesterday, parseISO, startOfDay } from 'date-fns';

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getToday = () => {
    return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Format date for display
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1, date2) => {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return format(d1, 'yyyy-MM-dd') === format(d2, 'yyyy-MM-dd');
};

/**
 * Check if date is today
 */
export const isTodayDate = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isToday(dateObj);
};

/**
 * Check if date is yesterday
 */
export const isYesterdayDate = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isYesterday(dateObj);
};

/**
 * Get days between two dates
 */
export const getDaysBetween = (date1, date2) => {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return differenceInDays(startOfDay(d2), startOfDay(d1));
};

/**
 * Get current week dates (Sun-Sat)
 */
export const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dates = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - dayOfWeek + i);
        dates.push(format(date, 'yyyy-MM-dd'));
    }

    return dates;
};

/**
 * Get days in month
 */
export const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
};

/**
 * Get day of week (0-6, Sun-Sat)
 */
export const getDayOfWeek = (date) => {
    if (!date) return new Date().getDay();
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.getDay();
};

/**
 * Format time for display (HH:mm to h:mm AM/PM)
 */
export const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

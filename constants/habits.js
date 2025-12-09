export const FREQUENCY_OPTIONS = ['daily', 'weekly'];

export const DAYS_OF_WEEK = [
    { label: 'Sun', value: 0 },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
];

export const STREAK_MILESTONES = [7, 30, 60, 100, 365];

export const POINTS_PER_COMPLETION = 10;
export const STREAK_BONUS_MULTIPLIER = 1.5; // 1.5x points after 7 day streak

export const ACHIEVEMENT_DEFINITIONS = [
    {
        id: 'first_habit',
        title: 'Getting Started',
        description: 'Create your first habit',
        icon: '🌱',
        requirement: 1,
        type: 'total',
    },
    {
        id: 'week_warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        requirement: 7,
        type: 'streak',
    },
    {
        id: 'month_master',
        title: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: '⭐',
        requirement: 30,
        type: 'streak',
    },
    {
        id: 'perfect_week',
        title: 'Perfect Week',
        description: 'Complete all habits for 7 days straight',
        icon: '💎',
        requirement: 7,
        type: 'perfect_week',
    },
    {
        id: 'century_club',
        title: 'Century Club',
        description: 'Maintain a 100-day streak',
        icon: '🏆',
        requirement: 100,
        type: 'streak',
    },
    {
        id: 'year_legend',
        title: 'Year Legend',
        description: 'Maintain a 365-day streak',
        icon: '👑',
        requirement: 365,
        type: 'streak',
    },
];

export const LEVEL_THRESHOLDS = [
    { level: 1, points: 0, title: 'Beginner' },
    { level: 2, points: 100, title: 'Novice' },
    { level: 3, points: 300, title: 'Apprentice' },
    { level: 4, points: 600, title: 'Adept' },
    { level: 5, points: 1000, title: 'Expert' },
    { level: 6, points: 1500, title: 'Master' },
    { level: 7, points: 2500, title: 'Grandmaster' },
    { level: 8, points: 4000, title: 'Legend' },
];

// Admin Configuration
// Only these email addresses can access admin features like:
// - Admin Dashboard (manage services, prices)
// - Business Settings

export const ADMIN_EMAILS = [
    'akshatapattanashetti968@gmail.com'
];

export const isAdmin = (email: string | undefined): boolean => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export const publicRoutes = [
  BASE_URL,
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */

export const authRoutes = [
  `${BASE_URL}/auth/login`,
  `${BASE_URL}/auth/register`,
  `${BASE_URL}/auth/error`,
  `${BASE_URL}/auth/reset`,
  `${BASE_URL}/auth/new-password`
];

export const adminRoutes = [
  `${BASE_URL}/admin`,
  `${BASE_URL}/admin/bank-accounts`,
  `${BASE_URL}/admin/flights`,
  `${BASE_URL}/admin/flight-status`,
  `${BASE_URL}/admin/booked-flights`,
  `${BASE_URL}/admin/payment-methods`,
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = `${BASE_URL}/api/auth`;

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = `${BASE_URL}/admin/flights`;   

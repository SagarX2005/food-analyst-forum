export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  ANALYTICS: "/analytics",
  FORUM: "/forum",
  FOOD_ANALYSIS: "/food-analysis",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.ANALYTICS,
  ROUTES.FORUM,
  ROUTES.FOOD_ANALYSIS,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
] as const;

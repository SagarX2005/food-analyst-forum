export const APP_CONFIG = {
  name: "Food Analyst Forum",
  description:
    "Enterprise SaaS platform for food industry analysis, regulatory insights, and product forum.",
  version: "0.1.0",
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

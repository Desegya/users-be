// src/utils/permissions.ts
export const ALL_PERMISSIONS = [
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'role:create',
    'role:read',
    'role:update',
    'role:delete',
  ] as const;
  
  export type Permission = typeof ALL_PERMISSIONS[number];
  
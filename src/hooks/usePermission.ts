import { useMemo } from 'react';
import { LoginUser, PermissionAction, DEFAULT_PERMISSIONS } from '../types/permissions';

type Section = 
  | 'members' 
  | 'contacts' 
  | 'invitations' 
  | 'fund' 
  | 'notice' 
  | 'live' 
  | 'accounts' 
  | 'jsonEditor';

export const usePermission = (user: LoginUser | null, section: Section) => {
  // Create a stable string for comparison
  const permissionsKey = user ? JSON.stringify(user.permissions) : '';
  const editorPermissionsKey = user ? JSON.stringify((user as any).editorPermissions || {}) : '';
  
  return useMemo(() => {
    if (!user) {
      return {
        canView: false,
        canEdit: false,
        canDelete: false,
        hasPermission: () => false
      };
    }

    const permissions = user.permissions || DEFAULT_PERMISSIONS[user.role];
    const sectionPerms = permissions[section];

    return {
      canView: sectionPerms?.view ?? false,
      canEdit: sectionPerms?.edit ?? false,
      canDelete: sectionPerms?.delete ?? false,
      hasPermission: (act: PermissionAction) => sectionPerms?.[act] ?? false
    };
  }, [user?.id, user?.role, permissionsKey, editorPermissionsKey, section]);
};

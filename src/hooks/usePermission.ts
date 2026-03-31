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
  return useMemo(() => {
    if (!user) {
      return {
        canView: false,
        canEdit: false,
        canDelete: false,
        hasPermission: (action: PermissionAction) => false
      };
    }

    // Get user permissions (custom or default)
    const permissions = user.permissions || DEFAULT_PERMISSIONS[user.role];
    const sectionPerms = permissions[section];

    return {
      canView: sectionPerms.view,
      canEdit: sectionPerms.edit,
      canDelete: sectionPerms.delete,
      hasPermission: (action: PermissionAction) => sectionPerms[action]
    };
  }, [user, section]);
};

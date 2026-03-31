// Permission Types
export type PermissionAction = 'view' | 'edit' | 'delete';

export type SectionPermissions = {
  view: boolean;
  edit: boolean;
  delete: boolean;
};

export type UserPermissions = {
  members: SectionPermissions;
  contacts: SectionPermissions;
  invitations: SectionPermissions;
  fund: SectionPermissions;
  notice: SectionPermissions;
  live: SectionPermissions;
  accounts: SectionPermissions;
  jsonEditor: SectionPermissions;
};

export type UserRole = 'Member' | 'Admin' | 'Super Admin';

export interface LoginUser {
  id: string;
  name: string;
  mobile: string;
  email: string;
  password: string;
  role: UserRole;
  photo?: string;
  permissions?: UserPermissions;
}

// Default permissions for each role
export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  'Member': {
    members: { view: true, edit: false, delete: false },
    contacts: { view: true, edit: false, delete: false },
    invitations: { view: true, edit: false, delete: false },
    fund: { view: true, edit: false, delete: false },
    notice: { view: true, edit: false, delete: false },
    live: { view: true, edit: false, delete: false },
    accounts: { view: false, edit: false, delete: false },
    jsonEditor: { view: false, edit: false, delete: false }
  },
  'Admin': {
    members: { view: true, edit: false, delete: false },
    contacts: { view: true, edit: false, delete: false },
    invitations: { view: true, edit: false, delete: false },
    fund: { view: true, edit: false, delete: false },
    notice: { view: true, edit: false, delete: false },
    live: { view: true, edit: false, delete: false },
    accounts: { view: true, edit: false, delete: false },
    jsonEditor: { view: false, edit: false, delete: false }
  },
  'Super Admin': {
    members: { view: true, edit: true, delete: true },
    contacts: { view: true, edit: true, delete: true },
    invitations: { view: true, edit: true, delete: true },
    fund: { view: true, edit: true, delete: true },
    notice: { view: true, edit: true, delete: true },
    live: { view: true, edit: true, delete: true },
    accounts: { view: true, edit: true, delete: true },
    jsonEditor: { view: true, edit: true, delete: true }
  }
};

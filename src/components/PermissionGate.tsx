import React from 'react';
import { LoginUser, PermissionAction } from '../types/permissions';
import { usePermission } from '../hooks/usePermission';
import { Shield, Lock } from 'lucide-react';

type Section = 
  | 'members' 
  | 'contacts' 
  | 'invitations' 
  | 'fund' 
  | 'notice' 
  | 'live' 
  | 'accounts' 
  | 'jsonEditor';

interface PermissionGateProps {
  user: LoginUser | null;
  section: Section;
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ 
  user, 
  section, 
  action, 
  children, 
  fallback 
}) => {
  const { hasPermission } = usePermission(user, section);

  if (!hasPermission(action)) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="flex items-center justify-center py-8 px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            অ্যাক্সেস সীমাবদ্ধ
          </h3>
          <p className="text-gray-600 text-sm">
            আপনার এই সেকশনে <strong className="text-red-600">{
              action === 'view' ? 'দেখার' : 
              action === 'edit' ? 'এডিট করার' : 
              'মুছার'
            }</strong> অনুমতি নেই।
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Admin এর সাথে যোগাযোগ করুন</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PermissionGate;

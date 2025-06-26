
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { adminService } from '@/services/adminService';
import { useEmailAuthorization } from './useEmailAuthorization';
import { useAdminUsers } from './useAdminUsers';
import { usePermissionsManagement } from './usePermissionsManagement';
import { useAdminActions } from './useAdminActions';

export const useAdminManagement = () => {
  const { user } = useAuth();
  const [isMainAdmin, setIsMainAdmin] = useState(false);

  // Usar los hooks especializados
  const emailAuth = useEmailAuthorization();
  const adminUsers = useAdminUsers();
  const permissions = usePermissionsManagement();
  const actions = useAdminActions();

  // Verificar si el usuario actual es el admin principal
  useEffect(() => {
    const checkMainAdmin = async () => {
      if (!user) return;
      const isMain = await adminService.checkMainAdmin(user.id);
      setIsMainAdmin(isMain);
    };

    checkMainAdmin();
  }, [user]);

  return {
    // Estado general
    isMainAdmin,
    loading: emailAuth.loading || adminUsers.loading || permissions.loading || actions.loading,

    // Gestión de emails autorizados
    authorizedEmails: emailAuth.authorizedEmails,
    loadAuthorizedEmails: emailAuth.loadAuthorizedEmails,
    authorizeEmail: emailAuth.authorizeEmail,
    revokeEmailAuthorization: emailAuth.revokeEmailAuthorization,
    checkEmailAuthorization: emailAuth.checkEmailAuthorization,

    // Gestión de usuarios administradores
    adminUsers: adminUsers.adminUsers,
    loadAdminUsers: adminUsers.loadAdminUsers,

    // Gestión de permisos
    assignPermissions: permissions.assignPermissions,

    // Historial de acciones
    adminActions: actions.adminActions,
    loadAdminActions: actions.loadAdminActions
  };
};

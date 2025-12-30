import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Plus, AlertCircle, RotateCcw, Edit, X, Crown, User } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';
import { EditNotesModal } from './EditNotesModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmailWithRole {
  id: string;
  email: string;
  is_active: boolean;
  authorized_at: string;
  notes: string | null;
  role?: string;
}

const EmailAuthorizationManager = () => {
  const [newEmail, setNewEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<{ id: string; email: string; notes: string | null } | null>(null);
  const [emailsWithRoles, setEmailsWithRoles] = useState<EmailWithRole[]>([]);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    authorizedEmails, 
    loading, 
    authorizeEmail, 
    revokeEmailAuthorization,
    reactivateEmailAuthorization,
    deleteEmailPermanently,
    updateEmailNotes,
    loadAuthorizedEmails
  } = useAdminManagement();

  // Load roles for each email
  useEffect(() => {
    const loadRoles = async () => {
      const emailsWithRolesData = await Promise.all(
        authorizedEmails.map(async (email) => {
          const { data: role } = await supabase.rpc('get_user_role_by_email', {
            target_email: email.email
          });
          return {
            ...email,
            role: role || 'user'
          };
        })
      );
      setEmailsWithRoles(emailsWithRolesData);
    };

    if (authorizedEmails.length > 0) {
      loadRoles();
    } else {
      setEmailsWithRoles([]);
    }
  }, [authorizedEmails]);

  // Load data on mount
  useEffect(() => {
    loadAuthorizedEmails();
  }, []);

  const handleAuthorizeEmail = async () => {
    if (!newEmail.trim()) return;
    
    await authorizeEmail(newEmail.trim().toLowerCase(), notes.trim() || undefined);
    setNewEmail('');
    setNotes('');
  };

  const handleRevokeAuthorization = async (emailId: string) => {
    await revokeEmailAuthorization(emailId);
  };

  const handleReactivateAuthorization = async (emailId: string) => {
    await reactivateEmailAuthorization(emailId);
  };

  const handleDeletePermanently = async (emailId: string) => {
    await deleteEmailPermanently(emailId);
  };

  const handleEditNotes = (email: { id: string; email: string; notes: string | null }) => {
    setSelectedEmail(email);
    setEditModalOpen(true);
  };

  const handleSaveNotes = async (newNotes: string) => {
    if (selectedEmail) {
      await updateEmailNotes(selectedEmail.id, newNotes);
    }
  };

  const handleRoleChange = async (email: string, newRole: string) => {
    setChangingRole(email);
    try {
      const { error } = await supabase.rpc('set_user_role', {
        target_email: email,
        new_role: newRole
      });

      if (error) throw error;

      toast({
        title: 'Rol actualizado',
        description: `El rol de ${email} ha sido cambiado a ${newRole === 'admin' ? 'Super Admin' : 'Usuario'}`,
      });

      // Reload roles
      await loadAuthorizedEmails();
    } catch (error: any) {
      console.error('Error changing role:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo cambiar el rol',
        variant: 'destructive'
      });
    } finally {
      setChangingRole(null);
    }
  };

  const getRoleBadge = (role: string | undefined) => {
    if (role === 'admin') {
      return (
        <Badge className="bg-primary/20 text-primary border-primary/30">
          <Crown className="h-3 w-3 mr-1" />
          Super Admin
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-muted text-muted-foreground">
        <User className="h-3 w-3 mr-1" />
        Usuario
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-blue-500" />
            <div>
              <CardTitle>Autorización de Emails</CardTitle>
              <CardDescription>
                Gestiona qué emails pueden registrarse y asigna roles en el sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email a Autorizar</Label>
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Razón de la autorización..."
                disabled={loading}
              />
            </div>
          </div>

          <Button 
            onClick={handleAuthorizeEmail} 
            disabled={loading || !newEmail.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Autorizar Email
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emails Autorizados y Roles</CardTitle>
          <CardDescription>
            Lista de emails autorizados. Cambia el rol para otorgar acceso completo (Super Admin) o solo lectura (Usuario).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailsWithRoles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No hay emails autorizados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailsWithRoles.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell className="font-medium">{email.email}</TableCell>
                    <TableCell>
                      <Badge variant={email.is_active ? "default" : "secondary"}>
                        {email.is_active ? 'Activo' : 'Revocado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(email.authorized_at).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {email.notes || '-'}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={email.role || 'user'}
                        onValueChange={(value) => handleRoleChange(email.email, value)}
                        disabled={changingRole === email.email || !email.is_active}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            {getRoleBadge(email.role)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Crown className="h-4 w-4 text-primary" />
                              Super Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              Usuario
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditNotes(email)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {email.is_active ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Revocar autorización?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esto impedirá que {email.email} pueda registrarse o mantener acceso al sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRevokeAuthorization(email.id)}
                                  className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                  Revocar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <div className="flex gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-green-600">
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Reactivar autorización?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esto permitirá que {email.email} pueda registrarse y acceder al sistema nuevamente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleReactivateAuthorization(email.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Reactivar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600">
                                  <X className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar permanentemente?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción NO se puede deshacer. {email.email} será eliminado completamente del sistema.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePermanently(email.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar Permanentemente
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Información de Roles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-primary" />
            <strong>Super Admin:</strong> Acceso completo para editar todas las secciones del panel.
          </p>
          <p className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <strong>Usuario:</strong> Solo puede ver el contenido del panel (modo lectura). Puede editar su propio perfil.
          </p>
        </CardContent>
      </Card>

      <EditNotesModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveNotes}
        currentNotes={selectedEmail?.notes || null}
        email={selectedEmail?.email || ''}
        loading={loading}
      />
    </div>
  );
};

export default EmailAuthorizationManager;

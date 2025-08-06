
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Plus, AlertCircle, RotateCcw, Edit, X } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';
import { EditNotesModal } from './EditNotesModal';
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

const EmailAuthorizationManager = () => {
  const [newEmail, setNewEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<{ id: string; email: string; notes: string | null } | null>(null);
  
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

  // Cargar datos automáticamente al montar el componente
  useEffect(() => {
    loadAuthorizedEmails();
  }, []);

  const handleAuthorizeEmail = async () => {
    if (!newEmail.trim()) return;
    
    console.log('Authorizing email:', newEmail.trim());
    await authorizeEmail(newEmail.trim().toLowerCase(), notes.trim() || undefined);
    setNewEmail('');
    setNotes('');
  };

  const handleRevokeAuthorization = async (emailId: string) => {
    console.log('Revoking authorization for email ID:', emailId);
    await revokeEmailAuthorization(emailId);
  };

  const handleReactivateAuthorization = async (emailId: string) => {
    console.log('Reactivating authorization for email ID:', emailId);
    await reactivateEmailAuthorization(emailId);
  };

  const handleDeletePermanently = async (emailId: string) => {
    console.log('Deleting email permanently:', emailId);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-blue-500" />
            <div>
              <CardTitle>Autorización de Emails</CardTitle>
              <CardDescription>
                Gestiona qué emails pueden registrarse en el sistema
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
          <CardTitle>Emails Autorizados</CardTitle>
          <CardDescription>
            Lista de emails que pueden registrarse en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authorizedEmails.length === 0 ? (
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
                  <TableHead>Fecha de Autorización</TableHead>
                  <TableHead>Notas</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authorizedEmails.map((email) => (
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
                    <TableCell>{email.notes || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {/* Botón Editar Notas */}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditNotes(email)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {email.is_active ? (
                          /* Email Activo - Opciones de Revocar */
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
                                  El email se mantendrá en el sistema pero será desactivado.
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
                          /* Email Revocado - Opciones de Reactivar y Eliminar */
                          <div className="flex gap-2">
                            {/* Reactivar */}
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

                            {/* Eliminar Permanentemente */}
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

      {/* Modal para Editar Notas */}
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

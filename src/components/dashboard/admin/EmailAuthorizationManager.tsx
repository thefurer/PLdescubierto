
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Plus, AlertCircle } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';
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
  const { 
    authorizedEmails, 
    loading, 
    authorizeEmail, 
    revokeEmailAuthorization 
  } = useAdminManagement();

  const handleAuthorizeEmail = async () => {
    if (!newEmail.trim()) return;
    
    await authorizeEmail(newEmail.trim(), notes.trim() || undefined);
    setNewEmail('');
    setNotes('');
  };

  const handleRevokeAuthorization = async (emailId: string) => {
    await revokeEmailAuthorization(emailId);
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
                      {email.is_active && (
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
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Revocar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailAuthorizationManager;

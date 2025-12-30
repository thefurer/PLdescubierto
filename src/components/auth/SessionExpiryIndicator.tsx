import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Clock, RefreshCw, LogOut } from 'lucide-react';

const SESSION_WARNING_MINUTES = 5; // Mostrar aviso 5 minutos antes de expirar

export const SessionExpiryIndicator = () => {
  const { session, signOut } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateTimeRemaining = useCallback(() => {
    if (!session?.expires_at) return null;
    
    const expiresAt = session.expires_at * 1000; // Convert to milliseconds
    const now = Date.now();
    const remaining = expiresAt - now;
    
    return Math.max(0, Math.floor(remaining / 1000)); // Return seconds
  }, [session?.expires_at]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        toast({
          title: 'Error',
          description: 'No se pudo extender la sesión. Por favor, inicia sesión nuevamente.',
          variant: 'destructive',
        });
        return;
      }
      
      if (data.session) {
        setShowWarning(false);
        toast({
          title: 'Sesión extendida',
          description: 'Tu sesión ha sido extendida exitosamente.',
        });
      }
    } catch (error) {
      console.error('Unexpected error refreshing session:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    setShowWarning(false);
    await signOut();
  };

  useEffect(() => {
    if (!session?.expires_at) {
      setShowWarning(false);
      setTimeRemaining(null);
      return;
    }

    const checkExpiry = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining !== null && remaining <= SESSION_WARNING_MINUTES * 60 && remaining > 0) {
        setShowWarning(true);
      } else if (remaining === 0) {
        setShowWarning(false);
        toast({
          title: 'Sesión expirada',
          description: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          variant: 'destructive',
        });
      }
    };

    // Check immediately
    checkExpiry();

    // Check every 10 seconds
    const interval = setInterval(checkExpiry, 10000);

    return () => clearInterval(interval);
  }, [session?.expires_at, calculateTimeRemaining]);

  // Reset warning when session is refreshed
  useEffect(() => {
    const remaining = calculateTimeRemaining();
    if (remaining !== null && remaining > SESSION_WARNING_MINUTES * 60) {
      setShowWarning(false);
    }
  }, [session, calculateTimeRemaining]);

  if (!showWarning || timeRemaining === null || timeRemaining <= 0) {
    return null;
  }

  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <Clock className="h-5 w-5" />
            Sesión por expirar
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tu sesión expirará en <span className="font-bold text-foreground">{formatTime(timeRemaining)}</span> minutos.
            </p>
            <p className="text-sm text-muted-foreground">
              ¿Deseas extender tu sesión o cerrarla?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleExtendSession}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Extendiendo...' : 'Extender sesión'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

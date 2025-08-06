import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface EditNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => Promise<void>;
  currentNotes: string | null;
  email: string;
  loading: boolean;
}

export const EditNotesModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentNotes, 
  email, 
  loading 
}: EditNotesModalProps) => {
  const [notes, setNotes] = useState(currentNotes || '');

  const handleSave = async () => {
    await onSave(notes);
    onClose();
  };

  const handleClose = () => {
    setNotes(currentNotes || '');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Notas</DialogTitle>
          <DialogDescription>
            Actualizar las notas para {email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Notas</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas sobre la autorización..."
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

interface FormActionsProps {
  isSaving: boolean;
  isUploading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const FormActions = ({ isSaving, isUploading, onSave, onCancel }: FormActionsProps) => {
  return (
    <div className="flex gap-2 pt-4 border-t">
      <Button 
        onClick={onSave} 
        disabled={isSaving || isUploading}
        size="sm"
        className="flex-1"
      >
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isSaving || isUploading}
        size="sm"
        className="flex-1"
      >
        <X className="h-4 w-4 mr-2" />
        Cancelar
      </Button>
    </div>
  );
};

export default FormActions;

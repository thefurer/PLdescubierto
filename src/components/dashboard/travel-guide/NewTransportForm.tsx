
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TransportOption {
  id: string;
  name: string;
  description: string;
  totalTime: string;
  price: string;
  pros: string[];
  icon: string;
  details: string;
}

interface NewTransportFormProps {
  onAdd: (transport: Partial<TransportOption>) => void;
  loading: boolean;
}

const NewTransportForm = ({ onAdd, loading }: NewTransportFormProps) => {
  const [newTransport, setNewTransport] = useState<Partial<TransportOption>>({});

  const handleAdd = () => {
    if (!newTransport.name || !newTransport.description) return;
    onAdd(newTransport);
    setNewTransport({});
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={newTransport.name || ''}
            onChange={(e) => setNewTransport({ ...newTransport, name: e.target.value })}
            placeholder="Nombre del transporte"
          />
          <Input
            value={newTransport.icon || ''}
            onChange={(e) => setNewTransport({ ...newTransport, icon: e.target.value })}
            placeholder="Icono (plane, bus, car)"
          />
        </div>
        
        <Textarea
          value={newTransport.description || ''}
          onChange={(e) => setNewTransport({ ...newTransport, description: e.target.value })}
          placeholder="Descripción del transporte"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            value={newTransport.totalTime || ''}
            onChange={(e) => setNewTransport({ ...newTransport, totalTime: e.target.value })}
            placeholder="Tiempo total"
          />
          <Input
            value={newTransport.price || ''}
            onChange={(e) => setNewTransport({ ...newTransport, price: e.target.value })}
            placeholder="Precio"
          />
        </div>
        
        <Button onClick={handleAdd} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Transporte
        </Button>
      </div>
    </div>
  );
};

export default NewTransportForm;

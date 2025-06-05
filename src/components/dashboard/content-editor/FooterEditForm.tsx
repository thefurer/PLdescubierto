
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FooterEditFormProps {
  formData: any;
  updateFormField: (field: string, value: string) => void;
}

const FooterEditForm = ({ formData, updateFormField }: FooterEditFormProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-semibold text-gray-700">
            Nombre de la Empresa
          </Label>
          <Input
            id="companyName"
            value={formData.companyName || ''}
            onChange={(e) => updateFormField('companyName', e.target.value)}
            className="bg-white border-gray-200 focus:border-green-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
            Correo Electrónico
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormField('email', e.target.value)}
            className="bg-white border-gray-200 focus:border-green-400"
          />
        </div>
      </div>
      <div className="mb-6">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
          Descripción
        </Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => updateFormField('description', e.target.value)}
          rows={3}
          className="mt-2 bg-white border-gray-200 focus:border-green-400"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
            Teléfono
          </Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => updateFormField('phone', e.target.value)}
            className="bg-white border-gray-200 focus:border-green-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
            Dirección
          </Label>
          <Input
            id="address"
            value={formData.address || ''}
            onChange={(e) => updateFormField('address', e.target.value)}
            className="bg-white border-gray-200 focus:border-green-400"
          />
        </div>
      </div>
    </>
  );
};

export default FooterEditForm;

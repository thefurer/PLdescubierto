
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LogoSettingsProps {
  position: 'left' | 'center' | 'right';
  height: number;
  onPositionChange: (value: 'left' | 'center' | 'right') => void;
  onHeightChange: (value: number) => void;
}

const LogoSettings = ({ position, height, onPositionChange, onHeightChange }: LogoSettingsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="logo-position">Posición del Logo</Label>
        <Select value={position} onValueChange={onPositionChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Izquierda</SelectItem>
            <SelectItem value="center">Centro</SelectItem>
            <SelectItem value="right">Derecha</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="logo-height">Altura del Logo (px)</Label>
        <Input
          id="logo-height"
          type="number"
          value={height}
          onChange={(e) => onHeightChange(parseInt(e.target.value) || 40)}
          min="20"
          max="80"
        />
      </div>
    </div>
  );
};

export default LogoSettings;


import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker = ({ selectedColor, onColorChange }: ColorPickerProps) => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ];

  return (
    <div>
      <Label>Color</Label>
      <div className="flex gap-2 mt-2">
        {colors.map(color => (
          <button
            key={color}
            type="button"
            className={`w-6 h-6 rounded-full border-2 ${
              selectedColor === color ? 'border-gray-800' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;

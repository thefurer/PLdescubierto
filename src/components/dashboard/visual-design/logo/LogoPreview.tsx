
interface LogoPreviewProps {
  logoUrl?: string;
  position: 'left' | 'center' | 'right';
  height: number;
}

const LogoPreview = ({ logoUrl, position, height }: LogoPreviewProps) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h4 className="font-medium mb-2">Vista Previa</h4>
      <div className="border bg-white rounded p-4">
        <div className={`flex ${
          position === 'left' ? 'justify-start' :
          position === 'center' ? 'justify-center' : 'justify-end'
        }`}>
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo preview" 
              style={{ height: `${height}px` }}
              className="object-contain"
            />
          ) : (
            <div 
              className="bg-gray-300 rounded flex items-center justify-center text-gray-600 font-medium"
              style={{ 
                height: `${height}px`, 
                width: `${height * 2}px` 
              }}
            >
              LOGO
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoPreview;

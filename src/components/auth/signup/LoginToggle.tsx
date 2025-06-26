
interface LoginToggleProps {
  onToggleMode: () => void;
  loading: boolean;
}

export const LoginToggle = ({ onToggleMode, loading }: LoginToggleProps) => {
  return (
    <p className="text-center text-sm text-gray-600">
      ¿Ya tienes cuenta?{' '}
      <button
        type="button"
        onClick={onToggleMode}
        className="text-ocean hover:underline font-medium"
        disabled={loading}
      >
        Inicia sesión aquí
      </button>
    </p>
  );
};

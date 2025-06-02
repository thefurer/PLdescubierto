
interface AuthNavigationProps {
  isLogin: boolean;
  isResetMode: boolean;
  isPasswordReset: boolean;
  isEmailVerified: boolean;
  onToggleMode: () => void;
  onBackToLogin: () => void;
}

export const AuthNavigation = ({
  isLogin,
  isResetMode,
  isPasswordReset,
  isEmailVerified,
  onToggleMode,
  onBackToLogin
}: AuthNavigationProps) => {
  if (isResetMode || isPasswordReset || isEmailVerified) {
    return (
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-ocean hover:text-ocean-dark smooth-transition font-medium"
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 text-center">
      <button
        type="button"
        onClick={onToggleMode}
        className="text-ocean hover:text-ocean-dark smooth-transition font-medium"
      >
        {isLogin ? '¿No tienes cuenta? Crear una' : '¿Ya tienes cuenta? Iniciar sesión'}
      </button>
    </div>
  );
};

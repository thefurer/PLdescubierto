
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';
import { AuthContext } from '@/contexts/AuthContext';

const mockAuthContextValue = {
  user: null,
  loading: false,
  signOut: jest.fn(),
};

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider value={mockAuthContextValue}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </AuthContext.Provider>
);

describe('LoginForm', () => {
  const mockProps = {
    email: '',
    setEmail: jest.fn(),
    password: '',
    setPassword: jest.fn(),
    loading: false,
    captchaToken: 'test-token',
    setCaptchaToken: jest.fn(),
    captcha: null,
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form elements', () => {
    render(
      <MockAuthProvider>
        <LoginForm {...mockProps} />
      </MockAuthProvider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('calls setEmail when email input changes', () => {
    render(
      <MockAuthProvider>
        <LoginForm {...mockProps} />
      </MockAuthProvider>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(mockProps.setEmail).toHaveBeenCalledWith('test@example.com');
  });

  test('calls setPassword when password input changes', () => {
    render(
      <MockAuthProvider>
        <LoginForm {...mockProps} />
      </MockAuthProvider>
    );

    const passwordInput = screen.getByLabelText(/contraseña/i);
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    expect(mockProps.setPassword).toHaveBeenCalledWith('testpassword');
  });

  test('calls onSubmit when form is submitted', async () => {
    render(
      <MockAuthProvider>
        <LoginForm {...mockProps} />
      </MockAuthProvider>
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalled();
    });
  });

  test('disables submit button when loading', () => {
    render(
      <MockAuthProvider>
        <LoginForm {...{ ...mockProps, loading: true }} />
      </MockAuthProvider>
    );

    const submitButton = screen.getByRole('button', { name: /iniciando/i });
    expect(submitButton).toBeDisabled();
  });
});

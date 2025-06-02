
interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white drop-shadow-lg">
        {title}
      </h2>
      <p className="mt-2 text-white/90 drop-shadow-md">
        {subtitle}
      </p>
    </div>
  );
};

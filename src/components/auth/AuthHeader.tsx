interface AuthHeaderProps {
  title: string;
  subtitle: string;
}
export const AuthHeader = ({
  title,
  subtitle
}: AuthHeaderProps) => {
  return <div className="text-center">
      <h2 className="text-3xl font-bold drop-shadow-lg text-zinc-950">
        {title}
      </h2>
      <p className="mt-2 drop-shadow-md text-zinc-800">
        {subtitle}
      </p>
    </div>;
};
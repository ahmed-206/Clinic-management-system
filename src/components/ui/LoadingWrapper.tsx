import { LoadingSpinner } from "./LoadingSpinner";
interface Props {
  isLoading: boolean;
  children: React.ReactNode;
}

export const LoadingWrapper = ({ isLoading, children }: Props) => {
  if (isLoading) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};
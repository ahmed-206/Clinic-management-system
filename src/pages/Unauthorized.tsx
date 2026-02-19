import { Link } from "react-router-dom";

export const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Oops! It looks like you don't have the necessary permissions to access this area. 
        If you think this is a mistake, please contact support.
      </p>
      <Link 
        to="/" 
        className="px-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
      >
        Return to Home
      </Link>
    </div>
  );
};
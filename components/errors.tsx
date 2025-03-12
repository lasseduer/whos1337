import { AppError } from "@/app/store"

interface ErrorProps {
  errors: AppError[];
}

export const Errors: React.FC<ErrorProps> = ({ errors }) => {
  return (
    <>
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <ul className="list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

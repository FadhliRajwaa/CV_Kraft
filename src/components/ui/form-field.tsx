import type { UseFormRegisterReturn } from "react-hook-form";

type FormFieldProps = {
  id: string;
  label: string;
  type: string;
  registration: UseFormRegisterReturn;
  error?: string;
};

export function FormField({ id, label, type, registration, error }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        {...registration}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

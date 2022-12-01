import { FC, HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export type FormInputProps = {
  id: string;
  labelText: string;
  type?: HTMLInputTypeAttribute;
  errorMessage?: string;
  registerReturn?: UseFormRegisterReturn;
  defaultValue?: any;
};

export const FormInput: FC<FormInputProps> = ({
  labelText,
  id,
  type,
  errorMessage,
  registerReturn,
  defaultValue,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 text-start"
      >
        {labelText}
      </label>
      <div className="mt-1">
        <input
          {...registerReturn}
          defaultValue={defaultValue}
          id={id}
          type={type}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <p className="text-xs text-red-500 pt-[2px] h-3">{errorMessage}</p>
      </div>
    </div>
  );
};

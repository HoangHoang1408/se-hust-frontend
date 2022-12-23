import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
const SelectInput: FC<{
  id: string;
  labelText: string;
  errorMessage?: string;
  registerReturn?: UseFormRegisterReturn;
  values: string[];
  showedValues: string[];
}> = ({
  id,
  labelText,
  errorMessage,
  registerReturn,
  values,
  showedValues,
}) => {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
      <label htmlFor={id} className="text-gray-700 font-medium sm:text-sm">
        {labelText}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <select
          {...registerReturn}
          id={id}
          className="max-w-lg rounded appearance-none w-full p-2 h-full border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-semibold"
        >
          {values.map((t, i) => (
            <option key={i} value={t}>
              {showedValues[i]}
            </option>
          ))}
        </select>
        <span>{errorMessage}</span>
      </div>
    </div>
  );
};
export default SelectInput;

import { FC, Fragment } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
const SelectInput2: FC<{
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
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 text-start"
      >
        {labelText}
      </label>
      <div className="mt-1">
        <select
          {...registerReturn}
          id={id}
          className="appearance-none block w-full h-11 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
export default SelectInput2;

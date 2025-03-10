import { FieldValues, UseControllerProps } from "react-hook-form";

export interface BaseInputProps<T extends FieldValues>
  extends UseControllerProps<T> {
  label?: string;
  isError: boolean;
  errMsg?: string;
  isRequired?: boolean;
  placeHolder?: string;
  size?: "small" | "medium";
}

export interface CheckBoxProps<T extends FieldValues>
  extends BaseInputProps<T> {
  id: string;
}

export interface TextInputProps<T extends FieldValues>
  extends BaseInputProps<T> {
  type?: React.HTMLInputTypeAttribute;
  isRequired?: boolean;
}

interface Option {
  id: string | number;
  name: string;
}

export interface SelectInputProps<T extends FieldValues>
  extends BaseInputProps<T> {
  options: Option[];
  disable?: boolean;
}

export interface AutoCompleteInputProps<T extends FieldValues>
  extends SelectInputProps<T> {
  disableClearable?: boolean;
}

export interface DateInputProps<T extends FieldValues>
  extends BaseInputProps<T> {
  disabledFuture?: boolean;
  disabledPast?: boolean;
}

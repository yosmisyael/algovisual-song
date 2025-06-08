import * as React from "react";

export interface DropdownOptions<T> {
    value: T;
    label?: string;
    icon?: React.ReactNode;
}

export interface GenericDropdownProps<T> {
    options: DropdownOptions<T>[];
    value: T;
    onChange: (value: T) => void;
    labelId?: string;
}
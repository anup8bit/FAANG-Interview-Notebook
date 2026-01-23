import type { ChangeEvent, ReactNode } from "react";
import "./input.css";

interface Props {
    value?: string;
    type?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: ReactNode;
    id?: string;
    testId?: string;
}

const SearchInput = ({
    value,
    type = "text",
    onChange,
    placeholder,
    label,
    id,
}: Props) => {
    return (
        <div className="form-group">
            <div className="form-input-label">
                <label htmlFor={id} className="input-label">{label}</label>
            </div>
            <div className="form-input-wrapper">
                <input
                    type={type}
                    value={value}
                    className="form-input"
                    onChange={onChange}
                    placeholder={placeholder}
                    id={id}
                />
            </div>
        </div>
    )
}

export default SearchInput;
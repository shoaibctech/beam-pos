import React from "react";
import './styles.css';

const Input = ({ error, name, type, value, handleChange, placeholder, disabled = false, required = false, className}) => {
    return(
        <div className="input_field">
        <input
            className={error ? `${className} error ` : className}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={e => handleChange(e.target.value)}
            disabled={disabled}
            required={required}
        />
        <p className="error_text">{error && error}</p>
        </div>
    );
}

export default Input;

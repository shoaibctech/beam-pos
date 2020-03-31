import React from "react";
import './styles.css';

const Input = ({ error, name, type, value, handleChange, placeholder}) => {
    return(
        <div className="input_field">
        <input
            className={error ? 'error' : ''}
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={e => handleChange(e.target.value)}
        />
        <p className="error_text">{error && error}</p>
        </div>
    );
}

export default Input;
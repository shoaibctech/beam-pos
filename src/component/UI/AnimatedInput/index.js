import React, {useEffect} from 'react';
import './styles.css';

const AnimatedInput = ({placeHolder, value, handleChange, id}) => {

    const handleOnFocus = (e) => {
        e.target.parentElement.firstChild.classList.add('active');
    }
    const handleOnBlur = (e) => {
        if(!e.target.value) {
            e.target.parentElement.firstChild.classList.remove('active')
        }
    }
    useEffect( () => {
        if (value) {
            let elementId = 'animated-input-label-id' + id;
            let element = document.getElementById(elementId);
            element.classList.add('active');
        }
    }, []);

    return (
        <div>
            <br/>
            <div className="animated-input">
                <div>
                    <label id={`animated-input-label-id${id}`} htmlFor={`animated-input-id${id}`} className="animated-input-label">{placeHolder}</label>
                    <input
                        onFocus={handleOnFocus}
                        onBlur={handleOnBlur}
                        id={`animated-input-id${id}`}
                        type="text"
                        className="styl"
                        value={value}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <br/>
        </div>
    );
}

export default AnimatedInput;
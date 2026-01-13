import { useRef, useState } from "react";
import "./index.css";

const OTPForm = () => {
    const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
    const inputsRef = useRef([]);

    console.log("otpDigits : ", otpDigits)

    const handleChange = (e, index) => {
        console.log(e);
        console.log(e.target);

        const digit = e.target.value;
        if((!isNaN(parseInt(digit)) && digit.length <= 1) || digit === "") {
            const newOtpDigits = [...otpDigits];
            newOtpDigits[index] = e.target.value;
            setOtpDigits(newOtpDigits);

            // Move focus to next input if not last
            if(index < 5) {
                inputsRef.current[index+1].focus();
            }

            // auto submit
            if(newOtpDigits.every(val => val !== "")) {
                console.log("OTP auto submit");
            }
        }
    }

    const handlePaste = (e, index) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text");
        
        // pasted data contains character other than [0,9]
        if(!/^\d+$/.test(pasteData)) return;

        const pasteDigits = pasteData.split("").slice(0, 6);

        const newOpts = [...otpDigits];

        // if onpaste triggered at index > 0
        pasteDigits.forEach((digit,i) => {
            if (index+i < 6) {
                newOpts[index+i] = digit;
            }
        });

        setOtpDigits(newOpts);

        // Move focus on last input
        const lastIndex = Math.min(index+pasteDigits.length - 1, 5);
        inputsRef.current[lastIndex].focus();

        // Submit if filled
        if(newOpts.every((digit) => digit !== "")) {
            console.log("Submit OTP");
        }
    }

    const handleKeyDown = (e, index) => {
        console.log("e : ", e.key, e.keyCode, e.keycode);
        // remove otp digit value using backspace key
        switch(e.key) {
            case 'Backspace':
                if(index >= 0 && otpDigits[index] !== "") {
                    const newOtps = [...otpDigits];
                    newOtps[index] = "";
                    setOtpDigits(newOtps);
                }
                break;
            case 'ArrowLeft':
                if (index > 0) {
                    inputsRef.current[index-1].focus();
                }
                break;
            case 'ArrowRight':
                if (index < 5) {
                    inputsRef.current[index+1].focus();
                }
                break;
            case 'Home':
                inputsRef.current[0].focus();
                break;
            case 'End':
                inputsRef.current[5].focus();
                break;
        }
    }

    console.log("inputsRef : ", inputsRef)

    return (
        <div className="otp-form-card">
            <header>
                <h3>OTP Verification</h3>
                <p>Enter Verification code</p>
            </header>
            <form className="otp-input-wrapper">
                {otpDigits.map((otpInput, index) =>
                    <input
                        type="text"
                        key={index}
                        className="otp-input"
                        id={`otp-input-${index}`}
                        value={otpDigits[index]}
                        onChange={(e) => handleChange(e, index)}
                        onPaste={(e) => handlePaste(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(elem) => inputsRef.current[index] = elem}
                        onFocus={(e) => e.target.select()}
                    />)}
            </form>
        </div>
    )
}

export default OTPForm;
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import Button from "../../components/Button";
import Logo from "../../components/Logo";
import { Input } from "../../components/Input"
import Label from "../../components/Label";
import EnterCode from "./EnterCode";
import LogIn from "./LogIn";

import { passwordReset } from "../../utils/api";

const PasswordReset = ({ toggleSidebar }) => {
    const [email, setEmail] = useState("");
    const [emailFocused, setEmailFocused] = useState(false)
    const [validEmail, setValidEmail] = useState(true)
    const [noAccount, setNoAccount] = useState(false)
    const [disableButton, setDisableButton] = useState(false)

    const onFocus = (setFocused) => setFocused(true)
    const onBlur = (setFocused) => setFocused(false)

    const validateEmail = (email) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        setValidEmail(isValid);
    };

    const success = () => {
        toggleSidebar(<EnterCode toggleSidebar={ toggleSidebar } />)
    }

    const onFinish = async (values) => {
        try {
            const response = await axios.post( passwordReset, values)
            if (response.status === 200) {
                localStorage.setItem("email", email)
                success()
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('Incorrect email');
                setNoAccount(true)
            } else if (error.response && error.response.status === 500) {
                console.log('Internal Server Error');
            } else {
                console.log('An error occurred');
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setDisableButton(true);
        if (email) {
            const values = {
                email: email
            }
            onFinish(values)
        }
    }

    function handleEmailChange(event) {
        setNoAccount(false)
        setDisableButton(false)
        setEmail(event.target.value)
        validateEmail(event.target.value);
    }

    return (
        <div className="flex flex-col items-center justify-center text-neutral-25 py-80">
            <Logo />
            <div className="flex py-32">
                <Button
                    variant="secondary"
                    onClick={ () => toggleSidebar(<LogIn toggleSidebar={ toggleSidebar } />) }
                    className="!bg-[#FCFCFD1A] !text-neutral-300 !border-none !shadow-light-25 w-[36px] h-40 absolute left-[70px]"
                >
                    <FontAwesomeIcon icon={ fas.faArrowLeft } className="h-[20px]" />
                </Button>
                <p className="text-heading-h5 text-neutral-300">Password Reset</p>
            </div>
            <p className="text-center text-body-m text-neutral-400 w-1/2">Provide your account's email for which you want to reset your password.</p>
            <div className="w-[70%] pt-40">
                <Label
                    label="Email"
                    className="mb-24"
                    active={ emailFocused }
                    value={ email }
                    leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faEnvelope } /> }
                    variant={ (!validEmail || noAccount) ? 'error' : 'default' }
                    errorMessage={ noAccount ? "No account found" : "Enter valid email address" }
                    error={ (!validEmail || noAccount) }
                >
                    <Input
                        text="Email Address"
                        error={ (!validEmail || noAccount) }
                        onChange={ handleEmailChange }
                        onFocus={ () => onFocus(setEmailFocused) }
                        onBlur={ () => onBlur(setEmailFocused) }
                    />
                </Label>
                <Button
                    className="w-full mt-16 disabled:bg-primary-200"
                    disabled={ noAccount || !validEmail || email === "" || disableButton }
                    onClick={ handleSubmit }
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}

export default PasswordReset;

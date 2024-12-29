import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import Logo from "../../components/Logo";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import Label from "../../components/Label";
import Success from "../../components/Success";
import EnterCode from "./EnterCode";

import { passwordReset } from "../../utils/api";

const NewPassword = ({ toggleSidebar }) => {
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [passwordsNotMatch, setPasswordsNotMatch] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);

    const [passwordFocused, setPasswordFocused] = useState(false)
    const [retypePasswordFocused, setRetypePasswordFocused] = useState(false)

    const onFocus = (setFocused) => setFocused(true)
    const onBlur = (setFocused) => setFocused(false)

    const success = () => {
        toggleSidebar(<Success text="Password Reset Successful! 🎉" toggleSidebar={ toggleSidebar } />)
    }

    const onFinish = async (values) => {
        try {
            const response = await axios.post( passwordReset + "/new-password", values)
            if (response.status === 200) {
                localStorage.clear()
                success()
            }
        } catch (error) {
            console.log(error)
            console.log(error.response.data.message)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (password !== retypePassword) {
            setPasswordsNotMatch(true)
            return;
        }

        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        if (password && !passwordsNotMatch) {
            const values = {
                email: email,
                newPassword: password,
                token: token
            }
            onFinish(values)
        }
    }

    function handlePasswordChange(event) {
        if (passwordsNotMatch) setPasswordsNotMatch(false)
        setPassword(event.target.value)
    }

    function handleRetypePasswordChange(event) {
        if (passwordsNotMatch) setPasswordsNotMatch(false)
        setRetypePassword(event.target.value)
    }

    return (
        <div className="flex flex-col items-center justify-center text-neutral-0 py-80">
            <Logo />
            <div className="flex py-32">
                <Button
                    variant="secondary"
                    onClick={ () => toggleSidebar(<EnterCode toggleSidebar={ toggleSidebar } />) }
                    className="!bg-[#FCFCFD1A] !text-neutral-300 !border-none !shadow-light-25 w-[36px] h-40 absolute left-[70px]"
                >
                    <FontAwesomeIcon icon={ fas.faArrowLeft } className="h-[20px]" />
                </Button>
                <p className="text-heading-h5 text-neutral-300">Password Reset</p>
            </div>
            <p className="text-center text-body-m text-neutral-400 w-1/2">Please, enter and confirm your new password.</p>
            <div className="w-[70%] py-24">
                <Label
                    label="New Password"
                    value={ password }
                    className="mb-16"
                    password
                    leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faLock } /> }
                    rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faEyeSlash } onClick={ () => setPasswordVisibility(!passwordVisibility) } /> }
                    variant={ passwordsNotMatch ? 'error' : 'default' }
                    errorMessage="Passwords do not match"
                    active={ passwordFocused }
                    error={ passwordsNotMatch }
                >
                    <Input
                        text="Password"
                        type={ passwordVisibility ? "text" : "password" }
                        error={ passwordsNotMatch }
                        onChange={ handlePasswordChange }
                        onFocus={ () => onFocus(setPasswordFocused) }
                        onBlur={ () => onBlur(setPasswordFocused) }
                    />
                </Label>

                <Label
                    label="Repeat Password"
                    value={ retypePassword }
                    password
                    leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faLock } /> }
                    rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faEyeSlash } onClick={ () => setConfirmPasswordVisibility(!confirmPasswordVisibility) } /> }
                    variant={ passwordsNotMatch ? 'error' : 'default' }
                    active={ retypePasswordFocused }
                    error={ passwordsNotMatch }
                    errorMessage="Passwords do not match"
                >
                    <Input
                        text="Repeat Password"
                        error={ passwordsNotMatch }
                        type={ confirmPasswordVisibility ? "text" : "password" }
                        onChange={ handleRetypePasswordChange }
                        onFocus={ () => onFocus(setRetypePasswordFocused) }
                        onBlur={ () => onBlur(setRetypePasswordFocused) }
                    />
                </Label>

                <Button
                    className="w-full mt-32 disabled:bg-primary-200"
                    disabled={ password === "" || retypePassword === "" || passwordsNotMatch }
                    onClick={ handleSubmit }
                >
                    Continue
                </Button>
            </div>
        </div>
    )
}

export default NewPassword;

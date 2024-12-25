import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import Logo from "../../components/Logo";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import LogIn from "./LogIn";
import Success from "../../components/Success";
import Label from "../../components/Label";

import { url, signup } from "../../utils/api";

const SignUp = ({ toggleSidebar }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [passwordsNotMatch, setPasswordsNotMatch] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);
    const [validEmail, setValidEmail] = useState(true);

    const [emailFocused, setEmailFocused] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)
    const [retypePasswordFocused, setRetypePasswordFocused] = useState(false)
    const [firstNameFocused, setFirstNameFocused] = useState(false)
    const [lastNameFocused, setLastNameFocused] = useState(false)

    const onFocus = (setFocused) => setFocused(true)
    const onBlur = (setFocused) => setFocused(false)

    const validateEmail = (email) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        setValidEmail(isValid);
    };

    const success = () => {
        toggleSidebar(<Success text="You're all set! 🎉" toggleSidebar={ toggleSidebar } />)
    }

    const onFinish = async (values) => {
        try {
            const response = await axios.post(url + signup, values)
            if (response.status === 200) {
                success()
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setValidEmail(false)
            }
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

        if (email && validEmail && password && !passwordsNotMatch) {
            const values = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            }
            onFinish(values)
        }
    }

    function handleEmailChange(event) {
        setEmail(event.target.value)
        validateEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPasswordsNotMatch(false)
        setPassword(event.target.value)
    }

    function handleRetypePasswordChange(event) {
        setPasswordsNotMatch(false)
        setRetypePassword(event.target.value)
    }

    function handleFirstNameChange(event) {
        setFirstName(event.target.value)
    }

    function handleLastNameChange(event) {
        setLastName(event.target.value)
    }

    return (
        <div className="flex flex-col items-center justify-center text-neutral-0 py-80">
            <Logo />
            <div className="flex py-32">
                <Button
                    variant="secondary"
                    onClick={ () => toggleSidebar(<LogIn toggleSidebar={ toggleSidebar } />) }
                    className="!bg-[#FCFCFD1A] !text-neutral-300 !border-none !shadow-light-25 w-[36px] h-40 absolute left-[70px]"
                >
                    <FontAwesomeIcon icon={ fas.faArrowLeft } className="h-[20px]" />
                </Button>
                <p className="text-heading-h5 text-neutral-300">Hello</p>
            </div>
            <div className="w-[70%] pb-24">
                <Label
                    label="Email"
                    value={ email }
                    className="mb-16"
                    leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faEnvelope } /> }
                    variant={ (!validEmail) ? 'error' : 'default' }
                    active={ emailFocused }
                    error={ !validEmail }
                    errorMessage={ "Enter valid email address" }
                >
                    <Input
                        text="Email Address"
                        error={ !validEmail }
                        onChange={ handleEmailChange }
                        onFocus={ () => onFocus(setEmailFocused) }
                        onBlur={ () => onBlur(setEmailFocused) }
                    />
                </Label>

                <Label
                    label="First Name"
                    className="mb-16"
                    value={ firstName }
                    active={ firstNameFocused }
                    leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faUserPlus } /> }
                >
                    <Input
                        text="First name"
                        onChange={ handleFirstNameChange }
                        onFocus={ () => onFocus(setFirstNameFocused) }
                        onBlur={ () => onBlur(setFirstNameFocused) }
                    />
                </Label>
                <Label
                    label="Last Name"
                    className="mb-16"
                    value={ lastName }
                    active={ lastNameFocused }
                    leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faUserPlus } /> }
                >
                    <Input
                        text="Last name"
                        onChange={ handleLastNameChange }
                        onFocus={ () => onFocus(setLastNameFocused) }
                        onBlur={ () => onBlur(setLastNameFocused) }
                    />
                </Label>
                <Label
                    label="Password"
                    className="mb-16"
                    value={ password }
                    password
                    active={ passwordFocused }
                    leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faLock } /> }
                    rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faEyeSlash } onClick={ () => setPasswordVisibility(!passwordVisibility) } /> }
                    variant={ passwordsNotMatch ? 'error' : 'default' }
                    error={ passwordsNotMatch }
                    errorMessage="Passwords do not match"
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
                    label="Confirm Password"
                    active={ retypePasswordFocused }
                    value={ retypePassword }
                    className="mb-24"
                    password
                    leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faLock } /> }
                    rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faEyeSlash } onClick={ () => setConfirmPasswordVisibility(!confirmPasswordVisibility) } /> }
                    variant={ passwordsNotMatch ? 'error' : 'default' }
                    error={ passwordsNotMatch }
                    errorMessage="Passwords do not match"
                >
                    <Input
                        text="Retype Password"
                        type={ confirmPasswordVisibility ? "text" : "password" }
                        error={ passwordsNotMatch }
                        onChange={ handleRetypePasswordChange }
                        onFocus={ () => onFocus(setRetypePasswordFocused) }
                        onBlur={ () => onBlur(setRetypePasswordFocused) }
                    />
                </Label>
                <Button
                    className="w-full mt-32 disabled:bg-primary-200"
                    disabled={ !validEmail || email === "" || password === "" || retypePassword === "" || passwordsNotMatch }
                    onClick={ handleSubmit }
                >
                    Sign Up</Button>
            </div>

            <div className="text-body-l flex items-center justify-center pb-32">
                Already have an account?
                <Button
                    variant="tertiary"
                    className="!text-neutral-25"
                    onClick={ () => toggleSidebar(<LogIn toggleSidebar={ toggleSidebar } />) }
                >
                    Sign In
                </Button>
            </div>
        </div>
    )
}

export default SignUp;

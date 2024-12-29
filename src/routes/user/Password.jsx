import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import Label from "../../components/Label";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

import { user } from "../../utils/api";

const Password = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [current, setCurrent] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [passwordsNotMatch, setPasswordsNotMatch] = useState(false);
    const [wrongCurrentPass, setWrongCurrentPass] = useState(false)
    const [modal, setModal] = useState(false)

    const [passwordFocused, setPasswordFocused] = useState(false);
    const [currentFocused, setCurrentFocused] = useState(false);
    const [retypePasswordFocused, setRetypePasswordFocused] = useState(false);

    const onFocus = (setFocused) => setFocused(true);
    const onBlur = (setFocused) => setFocused(false);

    function handleCurrentChange(event) {
        if (wrongCurrentPass) setWrongCurrentPass(false)
        setCurrent(event.target.value);
    }

    function handlePasswordChange(event) {
        if (passwordsNotMatch) setPasswordsNotMatch(false);
        setPassword(event.target.value);
    }

    function handleRetypePasswordChange(event) {
        if (passwordsNotMatch) setPasswordsNotMatch(false);
        setRetypePassword(event.target.value);
    }

    const onFinish = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.put( user + "/change-password", {
                oldPassword: current,
                newPassword: password,
                passwordChanged: true
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                localStorage.setItem("passwordChanged", true)
                setModal(true)
            }
        } catch (error) {
            setWrongCurrentPass(true)
            console.error(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== retypePassword) {
            setPasswordsNotMatch(true);
            return;
        }

        if (password && !passwordsNotMatch) {
            onFinish();
        }
    };

    return (
        <div className="bg-neutral-25 text-neutral-800 px-32 pb-160">
            <p className="text-heading-h5 pt-40 pb-16">Change Password</p>
            <div className="w-full border-b border-b-neutral-200 pb-16">
                <div className="w-[40%] py-16">
                    <Label
                        label="Current Password"
                        value={ current }
                        className="mb-24 !text-neutral-700"
                        password
                        leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ faLock } /> }
                        active={ currentFocused }
                        variant={ wrongCurrentPass ? 'error' : 'default' }
                        errorMessage="Please enter a correct password"
                        error={ wrongCurrentPass }
                    >
                        <Input
                            text="e.g 123456"
                            type="password"
                            error={ wrongCurrentPass }
                            onChange={ handleCurrentChange }
                            onFocus={ () => onFocus(setCurrentFocused) }
                            onBlur={ () => onBlur(setCurrentFocused) }
                        />
                    </Label>
                    <Label
                        label="New Password"
                        value={ password }
                        className="mb-24 !text-neutral-700"
                        password
                        leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ faLock } /> }
                        variant={ passwordsNotMatch ? 'error' : 'default' }
                        errorMessage="Passwords do not match"
                        active={ passwordFocused }
                        error={ passwordsNotMatch }
                    >
                        <Input
                            type="password"
                            text="e.g 123456"
                            error={ passwordsNotMatch }
                            onChange={ handlePasswordChange }
                            onFocus={ () => onFocus(setPasswordFocused) }
                            onBlur={ () => onBlur(setPasswordFocused) }
                        />
                    </Label>

                    <Label
                        label="Repeat New Password"
                        value={ retypePassword }
                        className="!text-neutral-700"
                        password
                        leftIcon={ <FontAwesomeIcon icon={ faLock } /> }
                        variant={ passwordsNotMatch ? 'error' : 'default' }
                        active={ retypePasswordFocused }
                        error={ passwordsNotMatch }
                        errorMessage="Passwords do not match"
                    >
                        <Input
                            text="e.g 123456"
                            type="password"
                            error={ passwordsNotMatch }
                            onChange={ handleRetypePasswordChange }
                            onFocus={ () => onFocus(setRetypePasswordFocused) }
                            onBlur={ () => onBlur(setRetypePasswordFocused) }
                        />
                    </Label>
                </div>
            </div>
            <div className="flex justify-end pt-32 gap-12">
                <Button variant="secondary" onClick={ () => navigate("/user-profile/info") }>Cancel</Button>
                <Button
                    disabled={ current === "" || password === "" || retypePassword === "" || passwordsNotMatch || wrongCurrentPass }
                    onClick={ handleSubmit }
                >
                    Save Password
                </Button>
            </div>
            { modal && (
                <Modal>
                    <p className="text-heading-h6 text-neutral-900 pb-16">Password changed successfully!</p>
                    <div className="flex pt-32 gap-8 justify-end">
                        <Button size="sm" onClick={ () => { setModal(false); navigate("/user-profile/info") } }>OK</Button>
                    </div>
                </Modal>
            ) }
        </div>
    );
}

export default Password;

import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import Button from "../../components/Button";
import Logo from "../../components/Logo";
import NewPassword from "./NewPassword";
import PasswordReset from "./PasswordReset";

import { url, passwordReset } from "../../utils/api";
import { useCountDown } from "../../utils/utils";

const EnterCode = ({ toggleSidebar }) => {
    const [code, setCode] = useState(new Array(4).fill(""))
    const [maskedEmail, setMaskedEmail] = useState('');
    const [notValid, setNotValid] = useState(false)
    const { secondsLeft, start } = useCountDown();

    const codeCompleted = (code) => {
        return code.every(element => element !== "");
    };

    const maskEmail = (email) => {
        const parts = email.split('@');
        const maskedUsername = parts[0].slice(0, 1) + '*'.repeat(parts[0].length - 2) + parts[0].slice(-1);
        const maskedEmail = maskedUsername + '@' + parts[1];
        return maskedEmail;
    };

    const success = () => {
        toggleSidebar(<NewPassword toggleSidebar={ toggleSidebar } />)
    }

    const onFinish = async (values) => {
        try {
            const response = await axios.post(url + passwordReset + "/check-code", values)
            if (response.status === 200) {
                localStorage.setItem("token", response.data)
                success()
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('Incorrect code');
                setNotValid(true)
            } else if (error.response && error.response.status === 500) {
                console.log('Internal Server Error');
            } else {
                console.log('An error occurred');
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const email = localStorage.getItem("email");
        if (code) {
            const values = {
                email: email,
                code: code.join("")
            }
            onFinish(values)
        }
    }

    const handleChange = (e, index) => {
        if (notValid) setNotValid(false)
        if (isNaN(e.target.value)) return
        setCode([...code.map((data, ind) => (ind === index ? e.target.value : data))])

        if (e.target.value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }

        else if (e.target.value === "" && e.target.previousSibling) {
            e.target.previousSibling.focus()
        }
    }

    useEffect(() => {
        start(60)
        const email = localStorage.getItem("email");
        if (email) {
            const masked = maskEmail(email);
            setMaskedEmail(masked);
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-neutral-25 py-80">
            <Logo />
            <div className="flex py-32">
                <Button
                    variant="secondary"
                    onClick={ () => toggleSidebar(<PasswordReset toggleSidebar={ toggleSidebar } />) }
                    className="!bg-[#FCFCFD1A] !text-neutral-300 !border-none !shadow-light-25 w-[36px] h-40 absolute left-[70px]"
                >
                    <FontAwesomeIcon icon={ fas.faArrowLeft } className="h-[20px]" />
                </Button>
                <p className="text-heading-h5 text-neutral-300">Password Reset</p>
            </div>
            <p className="text-center text-body-m text-neutral-400 w-1/2">We have sent code to your email { maskedEmail }. Please, enter the code below to verify.</p>
            <div className="mt-[30px] mb-16 flex gap-[20px]">
                {
                    code.map((data, i) => {
                        return <input
                            key={ i }
                            value={ data }
                            maxLength={ 1 }
                            onChange={ (e) => handleChange(e, i) }
                            className="!w-[48px] !h-[64px] bg-[#FCFCFD1A] border border-neutral-200 focus:outline-[3px] focus:outline-neutral-200 rounded-16 text-center text-heading-h3 !text-neutral-25"
                            type="text"
                        />
                    })
                }
            </div>
            { notValid ? <p className="text-body-s text-primary-300 pb-12">Invalid code!</p> : null }

            <p className="text-center text-body-m text-neutral-400 w-1/2">Didn't receive email?</p>
            { secondsLeft > 0 ?
                <p className="text-center text-body-m py-16 text-neutral-400 w-1/2">You can resend email in <span className="font-semibold text-neutral-25">{ secondsLeft > 0 && `${secondsLeft}` }</span> seconds.</p>
                :
                <Button
                    variant="tertiary"
                    onClick={ () => toggleSidebar(<PasswordReset toggleSidebar={ toggleSidebar } />) }
                >
                    Resend email
                </Button> }
            <Button
                className="w-[70%] mt-16 disabled:bg-primary-200"
                disabled={ !codeCompleted(code) }
                onClick={ handleSubmit }
            >
                Continue
            </Button>
        </div>
    )
}

export default EnterCode;

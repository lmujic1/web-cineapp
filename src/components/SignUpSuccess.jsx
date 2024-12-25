import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

import Logo from "./Logo";
import Button from "./Button";

const SignUpSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center text-justify text-neutral-25 py-80 h-[825px]">
            <Logo />
            <p className="pt-32 pb-24 text-heading-h5 text-neutral-300">You're all set! 🎉</p>
            <p className="text-center text-body-m text-neutral-400 w-1/2">Start exploring latest movies, venues, and ticket options!</p>
            <div className="w-[130px] h-[130px] bg-[#F9FAFB29] text-neutral-25 rounded-full flex justify-center items-center absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FontAwesomeIcon className="w-40 h-40" icon={ faFilm } />
            </div>
            <div className="w-32 h-32 bg-neutral-400 rounded-full absolute top-[40%] right-[60%]" />
            <div className="w-16 h-16 bg-neutral-500 rounded-full absolute top-[42%] right-[37%]" />
            <div className="w-16 h-16 bg-neutral-500 rounded-full absolute top-[58%] right-[36%]" />
            <div className="w-16 h-16 bg-neutral-700 rounded-full absolute top-[58%] right-[62%]" />
            <div className="w-12 h-12 bg-neutral-300 rounded-full absolute top-[50%] right-[65%]" />
            <div className="w-12 h-12 bg-neutral-300 rounded-full absolute top-[52%] right-[32%]" />
            <div className="px-48 absolute bottom-[180px] w-full">
                <Button className="w-full" onClick={ () => { navigate("/currently-showing"); } }>See movies</Button>
            </div>
        </div>
    )
}

export default SignUpSuccess;

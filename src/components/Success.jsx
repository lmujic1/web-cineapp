import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import Logo from "./Logo";
import { useEffect } from "react";

const Success = ({ text, toggleSidebar, reservation = false }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (reservation) {
            toggleSidebar(null)
            return
        }
        const timeoutId = setTimeout(() => {
            toggleSidebar(null);
            navigate("/");
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [toggleSidebar]);

    return (
        <div className="flex flex-col items-center text-justify text-neutral-25 py-80 h-[625px]">
            <Logo />
            <p className="pt-32 pb-24 text-heading-h5 text-neutral-300">{ text }</p>
            <p className="text-center text-body-m text-neutral-400 w-1/2">Please, wait. You will be directed to the homepage.</p>
            <div className="">
                <div className="w-[130px] h-[130px] bg-[#F9FAFB29] text-neutral-25 rounded-full flex justify-center items-center absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FontAwesomeIcon className="w-40 h-40" icon={ faVideo } />
                </div>
                <div className="w-32 h-32 bg-neutral-400 rounded-full absolute top-[45%] right-[60%]" />
                <div className="w-16 h-16 bg-neutral-500 rounded-full absolute top-[48%] right-[37%]" />
                <div className="w-16 h-16 bg-neutral-500 rounded-full absolute top-[70%] right-[36%]" />
                <div className="w-16 h-16 bg-neutral-700 rounded-full absolute top-[72%] right-[62%]" />
                <div className="w-12 h-12 bg-neutral-300 rounded-full absolute top-[60%] right-[65%]" />
                <div className="w-12 h-12 bg-neutral-300 rounded-full absolute top-[62%] right-[32%]" />
            </div>
        </div>
    )
}

export default Success;

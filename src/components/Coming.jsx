import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

import Button from "./Button";

const Coming = ({ movie }) => {
    return (
        <div className="p-32 flex flex-col justify-center items-center text-justify">
            <p className="text-heading-h5 text-neutral-700">{ movie.name } is coming in { format(movie.projectionStart, "MMM") }!</p>
            <p className="text-neutral-500 py-16">Get notified when the movie is part of the schedule.</p>
            <div className="w-[142px] h-[142px] bg-neutral-200 text-neutral-600 rounded-full flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FontAwesomeIcon className="w-32 h-32" icon={ fas.faBell } />
            </div>
            <div className="w-32 h-32 bg-neutral-400 rounded-full absolute top-1/3 right-[60%]" />
            <div className="w-16 h-16 bg-neutral-500 rounded-full absolute top-1/3 right-[42%]" />
            <div className="w-16 h-16 bg-neutral-500 rounded-full absolute top-[60%] right-[36%]" />
            <div className="w-16 h-16 bg-neutral-700 rounded-full absolute top-[62%] right-[62%]" />
            <div className="w-12 h-12 bg-neutral-300 rounded-full absolute top-1/2 right-[65%]" />
            <div className="w-12 h-12 bg-neutral-300 rounded-full absolute top-[52%] right-[32%]" />

            <div className="absolute bottom-0 border-t border-neutral-200 py-24 gap-16 px-[20px] w-full">
                <Button className="w-full">
                    Notify me
                </Button>
                <div className="flex justify-center items-center">
                    <p className="pt-8"> Only signed up users can be notified.</p>
                    <Button variant="tertiary" className="!text-neutral-800">Sign up</Button>
                </div>
            </div>
        </div>
    )
}

export default Coming;

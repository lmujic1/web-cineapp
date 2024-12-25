import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVideo } from "@fortawesome/free-solid-svg-icons"

import { createClassName } from "../utils/utils"

const Logo = ({ className }) => {
    return (
        <div className={ createClassName("flex items-center font-body", className) }>
            <span className="flex justify-center items-center bg-neutral-25 w-[26px] h-[24px] rounded-8 text-primary-600">
                <FontAwesomeIcon icon={ faVideo } className="h-[14px]" />
            </span>
            <div className="pl-4 text-heading-h5">
                <span className="text-neutral-0">Cine</span>
                <span className="text-primary-600">app.</span>
            </div>
        </div>
    )
}

export default Logo;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faVideo } from "@fortawesome/free-solid-svg-icons"

import { createClassName } from "../utils/utils"

const Footer = ({ className }) => {
    return (
        <div className={ createClassName("h-[212px] w-full absolute bottom-0 bg-primary-600 font-body", className) }>
            <div className="h-[212px] bg-gradient-to-r from-supporting-special-start to-supporting-special-stop flex flex-col items-center justify-center text-neutral-25">
                <div className="flex items-center">
                    <span className="flex justify-center items-center bg-neutral-25 w-[26px] h-[24px] text-primary-600 rounded-8">
                        <FontAwesomeIcon icon={ faVideo } className="h-[14px]" />
                    </span>
                    <p className="pl-4 text-heading-h5">Cineapp.</p>
                </div>
                <div className="text-heading-content flex py-12">
                    <a href="/aboutus" className="border-r w-80 border-neutral-25 mr-12 cursor-pointer">ABOUT US</a>
                    <a href="/tickets" className="cursor-pointer">TICKETS</a>
                </div>
                <div className="text-primary-25 font-normal text-body-m">
                    <p>Copyright @Cineapp. Built with love in Sarajevo. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Footer;

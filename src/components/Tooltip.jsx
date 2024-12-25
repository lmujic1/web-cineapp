import { useState } from "react";

import { createClassName } from "../utils/utils";

const Tooltip = ({ className, infoText, children, position = "middle" }) => {
    const [showTooltip, setShowTooltip] = useState(false)

    const possitionClassName = {
        middle: "bottom-[-8px] left-[48%]",
        right: "bottom-[-8px] right-[8%]",
    }

    return (
        <div className={ `flex flex-col gap-[20px] justify-center relative ${position === "right" ? "items-end" : "items-center"}` }>
            <div onMouseEnter={ () => setShowTooltip(true) }
                onMouseLeave={ () => setShowTooltip(false) }>
                { children }
            </div>
            <div className={ createClassName(`h-fit z-20 text-wrap absolute w-[309px] rounded-8 px-4 py-8 text-body-s normal-case font-normal text-neutral-0 bg-neutral-900 text-center transition-all ease-in ${showTooltip ? "opacity-100" : "opacity-0"} ${position === "right" ? "top-[-45px]" : "top-[-55px]"}`, className) }>
                { infoText }
                <div className={ createClassName("bg-neutral-900 w-0 h-0 border-l-8 border-l-neutral-0 border-r-8 border-r-neutral-0 border-t-8 border-t-neutral-900 absolute", possitionClassName[position]) }></div>
            </div>
        </div>
    )

}

export default Tooltip;

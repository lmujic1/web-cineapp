import React, { useState } from "react";

import { createClassName } from "../utils/utils";

const Seat = ({ className, children, variant = 'available', onClick, ...props }) => {
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        setSelected(!selected);
        if (onClick) {
            onClick();
        }
    };

    const variantClassName = {
        available: "border border-neutral-200 text-body-s text-neutral-800 bg-neutral-25 rounded-8 cursor-pointer",
        reserved: "border border-neutral-200 text-body-s text-neutral-800 rounded-8 bg-neutral-200 cursor-default",
        selected: "border border-primary-600 bg-primary-600 text-neutral-25 text-body-s rounded-8 cursor-pointer"
    };

    const seatClasses = createClassName(
        variantClassName[variant],
        "h-40 w-[52px] flex items-center justify-center px-4 py-4",
        className
    );

    return (
        <div className={ seatClasses } onClick={ handleClick } { ...props }>
            { children }
        </div>
    );
};

export default Seat;

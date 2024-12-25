import { useState } from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcVisa, faCcMastercard } from "@fortawesome/free-brands-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

import { createClassName } from "../utils/utils";

const CreditCard = ({ className, cardNumber, type, onClick }) => {
    const [selected, setSelected] = useState(false)
    let icon;

    if (type === "visa") {
        icon = <FontAwesomeIcon className="w-40 h-32" icon={ faCcVisa } />;
    } else if (type === "mastercard") {
        icon = <FontAwesomeIcon className="w-40 h-32" icon={ faCcMastercard } />;
    } else {
        icon = <FontAwesomeIcon className="w-40 h-32" icon={ faCreditCard } />;
    }

    return (
        <div className={ createClassName(`w-full flex rounded-16 py-12 px-12 items-center cursor-pointer`, className) }
            onClick={ () => {
                onClick();
                setSelected(!selected)
            } }
        >
            <div className="flex gap-[50px] items-center w-full pl-16 flex-1">
                { icon }
                <p className="text-neutral-500">
                    ****
                    <span className="mx-12" />
                    ****
                    <span className="mx-12" />
                    ****
                    <span className="mx-12" />
                    { cardNumber.slice(-4) }
                </p>
            </div>
            <Button variant="tertiary"> Delete Card</Button>
        </div>
    )
}

export default CreditCard;

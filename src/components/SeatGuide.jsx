import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import Seat from "./Seat";
import Button from "./Button"

import { createClassName } from "../utils/utils"

const SeatGuide = ({ className, selectedSeats, payment = false, totalPrice, onClick }) => {
    const [disableButton, setDisableButton] = useState(false)

    return (
        <div className={ createClassName("flex flex-col justify-center items-center text-body-l font-body", className) }>
            <p className="pb-32">Seat Guide</p>
            <div className="grid grid-cols-2 pt-12 gap-80 border-b border-neutral-200">
                <div className="flex flex-col gap-12">
                    <div className="flex items-center mb-2">
                        <Seat className="!cursor-default">XY</Seat>
                        <span className="ml-8">Available</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <Seat variant="reserved">XY</Seat>
                        <span className="ml-8">Reserved</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <Seat variant="selected" className="!cursor-default">XY</Seat>
                        <span className="ml-8">Selected</span>
                    </div>
                </div>
                <div className="flex flex-col gap-12 pb-24">
                    <div className="flex items-center mb-2">
                        <Seat className="!cursor-default">XY</Seat>
                        <span className="ml-8">Regular Seats (7 BAM)</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <Seat className="!cursor-default"> <FontAwesomeIcon className="p-0 pr-4" icon={ fas.faStar } />XY</Seat>
                        <span className="ml-8">VIP Seats (10 BAM)</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <Seat className="!w-[104px] !cursor-default">XY</Seat>
                        <span className="ml-8">Love Seats (24 BAM)</span>
                    </div>
                </div>
            </div>
            <p className="py-24">Chosen Seats</p>
            <div className="flex w-[94%] border-b border-neutral-200">
                <p className="flex-1 pb-12">Seat(s)</p>
                <p>Total price</p>
            </div>
            <div className="flex w-[94%] text-heading-h6 pt-12 pb-160">
                <p className="flex-1">{ selectedSeats.join(",") }</p>
                <p> { totalPrice } KM</p>
            </div>
            <Button className="w-full" onClick={ () => { onClick(); setDisableButton(true) } } disabled={ selectedSeats.length === 0 || disableButton }>{ payment ? "Continue to Payment" : "Make reservation" }</Button>
        </div>
    )
}

export default SeatGuide;

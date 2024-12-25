import { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import Seat from "./Seat";
import { createClassName } from "../utils/utils";

const CinemaSeats = ({ className, selectedSeats, reservedSeats, setSelectedSeats }) => {
    const [regularSeats, setRegularSeats] = useState([]);
    const [vipSeats, setVipSeats] = useState([]);
    const [loveSeats, setLoveSeats] = useState([]);

    const handleSeatClick = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const generateRegularSeatIds = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
        const cols = ['1', '2', '3', '4', '5', '6', '7', '8'];
        return rows.flatMap(row => cols.map(col => `${row}${col}`));
    };

    const generateVIPSeatIds = () => {
        const rows = ['G', 'H'];
        const cols = ['1', '2', '3', '4', '5', '6', '7', '8'];
        return rows.flatMap(row => cols.map(col => `${row}${col}`));
    };

    const generateLoveSeatIds = () => ['I1', 'I2', 'I3', 'I4'];

    useEffect(() => {
        const regular = generateRegularSeatIds().map(id => ({ id, status: reservedSeats?.includes(id) ? 'reserved' : 'available' }));
        const vip = generateVIPSeatIds().map(id => ({ id, status: reservedSeats?.includes(id) ? 'reserved' : 'available' }));
        const love = generateLoveSeatIds().map(id => ({ id, status: reservedSeats?.includes(id) ? 'reserved' : 'available' }));

        setRegularSeats(regular);
        setVipSeats(vip);
        setLoveSeats(love);
    }, [reservedSeats]);

    return (
        <div className={ createClassName("flex flex-col justify-center items-center", className) }>
            <p className="text-body-l pb-[50px] pt-4">Cinema Screen</p>
            <div className="h-24 w-[400px] bg-gradient-to-b from-primary-600 to-neutral-25 transform -translate-y-1/4 rounded-t-full"></div>
            <div className="grid grid-cols-9 items-center gap-8 pt-[75px]">
                { regularSeats.map((seat) => {
                    const seatHtml = (
                        <Seat
                            key={ seat.id }
                            variant={ selectedSeats.includes(seat.id) ? 'selected' : seat.status }
                            onClick={ seat.status === 'reserved' ? null : () => handleSeatClick(seat.id) }
                        >
                            { seat.id }
                        </Seat>
                    );

                    if (Number(seat.id.slice(1)) % 9 === 4) {
                        return (
                            <Fragment key={ seat.id }>
                                { seatHtml }
                                <div />
                            </Fragment>

                        );
                    }
                    return seatHtml;
                }) }
                { vipSeats.map((seat) => {
                    const seatHtml = (
                        <Seat
                            key={ seat.id }
                            variant={ selectedSeats.includes(seat.id) ? 'selected' : seat.status }
                            onClick={ seat.status === 'reserved' ? null : () => handleSeatClick(seat.id) }
                        >
                            <FontAwesomeIcon className="p-0 pr-4" icon={ fas.faStar } />
                            { seat.id }
                        </Seat>
                    );
                    if (Number(seat.id.slice(1)) % 9 === 4) {
                        return (
                            <Fragment key={ seat.id }>
                                { seatHtml }
                                <div />
                            </Fragment>
                        );
                    }
                    return seatHtml;
                }) }
            </div>
            <div className="grid grid-cols-9 gap-8 items-center pt-8">
                { loveSeats.map((seat, i) => {
                    const seatHtml = (
                        <Seat
                            key={ seat.id }
                            variant={ selectedSeats.includes(seat.id) ? 'selected' : seat.status }
                            className="!w-[112px]"
                            onClick={ seat.status === 'reserved' ? null : () => handleSeatClick(seat.id) }
                            style={ { gridColumn: 'span 2' } }
                        >
                            { seat.id }
                        </Seat>
                    );

                    if (i % 2 === 1) {
                        return (
                            <Fragment key={ seat.id }>
                                { seatHtml }
                                <div />
                            </Fragment>
                        );
                    }
                    return seatHtml;
                }) }
            </div>
        </div>
    );
};

export default CinemaSeats;

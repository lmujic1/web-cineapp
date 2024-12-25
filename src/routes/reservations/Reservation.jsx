import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";

import Image from "../../components/Image";
import SeatGuide from "../../components/SeatGuide";
import CinemaSeats from "../../components/CinemaSeats";
import Button from "../../components/Button";

import { url, reservation } from "../../utils/api";
import Modal from "../../components/Modal";

const Reservation = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const movie = location.state.movie;
    const projection = location.state.projection;
    const date = location.state.date;
    const payment = location.state.payment;
    const [modal, setModal] = useState(false)
    const [cover, setCover] = useState();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [reservedSeats, setReservedSeats] = useState([]); //projection?.reservedSeats?.concat(projection.purchasedSeats);

    const calculateSeatPrice = (seatId) => {
        if (seatId.startsWith("I")) {
            return 24;
        } else if (seatId.startsWith("G") || seatId.startsWith("H")) {
            return 10;
        } else {
            return 7;
        }
    };

    const totalPrice = selectedSeats.reduce((acc, seatId) => {
        return acc + calculateSeatPrice(seatId);
    }, 0);

    function getCover() {
        movie.images.forEach(element => {
            if (element.cover) {
                setCover(element.link)
            }
        });
    }

    const getReservedSeats = async () => {
        const token = localStorage.getItem("token")
        let allSeats = []
        try {
            const response = await axios.get(`${url}${reservation}/projection/${projection.projectionId}`, { 
                    params: {
                        date: (new Date(date)).toISOString().substring(0, 10)
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            allSeats = response.data.flatMap(reservation => reservation.seats);
            setReservedSeats(allSeats);
        } catch (error) {
            console.error(error);
        }

        // try {
        //     const response_2 = await axios.get(`${url}${reservation}/projection/${projection.projectionId}`, { 
        //             params: {
        //                 date: (new Date(date)).toISOString().substring(0, 10)
        //             },
        //             headers: {
        //                 'Authorization': `Bearer ${token}`
        //             }
        //         }
        //     );
        //     allSeats = allSeats.concat(response_2.data.flatMap(reservation => reservation.seats));
        //     setReservedSeats(allSeats);
        // } catch (error) {
        //     console.error(error);
        // }





    };

    useEffect(() => {
        getCover();
        getReservedSeats();
    }, [movie])

    const onFinish = async (values) => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(url + reservation, values, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setModal(true)
            }
        } catch (error) {
            console.log(error)
            console.log(error.response.data.message)
        }
    }

    const makeReservationClick = () => {
        if (selectedSeats.length !== 0) {
            const values = {
                date: date,
                projectionId: projection.projectionId,
                seats: selectedSeats,
                price: totalPrice,
                type: "RESERVATION"
            }
            onFinish(values)
        }
    }

    const makePaymentClick = () => {
        if (selectedSeats.length !== 0) {
            navigate("/payment-details", {
                state: {
                    movie: movie,
                    cover: cover,
                    projection: projection,
                    date: date,
                    totalPrice: totalPrice,
                    selectedSeats: selectedSeats
                }
            });
        }
    }

    return (
        <div className="py-16 text-neutral-800 font-body">
            <div className="grid grid-cols-2">
                <div className="border-b border-primary-600">
                    <p className="text-heading-h5 pl-[118px] pb-16">Seat Options</p>
                </div>
                <div className="border-b border-neutral-200"></div>
            </div>
            <div className="grid lg:grid-cols-3 sm:grid-cols-1 py-12 border-b border-neutral-200 px-[118px]">
                <div className="py-12 flex">
                    <Image className={ `rounded-12 object-cover h-[126px] w-[134px]` } src={ cover } alt="" />
                    <div className="pl-16">
                        <p className="text-heading-h6 pb-6"> { movie.name }</p>
                        <div className="flex text-body-l font-normal pt-[10px] pb-[6px]">
                            <p className="border-primary-600 h-[20px] pr-12 border-r">{ movie.rating }</p>
                            <p className="border-primary-600 h-[20px] px-12 border-r">{ movie.language }</p>
                            <p className="pl-12">{ movie.duration } Min</p>
                        </div>
                    </div>
                </div>
                <div className="py-12 flex flex-col text-body-l">
                    <p className="text-heading-h6 pb-[10px]">Booking Details</p>
                    <p className="pb-8">{ format(date, "EEEE, MMM dd") } at { projection.time.slice(0, 5) }</p>
                    <p className="pb-[10px]">{ projection.venue.street } { projection.venue.streetNumber }, { projection.venue.city.name }</p>
                    <p>Hall 1</p>
                </div>
            </div>
            <div className="grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-1 gap-[50px] pt-12 pb-40 px-[118px]">
                <CinemaSeats selectedSeats={ selectedSeats } reservedSeats={ reservedSeats } setSelectedSeats={ setSelectedSeats } />
                <SeatGuide selectedSeats={ selectedSeats } payment={ payment } totalPrice={ totalPrice } onClick={ payment ? makePaymentClick : makeReservationClick } />
            </div>
            { modal && <Modal>
                <p className="text-heading-h6 text-neutral-900 pb-16">Seats Reserved!</p>
                <p className="text-body-m text-neutral-500 text-justify">
                    Your reservation confirmation has been sent to your email. You can also see your reservation details on your User profile and set a reminder for ticket purchasing.</p>
                <div className="flex pt-32 gap-8 justify-end">
                    <Button variant="secondary" size="sm" onClick={ () => navigate("/") }>Back to Home</Button>
                    { false && <Button size="sm">See Reservation</Button> }
                </div>
            </Modal> }
        </div>
    )
}

export default Reservation;

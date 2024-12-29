import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate, Link } from "react-router-dom";

import Tooltip from "../../components/Tooltip";
import Image from "../../components/Image";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { NumberOfElementsContext } from "./UserProfile";

import { reservation } from "../../utils/api";

const PendingReservations = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);
    const [modal, setModal] = useState(false);
    const [reservationId, setReservationId] = useState("");

    const { numberOfReservations, setNumberOfReservations } = useContext(NumberOfElementsContext);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchReservations = async () => {
            try {
                const response = await axios.get(`${reservation}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const reservationsData = response.data.map(reservation => ({
                    id: reservation.reservationId,
                    projection: reservation.projection,
                    seats: reservation.seats,
                    date: reservation.date,
                    price: reservation.price,
                }));

                setReservations(reservationsData);
            } catch (error) {
                console.error("Error loading user reservations:", error);
            }
        };

        fetchReservations();
    }, []);

    const getCover = (images) => {
        for (let element of images) {
            if (element.cover) {
                return element.link;
            }
        }
        return null;
    };

    const handleCancel = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(
                `${reservation}/${reservationId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                setReservations(prevReservations =>
                    prevReservations.filter(reservation => reservation.id !== reservationId)
                );
                setNumberOfReservations(numberOfReservations - 1);
                setModal(false);
                setReservationId("");
            }
        } catch (error) {
            console.error("Error canceling reservation:", error);
        }
    };

    return (
        <div className="bg-neutral-25 text-neutral-800 px-32 pb-160 font-body">
            <p className="text-heading-h5 pt-40 pb-24 w-full border-b border-b-neutral-200 mb-24">Pending Reservations</p>
            {
                reservations.map((reservation, index) => {
                    return (
                        <div key={ index } className="h-[252px] border border-neutral-200 rounded-16 px-16 py-24 text-body-l mb-24">
                            <div className="flex">
                                <Link to={ `/movie-details/${reservation.projection.movie.movieId}` } className="flex-1">
                                    <p className="text-heading-h6">{ reservation.projection.movie.name } </p>
                                </Link>
                                <Tooltip position="right" infoText="Reservation expires one hour before projection." className="w-[271px]">
                                    <FontAwesomeIcon className="text-neutral-500" onClick={ () => setShowTooltip(!showTooltip) } icon={ faInfoCircle } />
                                </Tooltip>
                            </div>
                            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 pt-[36px] gap-64">
                                <div className="col-span-3 flex gap-24">
                                    <Link to={ `/movie-details/${reservation.projection.movie.movieId}` }>
                                        <Image src={ getCover(reservation.projection.movie.images) || '' }
                                            alt="Image" className={ `object-cover w-[134px] h-[126px] rounded-16` } />
                                    </Link>
                                    <Link to={ `/movie-details/${reservation.projection.movie.movieId}` } className="flex-1">
                                        <div className="flex flex-col gap-12">
                                            <p className="text-neutral-500 text-heading-h6">Booking Details</p>
                                            <p>{ format(reservation.date, "EEEE, MMM dd") } at { reservation.projection.time.slice(0, 5) }</p>
                                            <p>{ reservation.projection.venue.name }, { reservation.projection.venue.street } { reservation.projection.venue.streetNumber }, { reservation.projection.venue.city.name }</p>
                                            <div className="flex">
                                                <p className="border-primary-600 h-[20px] pr-12 border-r">{ reservation.projection.movie.rating }</p>
                                                <p className="border-primary-600 h-[20px] px-12 border-r">{ reservation.projection.movie.language }</p>
                                                <p className="pl-12">{ reservation.projection.movie.duration } Min</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <Link to={ `/movie-details/${reservation.projection.movie.movieId}` } className="flex-1">
                                    <div className="flex flex-col gap-12">
                                        <p className="text-neutral-500 text-heading-h6">Seat(s) Details</p>
                                        <p>Seat(s): <span className="font-semibold">{ reservation.seats.join(', ') }</span></p>
                                        <p> Hall: <span className="font-semibold">Hall 1</span></p>
                                        <p>Total Price: <span className="font-semibold">{ reservation.price } KM</span></p>
                                    </div>
                                </Link>
                                <div className="flex flex-col gap-12 w-full" onClick={ (e) => e.stopPropagation() }>
                                    <Button onClick={ () => {
                                        navigate("/payment-details", {
                                            state: {
                                                reservationId: reservation.id,
                                                movie: reservation.projection.movie,
                                                cover: getCover(reservation.projection.movie.images),
                                                projection: reservation.projection,
                                                date: reservation.date,
                                                totalPrice: reservation.price,
                                                selectedSeats: reservation.seats
                                            }
                                        });
                                    } }>Buy Ticket</Button>
                                    <Button variant="secondary" onClick={ () => { setReservationId(reservation.id); setModal(true) } }>Cancel Reservation</Button>
                                </div>
                            </div>
                            { modal && (
                                <Modal>
                                    <p className="text-heading-h6 text-neutral-900 pb-16">Cancel Reservation</p>
                                    <p className="text-body-m text-neutral-500 text-justify">
                                        Do you want to cancel your reservation?
                                    </p>
                                    <div className="flex pt-32 gap-8 justify-end">
                                        <Button variant="secondary" size="sm" onClick={ () => { setReservationId(""); setModal(false) } }>Back</Button>
                                        <Button size="sm" onClick={ handleCancel }>Yes, Cancel It</Button>
                                    </div>
                                </Modal>
                            ) }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default PendingReservations;

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

import Image from "../../components/Image";
import { Link } from "react-router-dom";

import { url, reservation } from "../../utils/api";

const UpcomingProjections = () => {
    const [reservations, setReservations] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchReservations = async () => {
            try {
                const response = await axios.get(`${url}${reservation}/user/upcoming-projections`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const projectionMap = new Map();

                response.data.forEach(reservation => {
                    const { projection } = reservation;
                    if (typeof projection !== 'number') {
                        projectionMap.set(projection.projectionId, projection);
                    }
                });

                const reservationsData = response.data.map(reservation => {
                    const { projection } = reservation;
                    const fullProjection = typeof projection === 'number' ? projectionMap.get(projection) : projection;
                    return {
                        id: reservation.reservationId,
                        projection: fullProjection,
                        seats: reservation.seats,
                        date: reservation.date,
                        price: reservation.price,
                    };
                });

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

    return (
        <div className="bg-neutral-25 text-neutral-800 font-body">
            {
                reservations.map((reservation, index) => {
                    return (
                        <Link to={ `/movie-details/${reservation.projection.movie.movieId}` }>
                            <div key={ index } className="h-[252px] border border-neutral-200 rounded-16 px-12 py-24 text-body-l mb-24">
                                <div className="flex">
                                    <p className="flex-1 text-heading-h6">{ reservation.projection.movie.name } </p>
                                </div>
                                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 pt-[36px] gap-80">
                                    <div className="col-span-2 flex gap-24">
                                        <div>
                                            <Image src={ getCover(reservation.projection.movie.images) || '' }
                                                alt="Image" className={ `object-cover w-[134px] h-[126px] rounded-16` } />
                                        </div>
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
                                    </div>
                                    <div className="flex flex-col gap-12">
                                        <p className="text-neutral-500 text-heading-h6">Seat(s) Details</p>
                                        <p>Seat(s): <span className="font-semibold">{ reservation.seats.join(', ') }</span></p>
                                        <p> Hall: <span className="font-semibold">Hall 1</span></p>
                                        <p>Total Price: <span className="font-semibold">{ reservation.price } KM</span></p>

                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default UpcomingProjections;

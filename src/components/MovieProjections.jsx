import { format, isAfter, addHours } from "date-fns";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import { DropdownItem, LabeledDropdown } from "./Dropdown";
import DateCard from "./card/DateCard";
import Pagination from "./Pagination";
import Button from "./Button";
import Label from "./Label";
import LogIn from "../routes/login/LogIn";

const MovieProjections = ({ movie, cityList, venueList, getVenues, projectionList, filterParams, toggleSidebar, setFilterParams }) => {
    const navigate = useNavigate();
    const [datePagination, setDatePagination] = useState({ page: 0, size: 6 })
    const [dates, setDates] = useState([])
    const [currentDates, setCurrentDates] = useState([])
    const allFieldsNotNull = Object.values(filterParams).every((value) => value !== null);

    function _handlePaginationChange(setPagination, fieldsAndValues) {
        setPagination(prevPagination => ({
            ...prevPagination,
            ...fieldsAndValues
        }));
    }

    const handleNextPage = () => {
        _handlePaginationChange(setDatePagination, { page: datePagination.page + 1 })
    };

    const handlePrevPage = () => {
        _handlePaginationChange(setDatePagination, { page: datePagination.page - 1 })
    };

    function _handleFilterChange(fieldsToUpdate) {
        const updatedParams = { ...filterParams, ...fieldsToUpdate };
        setFilterParams(updatedParams);
    }

    const getDates = () => {
        let date = new Date();
        let endDate = new Date(format(movie.projectionEnd, "yyyy-MM-dd"));
        let array = [];

        while (date.valueOf() < endDate.valueOf()) {
            array.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        array.push(endDate)
        setDates(array)
        setCurrentDates(array.slice(0, datePagination.size));
    }

    function getCityName(id) {
        return cityList?.find(c => c.id === id)?.name
    }

    function getVenueName(id) {
        return venueList?.find(c => c.venueId === id)?.name
    }

    const handleReservation = () => {
        const projection = getProjectionFromTime();
        if (!localStorage.getItem("token")) {
            toggleSidebar(<LogIn toggleSidebar={ toggleSidebar } reservation />);
        } else {
            navigate("/ticket", {
                state: {
                    movie: movie,
                    projection: projection,
                    date: filterParams.startDate,
                    payment: false
                }
            });
        }
    };

    const handlePayment = () => {
        const projection = getProjectionFromTime();
        if (!localStorage.getItem("token")) {
            toggleSidebar(<LogIn toggleSidebar={ toggleSidebar } reservation />);
        } else {
            navigate("/ticket", {
                state: {
                    movie: movie,
                    projection: projection,
                    date: filterParams.startDate,
                    payment: true
                }
            });
        }
    };

    const getProjectionFromTime = () => {
        const foundProjection = projectionList.find(
            (projection) => projection.time === filterParams.time
        );

        if (foundProjection) {
            return foundProjection;
        } else {
            return null;
        }
    };

    const isValidProjectionTime = (projectionTime, selectedDate) => {
        const projectionDateTime = new Date(format(selectedDate, 'yyyy-MM-dd') + 'T' + projectionTime);
        const currentTime = new Date();
        const currentTimePlusOneHour = addHours(currentTime, 1);
        return isAfter(projectionDateTime, currentTimePlusOneHour);
    }

    useEffect(() => {
        const startIndex = datePagination.page * datePagination.size;
        const endIndex = startIndex + datePagination.size;
        setCurrentDates(dates.slice(startIndex, endIndex));
        if (filterParams.startDate === null) _handleFilterChange({ startDate: format(new Date(), 'yyyy-MM-dd') })
    }, [datePagination])

    useEffect(() => {
        getDates()
        _handlePaginationChange(setDatePagination, { page: 0, size: 6 })
        _handleFilterChange({ city: null, venue: null, time: null, startDate: null })
    }, [movie])

    const cityLabel = (
        <Label
            leftIcon={ <FontAwesomeIcon className="mr-8" icon={ fas.faLocationPin } /> }
            rightIcon={ <FontAwesomeIcon icon={ fas.faChevronDown } /> }
        >
            { getCityName(filterParams.city) || "Choose city" }
        </Label>
    )

    const venueLabel = (
        <Label
            leftIcon={ <FontAwesomeIcon className="mr-8" icon={ fas.faBuilding } /> }
            rightIcon={ <FontAwesomeIcon icon={ fas.faChevronDown } /> }
        >
            { getVenueName(filterParams.venue) || "Choose venue" }
        </Label>
    )

    return (
        <div>
            <div className="p-24 grid grid-cols-2 gap-16">
                <LabeledDropdown
                    value={ getCityName(filterParams.city) }
                    label={ cityLabel }
                >
                    <DropdownItem
                        onClick={ () => { _handleFilterChange({ city: null, venue: null, time: null }); getVenues(null) } }
                        className={ `${filterParams.city === null ? "font-semibold" : "font-normal"}` }
                    >
                        All cities
                    </DropdownItem>
                    { cityList.map((city, index) => {
                        return (
                            <DropdownItem
                                key={ index }
                                onClick={ () => { _handleFilterChange({ city: city.id, venue: null, time: null }); getVenues(city.id) } }
                                className={ `flex hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer ${city.id === parseInt(filterParams.city) ? "font-semibold" : "font-normal"}` }
                            >
                                { city.name }
                            </DropdownItem>
                        )
                    }) }
                </LabeledDropdown>
                <LabeledDropdown
                    value={ getVenueName(filterParams.venue) }
                    label={ venueLabel }
                >
                    <DropdownItem
                        onClick={ () => _handleFilterChange({ venue: null, time: null }) }
                        className={ `${filterParams.venue === null ? "font-semibold" : "font-normal"}` }
                    >
                        All venues
                    </DropdownItem>
                    { venueList.map((venue, index) => {
                        return (
                            <DropdownItem
                                key={ index }
                                onClick={ () => _handleFilterChange({ venue: venue.venueId, time: null }) }
                                className={ `${venue.venueId === parseInt(filterParams.venue) ? "font-semibold" : "font-normal"}` }
                            >
                                { venue.name }
                            </DropdownItem>
                        )
                    }) }
                </LabeledDropdown>
            </div>
            <div>
                <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-16 px-24">
                    { currentDates.map((date, index) => {
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        return (
                            <DateCard
                                value={ filterParams.startDate }
                                key={ datePagination.page + index }
                                date={ date }
                                className={ `${formattedDate === filterParams.startDate ? "!bg-primary-600 !text-neutral-0" : "bg-neutral-0 text-neutral-800"} cursor-pointer` }
                                onClick={ () => { formattedDate === filterParams.startDate ? _handleFilterChange({ startDate: null, time: null }) : _handleFilterChange({ startDate: formattedDate, time: null }) } }
                            />
                        )
                    }) }
                </div>
                <div className="flex justify-end mt-16 pr-24">
                    <Pagination
                        displayCount={ false }
                        postsPerPage={ datePagination.size }
                        totalPosts={ dates.length }
                        paginateBack={ handlePrevPage }
                        paginateFront={ handleNextPage }
                        currentPage={ datePagination.page + 1 }
                        maxPages={ Math.ceil(dates.length / 6) + 1 }
                    />
                </div>
            </div>
            <p className="text-heading-h6 text-primary-600 pt-32 pb-12 px-24">Showtimes</p>
            { filterParams.city === null || filterParams.venue === null ?
                <p className="text-neutral-600 text-body-l px-24">Please select city and venue.</p> :
                <div className="flex gap-12 px-24">
                    { projectionList.length !== 0 ? projectionList?.map((projection, index) => {
                        const projectionTime = projection.time.split(":");
                        const isValidTime = isValidProjectionTime(projection.time, filterParams.startDate);

                        return (
                            <div
                                key={ index }
                                onClick={ () => {
                                    if (isValidTime) {
                                        projection.time === filterParams.time ? _handleFilterChange({ time: null }) : _handleFilterChange({ time: projection.time });
                                    }
                                } }
                                className={ `p-[10px] text-heading-h6 border rounded-8 shadow-light-50 ${filterParams.time === projection.time && isValidTime ? "bg-primary-600 text-neutral-25 border-primary-600 cursor-pointer" :
                                    !isValidTime ? "bg-neutral-300 text-neutral-25 border-neutral-300 cursor-not-allowed" :
                                        "bg-neutral-0 border-neutral-200 text-neutral-800 cursor-pointer"
                                    } ` }
                            >
                                { projectionTime[0] + ":" + projectionTime[1] }
                            </div>
                        )
                    }) : <p className="text-neutral-600 text-body-l">No projections for selected venue!</p> }
                </div>
            }
            <div className="absolute bottom-0 border-t border-neutral-200 grid grid-cols-2 py-24 gap-16 px-[20px] w-full">
                <Button variant="secondary" className="w-full" disabled={ !allFieldsNotNull } onClick={ handleReservation }>
                    Reserve Ticket
                </Button>
                <Button className="w-full" disabled={ !allFieldsNotNull } onClick={ handlePayment }>
                    Buy Ticket
                </Button>
            </div>
        </div>
    )
}

export default MovieProjections;

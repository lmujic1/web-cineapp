import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons"
import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { format } from "date-fns";

import { LabeledDropdown, DropdownItem } from "../../components/Dropdown";
import CurrentlyShowingCard from "../../components/card/CurrentlyShowingCard";
import { Input } from "../../components/Input";
import DateCard from "../../components/card/DateCard";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Label from "../../components/Label";

import { movies, venues, genres, cities, searchCurrently } from "../../utils/api";
import { getFilterParams, getPaginationParams, handleFilterChange, handlePageChange } from "../../utils/utils";

const CurrentlyShowing = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [cityList, setCityList] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [times, setTimes] = useState([]);
    const [venueList, setVenueList] = useState([]);
    const [movieList, setMovieList] = useState([]);
    const [dates, setDates] = useState([])
    const [totalPages, setTotalPages] = useState(1);

    const [pagination, setPagination] = useState({ page: 1, size: 4 });

    const [filterParams, setFilterParams] = useState({ city: null, genre: null, venue: null, time: null, startDate: null })

    const [focused, setFocused] = useState(false)
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)

    function handleSearchChange(event) {
        if (event.target.value.length >= 3) {
            handleFilterChange(searchParams, setSearchParams, 'contains', event.target.value);
        }
        else {
            handleFilterChange(searchParams, setSearchParams, 'contains', null);
        }
    }

    function _handleFilterChange(field, value) {
        _handlePageChange()
        if (field === 'city') {
            handleFilterChange(searchParams, setSearchParams, 'venue', null);
            getVenues(value)
        }
        handleFilterChange(searchParams, setSearchParams, field, value);
    }

    function _handlePageChange(page) {
        handlePageChange(searchParams, setSearchParams, { page: page });
    }

    const getGenres = async () => {
        axios.get(`${genres}`)
            .then(response => {
                setGenreList(response.data)
            }).catch(error => {
                console.log(error)
                console.warning(error.response.data.message)
            })
    }

    const getCities = () => {
        axios.get(`${cities}`)
            .then(response => {
                setCityList(response.data)
            }).catch(error => {
                {
                    console.log(error)
                    console.warning(error.response.data.message)
                }
            })
    }

    const getTimes = async () => {
        try {
            const array = []
            for (let i = 10; i <= 23; i += 1) {
                array.push(i + ":" + "00", i + ":" + "30")
            }
            setTimes(array)
        } catch (error) {
            console.log(error)
            console.warning(error.response.data.message)
        }
    }

    const getDates = () => {
        let date = new Date();
        let array = [];
        for (let i = 0; i < 10; i++) {
            array.push(date)
            date = new Date(new Date(date).setDate(date.getDate() + 1));
        }
        setDates(array)
    }

    const getVenues = async (city) => {
        const fullUrl = city ? `${venues}/city/${city}` : `${venues}/all`
        axios.get(fullUrl)
            .then(response => setVenueList(response.data))
            .catch(error => {
                console.log(error)
                console.warning(error.response.data.message)
            })
    }

    const loadMovies = async () => {
        let route =  movies + searchCurrently;
        const search = searchParams.size > 0 ? decodeURIComponent(`?${searchParams}`) : ''
        const pagination = getPaginationParams(searchParams)
        setPagination(pagination)
        if (pagination.page === null) return
        axios.get(`${route}${search}`)
            .then(response => {
                if (parseInt(pagination.page) > 1)
                    setMovieList(pre => [...pre, ...response.data.content])
                else {
                    setTotalPages(response.data.totalPages)
                    setMovieList(response.data.content)
                }
            })
            .catch(error => {
                console.log(error)
                console.warning(error.response.data.message)
            })
    }


    useEffect(() => {
        const filterParams = getFilterParams(searchParams)
        setFilterParams(filterParams)
        if (filterParams.startDate === null) _handleFilterChange('startDate', format(new Date(), 'yyyy-MM-dd'))
        loadMovies();
    }, [searchParams])

    useEffect(() => {
        _handlePageChange()

        const pagination = getPaginationParams(searchParams)
        setPagination(pagination)

        getCities()
        getVenues()
        getGenres()
        getDates()
        getTimes()
    }, [])

    function getCityName(id) {
        return cityList?.find(c => c.id.toString() === id)?.name
    }

    function getVenueName(id) {
        return venueList?.find(c => c.venueId.toString() === id)?.name
    }

    function getGenreName(id) {
        return genreList?.find(c => c.id.toString() === id)?.name
    }

    const cityLabel = (
        <Label
            leftIcon={ <FontAwesomeIcon className="w-5 h-5 mr-8" icon={ fas.faLocationPin } /> }
            rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
        >
            { getCityName(filterParams.city) || "All cities" }
        </Label>
    )

    const venueLabel = (
        <Label
            leftIcon={ <FontAwesomeIcon className="w-5 h-5 mr-8" icon={ fas.faLocationPin } /> }
            rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
        >
            { getVenueName(filterParams.venue) || "All venues" }
        </Label>
    )

    const genreLabel = (
        <Label
            leftIcon={ <FontAwesomeIcon className="w-5 h-5 mr-8" icon={ fas.faFilm } /> }
            rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
        >
            { getGenreName(filterParams.genre) || "All genres" }
        </Label>
    )

    const timeLabel = (
        <Label
            leftIcon={ <FontAwesomeIcon className="w-5 h-5 mr-8" icon={ fas.faClock } /> }
            rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
        >
            { filterParams.time?.slice(0, 5) || "All projection times" }
        </Label>
    )

    return (
        <div className="font-body px-[118px] pt-32">
            <p className="text-neutral-800 text-heading-h4 pb-24">Currently Showing ({ movieList?.length })</p>
            <Label
                value={ filterParams.contains }
                active={ focused }
                leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faMagnifyingGlass } /> }
            >
                <Input
                    text="Search Movies"
                    onChange={ handleSearchChange }
                    onFocus={ onFocus }
                    onBlur={ onBlur }
                />
            </Label>

            <div className="grid lg:grid-cols-4 md:grid-cols-2 py-[18px] gap-8">
                <LabeledDropdown
                    value={ getCityName(filterParams.city) }
                    label={ cityLabel }
                >
                    <DropdownItem
                        onClick={ () => _handleFilterChange('city', null) }
                        className={ `${filterParams.city === null ? "font-semibold" : "font-normal"}` }
                    >
                        All cities
                    </DropdownItem>
                    { cityList.map((city, index) => {
                        return (
                            <DropdownItem
                                key={ index }
                                onClick={ () => { _handleFilterChange('city', city.id); _handlePageChange() } }
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
                        onClick={ () => _handleFilterChange('venue', null) }
                        className={ `${filterParams.venue === null ? "font-semibold" : "font-normal"}` }
                    >
                        All venues
                    </DropdownItem>
                    { venueList.map((venue, index) => {
                        return (
                            <DropdownItem
                                key={ index }
                                onClick={ () => _handleFilterChange('venue', venue.venueId) }
                                className={ `${venue.venueId === parseInt(filterParams.venue) ? "font-semibold" : "font-normal"}` }
                            >
                                { venue.name }
                            </DropdownItem>
                        )
                    }) }
                </LabeledDropdown>
                <LabeledDropdown
                    value={ getGenreName(filterParams.genre) }
                    label={ genreLabel }
                >
                    <DropdownItem
                        onClick={ () => _handleFilterChange('genre', null) }
                        className={ `${filterParams.genre === null ? "font-semibold" : "font-normal"}` }
                    >
                        All genres
                    </DropdownItem>
                    { genreList.map((genre, index) => {
                        return (
                            <DropdownItem
                                key={ index }
                                onClick={ () => _handleFilterChange('genre', genre.id) }
                                className={ `${genre.id === parseInt(filterParams.genre) ? "font-semibold" : "font-normal"}` }
                            >
                                { genre.name }
                            </DropdownItem>
                        )
                    }) }
                </LabeledDropdown>
                <LabeledDropdown
                    value={ filterParams.time }
                    label={ timeLabel }
                >
                    <DropdownItem
                        onClick={ () => _handleFilterChange('time', null) }
                        className={ `${filterParams.time === null ? "font-semibold" : "font-normal"}` }
                    >
                        All projection times
                    </DropdownItem>
                    { times.map((time, index) => {
                        return (
                            <DropdownItem
                                key={ index }
                                onClick={ () => _handleFilterChange('time', decodeURIComponent(time + ":00")) }
                                className={ `${time === filterParams.time ? "font-semibold" : "font-normal"}` }
                            >
                                { time }
                            </DropdownItem>
                        )
                    }) }
                </LabeledDropdown>
            </div >
            <div className="grid lg:grid-cols-10 md:grid-cols-5 sm:grid-cols-3 gap-16 pb-[20px]">
                {
                    dates.map((date, index) => {
                        const formattedDate = format(date, 'yyyy-MM-dd')
                        return (
                            <DateCard
                                value={ filterParams.startDate }
                                key={ index }
                                date={ date }
                                className={ `${formattedDate === filterParams.startDate ? "bg-primary-600 !text-neutral-0" : "bg-neutral-0 !text-neutral-800"} cursor-pointer` }
                                onClick={ () => _handleFilterChange('startDate', formattedDate) }
                            />
                        )
                    })
                }
            </div>
            <p className="text-body-m font-normal italic text-neutral-500">Quick reminder that our cinema schedule is on a ten-day update cycle.</p>

            <div className="gap-24">
                { movieList.length != 0 ? movieList.map((item, index) => {
                    return (
                        <CurrentlyShowingCard
                            key={ index }
                            movie={ item }
                            projections={ item.projections }
                            genres={ item.genres }
                            endDate={ item.projectionEnd }
                            images={ item.images }
                            className="my-[20px]"
                        />
                    )
                }) :
                    <Card className="flex justify-center items-center shadow-light-50 mt-12 mb-32">
                        <div className="text-neutral-600 w-[55%] flex flex-col justify-center items-center py-64 text-body-l">
                            <FontAwesomeIcon className="w-64 h-64" icon={ fas.faFilm } />
                            <p className="font-semibold text-neutral-800 pt-32 pb-12">No movies to preview for current date</p>
                            <div className="font-normal text-center pb-24">We are working on updating our schedule for upcoming movies.
                                Stay tuned for amazing movie experience or explore our other exciting cinema features in the meantime!</div>
                            <Button variant="tertiary" onClick={ () => { navigate('/upcoming') } }>Explore Upcoming Movies</Button>
                        </div>
                    </Card> }
            </div>
            <div className="flex items-center justify-center pt-16 pb-32">
                { pagination.page < totalPages &&
                    <Button variant="tertiary" onClick={ () => _handlePageChange(parseInt(pagination.page) + 1) }>Load More</Button>
                }
            </div>
        </div >
    )
}

export default CurrentlyShowing;

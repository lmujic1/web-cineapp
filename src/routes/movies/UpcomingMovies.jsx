import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons"
import axios from "axios";
import { format, addDays } from "date-fns";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { LabeledDropdown, DropdownItem } from "../../components/Dropdown";
import Label from "../../components/Label";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import Card from "../../components/Card";
import MovieCard from "../../components/card/MovieCard";
import DateRangePicker from "../../components/DateRangePicker";

import { url, movies, venues, genres, cities, searchUpcoming } from "../../utils/api";
import { getFilterParams, getPaginationParams, handleFilterChange, handlePageChange } from "../../utils/utils";

const UpcomingmovieList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [cityList, setCityList] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [venueList, setVenueList] = useState([]);
    const [movieList, setMovieList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const [pagination, setPagination] = useState({ page: 1, size: 4 });

    const [filterParams, setFilterParams] = useState({ city: null, genre: null, venue: null, time: null, startDate: null, endDate: null })

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
            getVenueList(value)
        }
        handleFilterChange(searchParams, setSearchParams, field, value);
    }

    function _handlePageChange(page) {
        handlePageChange(searchParams, setSearchParams, { page: page });
    }

    const getGenreList = async () => {
        axios.get(`${url}${genres}`)
            .then(response => {
                setGenreList(response.data)
            }).catch(error => {
                console.log(error)
            })
    }

    const getCityList = () => {
        axios.get(`${url}${cities}`)
            .then(response => {
                setCityList(response.data)
            }).catch(error => {
                {
                    console.log(error)
                }
            })
    }

    const getVenueList = async (city) => {
        const fullUrl = city ? `${url}${venues}/city/${city}` : `${url}${venues}/all`
        axios.get(fullUrl)
            .then(response => setVenueList(response.data))
            .catch(error => {
                console.log(error)
            })
    }

    const loadMovieList = async () => {
        let route = url + movies + searchUpcoming;
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
            })
    }


    useEffect(() => {
        const filterParams = getFilterParams(searchParams)
        setFilterParams(filterParams)
        loadMovieList();
    }, [searchParams])

    useEffect(() => {
        _handlePageChange()

        const pagination = getPaginationParams(searchParams)
        setPagination(pagination)

        getCityList()
        getVenueList()
        getGenreList()
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

    const cityListLabel = (
        <Label
            leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faLocationPin } /> }
            rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
        >
            { getCityName(filterParams.city) || "All cities" }
        </Label>
    )

    const venueListLabel = (
        <Label
            leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faLocationPin } /> }
            rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
        >
            { getVenueName(filterParams.venue) || "All venues" }
        </Label>
    )

    const genreLabel = (
        <Label
            leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faFilm } /> }
            rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
        >
            { getGenreName(filterParams.genre) || "All genres" }
        </Label>
    )

    const dateRangeLabel = (
        <Label
            leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faCalendarDays } /> }
            rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
        >
            { filterParams.startDate ? `${format(filterParams.startDate, 'yyyy/MM/dd')} - ${format(filterParams.endDate, 'yyyy/MM/dd')}` : "Date Range" }
        </Label>
    )

    return (
        <div className="font-body px-[118px] pt-32">
            <p className="text-neutral-800 text-heading-h4 pb-32">Upcoming Movies ({ movieList.length })</p>
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

            <div className="grid grid-cols-4 pt-16 pb-32 gap-8">
                <LabeledDropdown
                    label={ cityListLabel }
                    value={ getCityName(filterParams.city) } >
                    <DropdownItem
                        onClick={ () => _handleFilterChange('city', null) }
                        className={ `${filterParams.city === null ? "font-semibold" : "font-normal"}` }
                    >
                        All Cities
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
                    label={ venueListLabel }
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
                <DateRangePicker
                    label={ dateRangeLabel }
                    minDate={ addDays(new Date(), 10) }
                    onClickApply={
                        (valueStart, valueEnd) => {
                            _handleFilterChange('startDate', format(valueStart, 'yyyy-MM-dd'))
                            _handleFilterChange('endDate', format(valueEnd, 'yyyy-MM-dd'))
                        } }
                    onClickCancel={
                        () => {
                            _handleFilterChange('startDate', null)
                            _handleFilterChange('endDate', null)
                        } }
                />
            </div>
            { movieList.length != 0 ?
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                    { movieList.map((item, index) => {
                        return <MovieCard key={ index } movie={ item } upcoming endDate={ item.projectionEnd } images={ item.images } />
                    }) }
                </div> :
                <Card className="flex justify-center items-center shadow-light-50 mt-12 mb-32">
                    <div className="text-neutral-600 w-[55%] flex flex-col justify-center items-center py-64 text-body-l">
                        <FontAwesomeIcon className="w-64 h-64" icon={ fas.faFilm } />
                        <p className="font-semibold text-neutral-800 pt-32 pb-12">No movies to preview for current date</p>
                        <div className="font-normal text-center pb-24">We are working on updating our schedule for upcoming movies.
                            Stay tuned for amazing movie experience or explore our other exciting cinema features in the meantime!</div>
                        <Button variant="tertiary" onClick={ () => { navigate('/upcoming') } }>Explore Upcoming Movies</Button>
                    </div>
                </Card>
            }
            <div className="flex items-center justify-center pt-16 pb-32">
                { pagination.page < totalPages &&
                    <Button variant="tertiary" onClick={ () => { _handlePageChange(parseInt(pagination.page) + 1) } }>Load More</Button>
                }
            </div>
        </div>
    )
}

export default UpcomingmovieList;

import axios from "axios";
import { add, format } from "date-fns";
import { useEffect, useState, useContext } from "react";
import { useParams } from 'react-router-dom';

import Badge from "../../components/Badge";
import { List, ListItem } from "../../components/List";
import MovieCard from "../../components/card/MovieCard";
import Image from "../../components/Image";
import VideoPlayer from "../../components/VideoPlayer";

import { url, movies, cities, venues, projections } from "../../utils/api";
import Coming from "../../components/Coming";
import MovieProjections from "../../components/MovieProjections";

import { ToggleSidebarContext } from "../../components/Layout";

const MovieDetails = () => {

    const toggleSidebar = useContext(ToggleSidebarContext);

    const { id } = useParams();
    const [movie, setMovie] = useState()
    const [cityList, setCityList] = useState([])
    const [venueList, setVenueList] = useState([])
    const [projectionList, setProjectionList] = useState([])
    const [seeAlsoMovies, setSeeAlsoMovies] = useState([])

    const [moviePagination, setMoviePagination] = useState({ page: 1, size: 6, maxPages: 1, totalElements: 0 })
    const [filterParams, setFilterParams] = useState({ city: null, venue: null, time: null, startDate: null })

    const [upcoming, setUpcoming] = useState(false)

    const paginateFront = () => {
        _handlePaginationChange(setMoviePagination, { page: moviePagination.page + 1 });
    }

    const paginateBack = () => {
        _handlePaginationChange(setMoviePagination, { page: moviePagination.page - 1 });
    }

    const getCities = () => {
        axios.get(`${url}${cities}`)
            .then(response => {
                setCityList(response.data)
            }).catch(error => {
                {
                    console.log(error)
                    console.warning(error.response.data.message)
                }
            })
    }

    const getVenues = async (city) => {
        const fullUrl = city ? `${url}${venues}/city/${city}` : `${url}${venues}/all`
        axios.get(fullUrl)
            .then(response => setVenueList(response.data))
            .catch(error => {
                console.log(error)
                console.warning(error.response.data.message)
            })
    }

    const getMovie = async () => {
        axios.get(`${url}${movies}/${id}`)
            .then(response => {
                setMovie(response.data)
                setUpcoming(new Date(format(response.data.projectionStart, "yyyy-MM-dd")) >= add(new Date(), 10))
            })
            .catch(error => {
                console.log(error)
                console.warning(error.response.data.message)
            })
    }

    const getSeeAlsoMovies = async () => {
        const fullUrl = `${url}${movies}/similar?movie=${movie.movieId}&page=${moviePagination.page}&size=${moviePagination.size}`
        axios.get(fullUrl)
            .then(response => {
                setSeeAlsoMovies(response.data.content)
                _handlePaginationChange(setMoviePagination, { maxPages: response.data.totalPages + 1, totalElements: response.data.totalElements });
            })
            .catch(error => {
                console.log(error)
                console.warning(error.response.data.message)
            })
    }

    const getProjections = async (venueId) => {
        axios.get(`${url}${projections}?movie=${movie.movieId}&venue=${venueId}&date=${filterParams.startDate}`)
            .then(response =>{
                setProjectionList(response.data)
    })
            .catch(error => {
                console.log(error)
                console.warning(error.response.data.message)
            })
    }

    function _handlePaginationChange(setPagination, fieldsAndValues) {
        setPagination(prevPagination => ({
            ...prevPagination,
            ...fieldsAndValues
        }));
    }

    function getProjectionTimes() {
        if (filterParams.city && filterParams.venue) getProjections(filterParams.venue)
        if (filterParams.city === null || filterParams.venue === null) setProjectionList([])
    }

    function getGenres() {
        return movie.genres?.map((genre) => genre.name).sort()
    }

    useEffect(() => {
        getMovie()
        getCities()
        getVenues()
        _handlePaginationChange(setMoviePagination, { page: 1, size: 6 })
    }, [id])

    useEffect(() => {
        if (movie) getSeeAlsoMovies();
    }, [moviePagination.page, movie])

    useEffect(() => {
        getProjectionTimes();

    }, [filterParams])

    if (!movie) {
        return (
            <div className="text-heading-h6 text-neutral-600 pl-[118px] pt-80">Loading...</div>
        )
    }

    return (
        <div className="px-[118px] pb-40 pt-32 font-body text-neutral-800 text-body-l">
            <p className="text-heading-h5 pb-16">Movie Details</p>
            <div className="grid lg:grid-cols-2 gap-16 min-h-[356px]">
                <VideoPlayer className="aspect-video rounded-l-16" src={ movie.trailer } />
                <div className="grid grid-cols-2 gap-16">
                    { movie.images?.map((image, index) => {
                        return (
                            <Image key={ index } src={ image.link } className={ `object-cover h-[170px] ${index === 1 ? "rounded-tr-16" : ""} ${index === 3 ? "rounded-br-16" : ""}` } />
                        )
                    }) }
                </div>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 pt-32 gap-16">
                <div className="pr-16">
                    <p className="text-heading-h5">{ movie.name }</p>
                    <div className="flex text-body-l font-normal pt-24 pb-8">
                        <p className="border-primary-600 h-[20px] pr-12 border-r">{ movie.rating }</p>
                        <p className="border-primary-600 h-[20px] px-12 border-r">{ movie.language }</p>
                        <p className="border-primary-600 h-[20px] px-12 border-r">{ movie.duration } Min</p>
                        <p className="pl-12">Projection date: { format(movie.projectionStart, "yyyy/MM/dd") } - { format(movie.projectionEnd, "yyyy/MM/dd") }</p>
                    </div>
                    <div className="flex gap-16 pt-4 pb-16">
                        { getGenres()?.map((genre, index) => {
                            return <Badge key={ index }>{ genre }</Badge>
                        }) }
                    </div>
                    <p className="pt-8 pb-24">{ movie.synopsis }</p>
                    <p className="pb-24"> <span className="text-neutral-500">Director:</span> { movie.director } </p>
                    <span className="text-neutral-500">Writers: </span>
                    { movie.professionals.filter(p => p.profession === "WRITER")?.map((writer, index) => {
                        return (
                            <span key={ index }>{ writer.firstName } { writer.lastName }{ index + 1 < movie.professionals.filter(p => p.profession === "WRITER")?.length ? "," : "" } </span>
                        )
                    }) }

                    <div className="pt-32">
                        <p className="text-neutral-500 text-heading-h6 border-primary-600 h-[20px] pl-8 border-l-2">Cast</p>
                        <div className="grid grid-cols-3 text-body-m pt-[20px] gap-32">
                            { movie.professionals.filter(p => p.profession === "ACTOR")?.map((movieActor, index) => {
                                return (
                                    <div key={ index } className="font-semibold text-neutral-900">{ movieActor.firstName } { movieActor.lastName }
                                    </div>
                                )
                            }) }
                        </div>
                    </div>
                </div>
                <div className="rounded-16 border border-neutral-200 shadow-light-400 h-full relative lg:min-h-[560px] sm:min-h-[650px]">
                    { !upcoming ?
                        <MovieProjections
                            toggleSidebar={ toggleSidebar }
                            movie={ movie }
                            cityList={ cityList }
                            venueList={ venueList }
                            getVenues={ getVenues }
                            projectionList={ projectionList }
                            filterParams={ filterParams }
                            setFilterParams={ setFilterParams }
                        /> :
                        <Coming movie={ movie } />
                    }
                </div>
            </div>
            <div className="pt-64 pb-16">
                <p className="text-heading-h5">See also</p>
                <List
                    postsPerPage={ moviePagination.size }
                    totalPosts={ moviePagination.totalElements }
                    paginateBack={ paginateBack }
                    paginateFront={ paginateFront }
                    currentPage={ moviePagination.page }
                    maxPages={ moviePagination.maxPages }
                >
                    <div className="grid gap-16 py-32 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2">
                        { seeAlsoMovies?.map((item, index) => {
                            return (
                                <ListItem key={ index }>
                                    <MovieCard
                                        key={ index }
                                        movie={ item }
                                        images={ item.images }
                                        seeAlso
                                        className="w-[200px] !h-[210px]"
                                    />
                                </ListItem>
                            )
                        }) }
                    </div>
                </List>
            </div>
        </div>
    )
}

export default MovieDetails;

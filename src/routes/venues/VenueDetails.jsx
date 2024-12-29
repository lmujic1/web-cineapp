import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { venues, movies, searchCurrently } from '../../utils/api';
import Image from '../../components/Image';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationPin, faPhone, faFilm } from '@fortawesome/free-solid-svg-icons';
import MovieCard from '../../components/card/MovieCard';

const VenueDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [venue, setVenue] = useState(null);
    const [movieList, setMovieList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pagination, setPagination] = useState({ page: 1, size: 4 });

    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                const venueResponse = await axios.get(`${venues}/${id}`);
                setVenue(venueResponse.data);
            } catch (error) {
                console.error('Error fetching venue details:', error);
            }
        };

        fetchVenueDetails();
    }, [id]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const route = `${movies}${searchCurrently}`;
                const search = `?venue=${id}&page=${pagination.page}&size=${pagination.size}`;
                const response = await axios.get(`${route}${search}`);
                const data = response.data;
                if (pagination.page > 1) {
                    setMovieList(prev => [...prev, ...data.content]);
                } else {
                    setTotalPages(data.totalPages);
                    setTotalElements(data.totalElements);
                    setMovieList(data.content);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [pagination, id]);

    if (!venue) {
        return <div className="text-heading-h6 text-neutral-600 pl-[118px] pt-80">Loading...</div>;
    }

    const handleLoadMore = () => {
        setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    };

    return (
        <div className="px-[118px] pb-40 pt-32 font-body text-neutral-800 text-body-l">
            <p className="text-heading-h4 pb-16">Venue Details</p>
            <div className="h-[367px] border border-neutral-200 bg-neutral-25 rounded-24 grid grid-cols-2 gap-64">
                <div className="px-16 py-16">
                    <Image className="h-[334px] object-cover rounded-16" src={ venue.image } alt="Venue" />
                </div>
                <div className="flex flex-col text-body-l gap-12 pt-64">
                    <p className="text-heading-h6">{ venue.name }</p>
                    <p><FontAwesomeIcon className="text-primary-600 mr-16" icon={ faLocationPin } />{ venue.street } { venue.streetNumber }</p>
                    <p><FontAwesomeIcon className="text-primary-600 mr-16" icon={ faPhone } />{ venue.telephone }</p>
                </div>
            </div>
            <div className="pt-40">
                <p className="text-heading-h4 pb-24">Movies playing in { venue.name } ({ totalElements })</p>
                <div className="grid grid-cols-4 gap-16">
                    { movieList.length ? (
                        movieList.map((item, index) => (
                            <MovieCard key={ index } movie={ item } images={ item.images } className="mb-8" />
                        ))
                    ) : (
                        <Card className="col-span-4 flex justify-center items-center shadow-light-50 mt-12 mb-32">
                            <div className="text-neutral-600 w-[55%] flex flex-col justify-center items-center py-64 text-body-l">
                                <FontAwesomeIcon className="w-64 h-64" icon={ faFilm } />
                                <p className="font-semibold text-neutral-800 pt-32 pb-12">No movies to preview</p>
                                <div className="font-normal text-center pb-24">We are working on updating our schedule for upcoming movies.
                                    Stay tuned for an amazing movie experience or explore our other exciting cinema features in the meantime!</div>
                                <Button variant="tertiary" onClick={ () => navigate('/venues') }>Explore Cinemas</Button>
                            </div>
                        </Card>
                    ) }
                </div>
                <div className="flex items-center justify-center pt-16 pb-24">
                    { pagination.page < totalPages && (
                        <Button variant="tertiary" onClick={ handleLoadMore }>Load More</Button>
                    ) }
                </div>
            </div>
        </div>
    );
};

export default VenueDetails;

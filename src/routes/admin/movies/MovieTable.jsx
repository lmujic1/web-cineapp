import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, differenceInDays } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import Image from '../../../components/Image';
import Badge from '../../../components/Badge';
import { Checkbox } from '../../../components/Input';
import Modal from '../../../components/Modal';
import Tooltip from '../../../components/Tooltip';
import Pagination from '../../../components/Pagination';
import { Dropdown, DropdownItem } from '../../../components/Dropdown';
import Button from '../../../components/Button';
import { NoDataRow, Table, TableCell, TableHeaderCell, TableHeaderRow, TableRow } from '../../../components/Table';

import { NumberOfElementsContext } from "../AdminPanel";

import { movies, searchStatus, venues, currently, projections } from "../../../utils/api";

const MovieTable = ({ type, selectable = false, actions = false }) => {
    const navigate = useNavigate();
    const [movieList, setMovieList] = useState([]);
    const [venueList, setVenueList] = useState([]);
    const [showActions, setShowActions] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: 5 });
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [showMenuIndex, setShowMenuIndex] = useState(null);
    const [maxPages, setMaxPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [modal, setModal] = useState(false);
    const { setNumberOfElementsChanged } = useContext(NumberOfElementsContext);

    const paginateFront = () => {
        setPagination({ ...pagination, page: pagination.page + 1 });
    }

    const paginateBack = () => {
        setPagination({ ...pagination, page: pagination.page - 1 });
    }

    const handleItemsPerPage = (value) => {
        setPagination({ ...pagination, size: value });
    }

    const handleMovieClick = (movie) => {
        setSelectedMovies((prevSelectedMovies) =>
            prevSelectedMovies.includes(movie)
                ? prevSelectedMovies.filter(m => m.movieId !== movie.movieId)
                : [...prevSelectedMovies, movie]
        );
    }

    const handleEdit = (movie) => {
        setShowMenuIndex(null);
        navigate('/admin-panel/add-movie', { state: { movie: movie } });
    };

    const updateMoviesStatus = async (movieIds, status) => {
        try {
            const token = localStorage.getItem('token');

            await axios.put(`${movies}/update-status`, { movieIds, status }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSelectedMovies([])
            setPagination({ ...pagination, page: 1 });
            fetchData()
        } catch (error) {
            console.error('Error updating movies status:', error);
        }
    };

    const handlePublish = async (movie = null) => {
        setShowMenuIndex(null);
        if (movie !== null) {
            if (movie.step !== "THREE") {
                setModal(true);
                return;
            }
            await updateMoviesStatus([movie.movieId], 'PUBLISHED');
        } else {
            const allStepThree = selectedMovies.every(movie => movie.step === "THREE");
            if (allStepThree) {
                const movieIds = selectedMovies.map(movie => movie.movieId);
                await updateMoviesStatus(movieIds, 'PUBLISHED');
            } else {
                setModal(true);
            }
        }
    };

    const handleArchive = async (movie = null) => {
        if (movie !== null) {
            await updateMoviesStatus([movie.movieId], 'ARCHIVED');
        } else {
            const movieIds = selectedMovies.map(movie => movie.movieId);
            await updateMoviesStatus(movieIds, 'ARCHIVED');
        }
        setShowMenuIndex(null);
    };

    const handleMoveToDrafts = async (movie = null) => {
        if (movie !== null) {
            await updateMoviesStatus([movie.movieId], 'DRAFT');
        } else {
            const movieIds = selectedMovies.map(movie => movie.movieId);
            await updateMoviesStatus(movieIds, 'DRAFT');
        }
        setShowMenuIndex(null);
    };

    const fetchData = async () => {
        let route = `${movies}`
        if (type === "drafts") route += `${searchStatus}?status=DRAFT`
        else if (type === "currently") route += `${currently}?`
        else if (type === "upcoming") route += `/all-upcoming?`
        else if (type === "archived") route += `${searchStatus}?status=ARCHIVED`
        route += `&page=${pagination.page}&size=${pagination.size}`

        const result = await axios.get(route);
        axios.get(`${route}`)
            .then(async response => {
                const moviesData = response.data.content;
                for (const movie of moviesData) {
                    try {
                        const projectionsResponse = await axios.get(`${projections}/movie/${movie.movieId}`);
                        movie.projections = projectionsResponse.data;
                    } catch (error) {
                        console.log(error);
                        movie.projections = [];
                    }
                }
                setMovieList(moviesData);

                setTotalPosts(result.data.totalElements);
                setMaxPages(result.data.totalPages + 1);
                setNumberOfElementsChanged(result.data.content[0])
            })
    };

    const getVenueNames = (projections) => {
        if (venueList.length === 0) {
            return "Loading...";
        }

        const venueNames = [];
        projections?.forEach(projection => {
            if (!venueNames.includes(projection.venue.name)) {
                venueNames.push(projection.venue.name);
            }
        });

        const allVenueIds = venueList?.map(venue => venue.venueId);
        const projectionVenueIds = projections?.map(projection => projection.venue.venueId);
        const hasAllVenues = allVenueIds.every(id => projectionVenueIds?.includes(id));

        if (hasAllVenues) {
            return "All Venues";
        }

        const moreCount = venueNames.length > 3 ? venueNames.length - 3 : 0;
        return venueNames.slice(0, 3).join(', ') + (moreCount > 0 ? ` + ${moreCount}` : '');
    };

    const getGenreList = async () => {
        try {
            const response = await axios.get(`${venues}/all`);
            setVenueList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getDaysRemaining = (date) => {
        const today = new Date();
        return differenceInDays(new Date(date), today);
    };

    const getBadgeDetails = (movie) => {
        let badgeState, badgeText;

        if (type === "currently") {
            const daysRemaining = getDaysRemaining(movie.projectionEnd);
            badgeState = daysRemaining <= 7 ? 'yellow' : 'green';
            badgeText = `Ending in ${daysRemaining} days`;
        } else if (type === "drafts") {
            if (movie.step === "ONE") {
                badgeState = 'yellow';
                badgeText = `Step 1/3`;
            } else if (movie.step === "TWO") {
                badgeState = 'yellow';
                badgeText = `Step 2/3`;
            } else if (movie.step === "THREE") {
                badgeState = 'green';
                badgeText = `Step 3/3`;
            }
        } else if (type === "upcoming") {
            const daysRemaining = getDaysRemaining(movie.projectionStart);
            badgeState = daysRemaining >= 7 ? 'green' : 'yellow';
            badgeText = `Coming in ${daysRemaining} days`;
        } else if (type === "archived") {
            badgeState = 'red';
            badgeText = "Ended";
        }

        return { badgeState, badgeText };
    };

    const getCover = (images) => {
        for (let element of images) {
            if (element.cover) {
                return element.link;
            }
        }
        return null;
    };

    useEffect(() => {
        fetchData()
    }, [pagination])

    useEffect(() => {
        getGenreList();
    }, []);

    return (
        <div>
            { selectedMovies.length > 0 && (
                <div className="flex justify-end gap-16 mb-16">
                    { type !== "archived" && <Button variant='secondary' size='md' className="!border-error-500 underline !text-error-500 bg-neutral-0 z-50" onClick={ () => handleArchive() }>Archive</Button> }
                    { type === "drafts" && <Button variant='secondary' size='md' className="border-success-600 text-success-600 bg-neutral-0 z-50" onClick={ () => handlePublish() }>Publish</Button> }
                    { type !== "drafts" && <Button variant='secondary' size='md' className="border-success-600 text-success-600 bg-neutral-0 z-50" onClick={ () => handleMoveToDrafts() }>Move to Drafts</Button> }
                </div>
            ) }
            <Table className="mb-16">
                <thead>
                    <TableHeaderRow>
                        <TableHeaderCell>name</TableHeaderCell>
                        <TableHeaderCell>projection date</TableHeaderCell>
                        <TableHeaderCell>venue</TableHeaderCell>
                        <TableHeaderCell>
                            <div className="flex gap-8 items-center">
                                status
                                { type === "drafts" && <Tooltip infoText="Status shows completion of multiple steps. In order to publish movie, all steps must be completed.">
                                    <FontAwesomeIcon onClick={ () => setShowTooltip(!showTooltip) } icon={ faInfoCircle } />
                                </Tooltip>
                                }
                            </div>
                        </TableHeaderCell>
                        { actions ? <TableHeaderCell>action</TableHeaderCell> : null }
                    </TableHeaderRow>
                </thead>
                <tbody>
                    { movieList.length > 0 ? (
                        movieList.map((movie, i) => {
                            const { badgeState, badgeText } = getBadgeDetails(movie);

                            return (
                                <TableRow key={ i } className={ `cursor-pointer${i + 1 === movieList.length ? " border-b-0" : ""}` } onClick={ () => { if (selectable) handleMovieClick(movie) } }>
                                    <TableCell className={ `w-[300px]${i + 1 === movieList.length ? " rounded-8" : ""}` }>
                                        <div className="flex items-center gap-8">
                                            { selectable ? <Checkbox isChecked={ selectedMovies.includes(movie) } /> : null }
                                            <Image
                                                width="40px"
                                                height="40px"
                                                className="rounded-12 w-40 h-40 object-cover mr-8"
                                                src={ getCover(movie.images) || '' }
                                                alt={ movie.name }
                                            />
                                            { movie.name }
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-[277px]">
                                        { format(new Date(movie.projectionStart), 'dd. MMM. yyyy') } - { format(new Date(movie.projectionEnd), 'dd. MMM. yyyy') }
                                    </TableCell>
                                    <TableCell className="w-[277px]">{ getVenueNames(movie.projections) }</TableCell>
                                    <TableCell>
                                        <Badge color={ badgeState } className="normal-case">
                                            { badgeText }
                                        </Badge>
                                    </TableCell>
                                    { actions ? <TableCell className="w-[84px]" onClick={ (e) => e.stopPropagation() }>
                                        <div style={ { position: 'relative' } }>
                                            <Button
                                                variant="tertiary"
                                                onClick={ () => { setShowActions(!showActions); setShowMenuIndex(i) } }
                                            >
                                                <FontAwesomeIcon icon={ faEllipsis } />
                                            </Button>
                                            { showActions && showMenuIndex === i && (
                                                <Dropdown className="w-[300px] right-0">
                                                    { type === "drafts" && <DropdownItem onClick={ () => handleEdit(movie) }>Edit</DropdownItem> }
                                                    { type === "drafts" && <DropdownItem onClick={ () => handlePublish(movie) }>Publish</DropdownItem> }
                                                    { type !== "drafts" && <DropdownItem onClick={ () => handleMoveToDrafts(movie) }>Move to Drafts</DropdownItem> }
                                                    { type !== "archived" && <DropdownItem onClick={ () => handleArchive(movie) }>Archive</DropdownItem> }
                                                </Dropdown>
                                            ) }
                                        </div>
                                    </TableCell> : null }
                                </TableRow>
                            );
                        })
                    ) : (
                        <NoDataRow />
                    ) }
                </tbody>
            </Table>
            <Pagination
                table
                postsPerPage={ pagination.size }
                totalPosts={ totalPosts }
                paginateBack={ paginateBack }
                paginateFront={ paginateFront }
                currentPage={ pagination.page }
                maxPages={ maxPages }
                itemsPerPage={ [5, 10, 15, 20] }
                handleItemsPerPage={ handleItemsPerPage }
            />

            { modal && (
                <Modal>
                    <p className="text-heading-h6 text-neutral-900 pb-16">Publish Failed!</p>
                    <p className="text-body-m text-neutral-500 text-justify">
                        Movies that are in progress cannot be published.
                    </p>
                    <div className="flex pt-32 gap-8 justify-end">
                        <Button size="sm" onClick={ () => setModal(false) }>Okay</Button>
                    </div>
                </Modal>
            ) }
        </div>
    );
};

export default MovieTable;

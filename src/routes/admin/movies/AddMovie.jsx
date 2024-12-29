import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

import Button from '../../../components/Button';
import Stepper from '../../../components/Stepper';
import StepperControl from '../../../components/StepperControl';
import General from '../../../components/steps/General';
import Details from '../../../components/steps/Details';
import Venues from './steps/Venues';
import Modal from '../../../components/Modal';
import { StepperContext } from '../../../components/Stepper';

import { genres, movies } from '../../../utils/api';

const AddMovie = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [movieData, setMovieData] = useState({});
    const [addModal, setAddModal] = useState(false);

    const from = location.state?.from || '/admin-panel/movies/drafts';
    const { movie } = location.state || {};

    const [currentStep, setCurrentStep] = useState(1);
    const [detailsData, setDetailsData] = useState({ writersFile: null, actorsFile: null });
    const [projectionsData, setProjectionsData] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [stepStatus, setStepStatus] = useState({
        1: false,
        2: false,
        3: false,
    });

    const steps = ["General", "Details", "Venues"];

    const isAddButtonDisabled = projectionsData ? projectionsData.some(projection => !projection.city || !projection.venue || !projection.time) : true;

    useEffect(() => {
        if (movie) {
            const genreIds = movie.genres.map(genre => genre.id);
            setMovieData({
                id: movie.movieId,
                name: movie.name,
                language: movie.language,
                director: movie.director,
                rating: movie.rating,
                duration: movie.duration,
                genres: genreIds,
                projectionStart: movie.projectionStart,
                projectionEnd: movie.projectionEnd,
                synopsis: movie.synopsis || '',
                trailer: movie.trailer || '',
                status: movie.status || 'DRAFT',
            });

            const writers = movie.professionals.filter(p => p.profession === "WRITER")?.length > 0 ? movie.professionals.filter(p => p.profession === "WRITER").map(writer => ({
                firstName: writer.firstName,
                lastName: writer.lastName
            })) : null;
            const actors = movie.professionals.filter(p => p.profession === "ACTOR")?.length > 0 ? movie.professionals.filter(p => p.profession === "ACTOR").map(movieActor => ({
                firstName: movieActor.firstName,
                lastName: movieActor.lastName,
            })) : null;
            const images = movie.images?.length > 0 ? movie.images.map(image => ({
                id: image.imageId,
                link: image.link,
                file: null,
                cover: image.cover
            })) : null;
            setDetailsData({
                writersList: writers,
                actorsList: actors,
                images: images,
                deleteImages: []
            });
            const projections = movie.projections?.length > 0 ? (() => {
                const seen = new Set();
                return movie.projections.filter(projection => {
                    const key = `${projection.time}-${projection.venue.venueId}-${projection.venue.city.id}`;
                    return seen.has(key) ? false : seen.add(key);
                }).map(projection => ({
                    venue: projection.venue.venueId,
                    city: projection.venue.city.id,
                    time: projection.time
                }));
            })() : [{ venue: null, city: null, time: null }];
            setProjectionsData(projections);
        }
    }, [movie]);

    const validateGeneralStep = useCallback(() => {
        const requiredFields = ["name", "language", "director", "rating", "duration", "projectionStart", "projectionEnd", "genres", "synopsis"];
        for (let field of requiredFields) {
            if (!movieData[field]) {
                setStepStatus(prevStatus => ({ ...prevStatus, 1: false }));
                return false;
            }
        }
        setStepStatus(prevStatus => ({ ...prevStatus, 1: true }));
        return true;
    }, [movieData]);

    const validateDetailsStep = useCallback(() => {
        const { writersList, writersFile, actorsList, actorsFile, images } = detailsData;

        if ((writersList || writersFile) && (actorsList || actorsFile) && images) {
            setStepStatus(prevStatus => ({ ...prevStatus, 2: true }));
            return true;
        } else {
            setStepStatus(prevStatus => ({ ...prevStatus, 2: false }));
            return false;
        }
    }, [detailsData]);

    const validateVenuesStep = useCallback(() => {
        if (!projectionsData || projectionsData?.length < 0 || isAddButtonDisabled) {
            setStepStatus(prevStatus => ({ ...prevStatus, 3: false }));
            return false;
        }
        setStepStatus(prevStatus => ({ ...prevStatus, 3: true }));
        return true;
    }, [projectionsData]);

    useEffect(() => {
        validateGeneralStep();
        validateDetailsStep();
        validateVenuesStep();
    }, [movieData, detailsData, projectionsData]);

    const uploadFiles = async (id) => {
        const token = localStorage.getItem('token');

        if (detailsData.actorsDelete) {
            await deleteActors(token, id);
        }

        if (detailsData.writersDelete) {
            await deleteWriters(token, id);
        }

        if (detailsData.deleteImages && detailsData.deleteImages?.length > 0) {
            await deleteImages(token, id);
        }

        if (!detailsData.actorsFile && !detailsData.writersFile) {
        } else {
            await upload(token, id);
        }

        if (detailsData.images && detailsData.images?.length > 0) {
            await uploadImages(token, id);
        }

        if (projectionsData && projectionsData?.length > 0) {
            await addProjections(token, id);
        }
    };

    const addProjections = async (token, id) => {
        if (isAddButtonDisabled) {
            return;
        }

        try {
            const response = await axios.post(`${movies}/${id}/projection`, projectionsData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.status === "200") {
                throw new Error("Failed to upload projections");
            }

        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    const uploadImages = async (token, id) => {
        const formData = new FormData();

        if (detailsData.images && detailsData.images?.length > 0) {
            let data = [];
            let existingImages = [];
            detailsData.images.map((image, i) => {
                if (image.file !== null) {
                    formData.append("files", image.file);
                    data = [...data, { "cover": image.cover }];
                } else {
                    existingImages = [...existingImages, { "id": image.id, "cover": image.cover }];
                }
            });
            data = data.concat(existingImages);
            formData.append("images", new Blob([JSON.stringify(data)], { type: "application/json" }));
        } else {
            return;
        }
        try {
            const response = await axios.post(`${movies}/${id}/add-files`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status !== 200) {
                throw new Error("Failed to upload images");
            }
        } catch (error) {
            console.error("Error uploading images:", error);
        }
    };

    const deleteImages = async (token, id) => {
        try {
            const deleteRequest = detailsData.deleteImages;

            const response = await axios.delete(
                `${movies}/${id}/images`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: deleteRequest
                }
            );

            if (response.status !== 200) {
                throw new Error("Failed to delete images");
            } else {
                setDetailsData(prevDetailsData => ({
                    ...prevDetailsData,
                    deleteImages: []
                }));
            }
        } catch (error) {
            console.error("Error deleting images:", error);
        }
    };

    const deleteWriters = async (token, id) => {
        const response = await axios.delete(`${movies}/${id}/delete-writers`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.status === "200") {
            throw new Error("Failed to delete writers");
        } else {
            setDetailsData((prevDetailsData) => ({
                ...prevDetailsData,
                writersDelete: false,
            }));
        }
    };

    const deleteActors = async (token, id) => {
        const response = await axios.delete(`${movies}/${id}/delete-actors`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.status === "200") {
            throw new Error("Failed to delete actors");
        } else {
            setDetailsData((prevDetailsData) => ({
                ...prevDetailsData,
                actorsDelete: false,
            }));
        }
    };

    const upload = async (token, id) => {
        const formData = new FormData();
        if (detailsData.writersFile) {
            formData.append("writersFile", detailsData.writersFile);
        }
        if (detailsData.actorsFile) {
            formData.append("actorsFile", detailsData.actorsFile);
        }

        try {
            const response = await axios.post(`${movies}/${id}/add-details`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.status === "200") {
                throw new Error("Failed to upload files");
            }

            

            const writers = response.data.writers?.length > 0 ? response.data.writers.map(writer => ({
                firstName: writer.firstName,
                lastName: writer.lastName
            })) : detailsData.writersList;

            const actors = response.data.actors?.length > 0 ? response.data.actors.map(movieActor => ({
                firstName: movieActor.actor.firstName,
                lastName: movieActor.actor.lastName,
            })) : detailsData.actorsList;

            setDetailsData((prevDetailsData) => ({
                ...prevDetailsData,
                writersList: writers,
                actorsList: actors,
                writersFile: null,
                actorsFile: null
            }));
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    const addMovie = async () => {
        let step = "";
        if (!stepStatus[1]) step = "ONE";
        else if (!stepStatus[2]) step = "ONE";
        else if (!stepStatus[3]) step = "TWO";
        else step = "THREE";

        const updatedMovieData = { ...movieData, step };
        setMovieData(updatedMovieData);

        const token = localStorage.getItem('token');
        try {
            if (updatedMovieData.id === undefined) {
                const response = await axios.post( movies, updatedMovieData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setMovieData((prevMovieData) => ({ ...prevMovieData, id: response.data.id }));
                    await uploadFiles(response.data.id);
                    navigate("/admin-panel/movies");
                }
            } else {
                const response = await axios.post( movies + "/" + updatedMovieData.id, updatedMovieData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    await uploadFiles(updatedMovieData.id);
                    navigate("/admin-panel/movies");
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const checkForCollisions = () => {
        const projectionMap = new Map();

        for (let projection of projectionsData) {
            const key = `${projection.city}-${projection.venue}-${projection.time}`;
            if (projectionMap.has(key)) {
                return true; // Collision detected
            }
            projectionMap.set(key, true);
        }
        return false;
    };

    const handleSaveToDraft = async () => {
        if (checkForCollisions()) {
            setAddModal(true);
            return;
        }
        await addMovie();
    };

    const displayStep = (step) => {
        switch (step) {
            case 1:
                return <General genreList={ genreList } />;
            case 2:
                return <Details />;
            case 3:
                return <Venues />;
            default:
                return null;
        }
    };

    const handleClick = (direction) => {
        let newStep = currentStep;
        direction === "continue" ? newStep++ : newStep--;
        if (newStep > 0 && newStep <= steps?.length) {
            setCurrentStep(newStep);
        }
    };

    const getGenreList = async () => {
        try {
            const response = await axios.get(`${genres}`);
            setGenreList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getGenreList();
    }, []);

    return (
        <StepperContext.Provider value={ {
            movieData,
            setMovieData,
            detailsData,
            setDetailsData,
            projectionsData,
            setProjectionsData
        } }>
            <div className="pt-32 px-40 font-body text-neutral-800 w-full">
                <div className="flex">
                    <p className="text-heading-h6 flex-1">Add New Movie</p>
                    <Button variant="secondary" onClick={ () => navigate(from) }><FontAwesomeIcon icon={ faX } /></Button>
                </div>
                <Stepper
                    steps={ steps }
                    currentStep={ currentStep }
                    stepStatus={ stepStatus }
                />
                <div className="mt-24 mb-80">
                    { displayStep(currentStep) }
                </div>
                <StepperControl
                    handleClick={ handleClick }
                    currentStep={ currentStep }
                    steps={ steps }
                    disableAdd={ isAddButtonDisabled }
                    saveToDraft={ handleSaveToDraft }
                    stepStatus={ stepStatus }
                />
                { addModal && (
                    <Modal>
                        <p className="text-heading-h6 text-neutral-900 pb-16">Movie Cannot be Added</p>
                        <p className="text-body-m text-neutral-500 text-justify">
                            Movie that has conflicting projection time cannot be added.
                        </p>
                        <div className="flex pt-32 gap-8 justify-end">
                            <Button size="sm" onClick={ () => setAddModal(false) }>Okay</Button>
                        </div>
                    </Modal>
                ) }
            </div>
        </StepperContext.Provider>
    );
};

export default AddMovie;

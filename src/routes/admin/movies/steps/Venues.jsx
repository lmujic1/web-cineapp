import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState, useEffect, useContext } from "react";

import { LabeledDropdown, DropdownItem } from "../../../../components/Dropdown";
import Label from "../../../../components/Label";
import Button from "../../../../components/Button";
import Modal from "../../../../components/Modal";

import { StepperContext } from "../../../../components/Stepper";

import { venues, cities } from "../../../../utils/api";

const Venues = () => {
    const [cityList, setCityList] = useState([]);
    const [times, setTimes] = useState([]);
    const [venueLists, setVenueLists] = useState({});
    const { projectionsData, setProjectionsData } = useContext(StepperContext);
    const [conflictTime, setConflictTime] = useState([]);
    const [modal, setModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(0);

    useEffect(() => {
        getCities();
        getTimes();
    }, []);

    useEffect(() => {
        projectionsData.forEach(projection => {
            if (projection.city) {
                getVenues(projection.city);
            }
        });
    }, [projectionsData]);

    const getCities = () => {
        axios.get(`${cities}`)
            .then(response => setCityList(response.data))
            .catch(error => {
                console.error(error);
            });
    };

    const getTimes = async () => {
        try {
            const array = [];
            for (let i = 10; i <= 23; i += 1) {
                array.push(i + ":" + "00", i + ":" + "30");
            }
            setTimes(array);
        } catch (error) {
            console.error(error);
        }
    };

    const getVenues = async (city) => {
        if (venueLists[city]) return;

        const fullUrl = `${venues}/city/${city}`;
        axios.get(fullUrl)
            .then(response => {
                setVenueLists(prev => ({
                    ...prev,
                    [city]: response.data
                }));
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleProjectionChange = (index, key, value) => {
        const updatedProjections = [...projectionsData];
        const updatedConflictTime = [...conflictTime];

        if (key === 'time') {
            const isConflict = updatedProjections.some((projection, projIndex) => {
                return (
                    projIndex !== index &&
                    projection.city === updatedProjections[index].city &&
                    projection.venue === updatedProjections[index].venue &&
                    projection.time === value
                );
            });

            updatedConflictTime[index] = isConflict;
        } else {
            updatedConflictTime[index] = false;
        }

        if (key === 'city') {
            getVenues(value);
            updatedProjections[index].venue = null;
        }

        updatedProjections[index][key] = value;
        setProjectionsData(updatedProjections);
        setConflictTime(updatedConflictTime);
    };

    const getCityName = (id) => {
        return cityList?.find(c => c.id === id)?.name;
    };

    const getVenueName = (city, id) => {
        return venueLists[city]?.find(c => c.venueId === id)?.name;
    };

    useEffect(() => {
        if (!projectionsData || projectionsData.length === 0) {
            setProjectionsData([{ venue: null, city: null, time: null }]);
        }
    }, [projectionsData, setProjectionsData]);

    const isAddButtonDisabled = projectionsData.some(projection => !projection.city || !projection.venue || !projection.time);

    return (
        <div>
            { projectionsData.length > 0 ? projectionsData.map((projection, index) => (
                <div key={ index } className="flex w-full gap-12 mb-16">
                    <div className="w-full grid grid-cols-3 gap-16">
                        <LabeledDropdown
                            value={ getCityName(projection.city) }
                            label={
                                <Label
                                    label="City"
                                    className="!text-neutral-700"
                                    leftIcon={ <FontAwesomeIcon className="w-5 h-5 mr-8" icon={ fas.faLocationPin } /> }
                                    rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
                                >
                                    { getCityName(projection.city) || "Choose city" }
                                </Label>
                            }
                        >
                            <DropdownItem
                                onClick={ () => handleProjectionChange(index, 'city', null) }
                                className={ `${projection.city === null ? "font-semibold" : "font-normal"}` }
                            >
                                Choose city
                            </DropdownItem>
                            { cityList.map((city, cityIndex) => (
                                <DropdownItem
                                    key={ cityIndex }
                                    onClick={ () => handleProjectionChange(index, 'city', city.id) }
                                    className={ `flex hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer ${city.id === projection.city ? "font-semibold" : "font-normal"}` }
                                >
                                    { city.name }
                                </DropdownItem>
                            )) }
                        </LabeledDropdown>
                        <LabeledDropdown
                            value={ getVenueName(projection.city, projection.venue) }
                            label={
                                <Label
                                    label="Venue"
                                    className="!text-neutral-700"
                                    leftIcon={ <FontAwesomeIcon className="w-5 h-5 mr-8" icon={ fas.faBuilding } /> }
                                    rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
                                >
                                    { getVenueName(projection.city, projection.venue) || "Choose venue" }
                                </Label>
                            }
                        >
                            <DropdownItem
                                onClick={ () => handleProjectionChange(index, 'venue', null) }
                                className={ `${projection.venue === null ? "font-semibold" : "font-normal"}` }
                            >
                                Choose venue
                            </DropdownItem>
                            { venueLists[projection.city]?.map((venue, venueIndex) => (
                                <DropdownItem
                                    key={ venueIndex }
                                    onClick={ () => handleProjectionChange(index, 'venue', venue.venueId) }
                                    className={ `flex hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer ${venue.venueId === projection.venue ? "font-semibold" : "font-normal"}` }
                                >
                                    { venue.name }
                                </DropdownItem>
                            )) }
                        </LabeledDropdown>
                        <LabeledDropdown
                            value={ projection.time }
                            label={
                                <Label
                                    label="Projection Time"
                                    className="!text-neutral-700"
                                    leftIcon={ <FontAwesomeIcon className="w-5 h-5 mr-8" icon={ fas.faClock } /> }
                                    rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
                                    variant={ conflictTime[index] ? 'error' : 'default' }
                                    error={ conflictTime[index] }
                                    errorMessage="Movie projection times cannot collide for the same Venues"
                                >
                                    { projection.time?.slice(0, 5) || "Choose time" }
                                </Label>
                            }
                        >
                            <DropdownItem
                                onClick={ () => handleProjectionChange(index, 'time', null) }
                                className={ `${projection.time === null ? "font-semibold" : "font-normal"}` }
                            >
                                Choose time
                            </DropdownItem>
                            { times.map((time, timeIndex) => (
                                <DropdownItem
                                    key={ timeIndex }
                                    onClick={ () => handleProjectionChange(index, 'time', time + ":00") }
                                    className={ `flex hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer ${time + ":00" === projection.time ? "font-semibold" : "font-normal"}` }
                                >
                                    { time }
                                </DropdownItem>
                            )) }
                        </LabeledDropdown>
                    </div>
                    <div className="flex w-64">
                        <Button
                            variant="tertiary"
                            className="mt-[35px] mb-8 h-[50px] hover:bg-primary-50"
                            disabled={ !projection.city || !projection.venue || !projection.time }
                            onClick={ () => {
                                setDeleteIndex(index);
                                setModal(true);
                            } }
                        >
                            <FontAwesomeIcon icon={ fas.faTrash } />
                        </Button>
                    </div>
                </div>
            )) : (
                <p>No projections available.</p>
            ) }
            <div className="flex items-center justify-center pt-16">
                <Button variant="tertiary" disabled={ isAddButtonDisabled } onClick={ () => setProjectionsData([...projectionsData, { city: null, venue: null, time: null }]) }>
                    <FontAwesomeIcon icon={ fas.faPlus } /> Add Projection
                </Button>
            </div>
            { modal && (
                <Modal>
                    <p className="text-heading-h6 text-neutral-900 pb-16">Delete Projection</p>
                    <p className="text-body-m text-neutral-500 text-justify">
                        Are you sure you want to delete this projection?
                    </p>
                    <div className="flex pt-32 gap-8 justify-end">
                        <Button size="sm" variant="secondary" onClick={ () => setModal(false) }>Cancel</Button>
                        <Button size="sm" onClick={ () => {
                            const updatedProjections = projectionsData.filter((_, projIndex) => projIndex !== deleteIndex);
                            setProjectionsData(updatedProjections);
                            setModal(false);
                        } }>Delete</Button>
                    </div>
                </Modal>
            ) }
        </div>
    );
};

export default Venues;

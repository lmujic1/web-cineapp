import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faChevronDown, faHashtag, faLocationPin, faPhone } from "@fortawesome/free-solid-svg-icons";

import Button from "../../../components/Button";
import Label from "../../../components/Label";
import { Input } from "../../../components/Input";
import { LabeledDropdown, DropdownItem } from "../../../components/Dropdown";

import { cities, venues } from "../../../utils/api";

const AddVenue = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef();
    const [file, setFile] = useState(null);
    const [cityList, setCityList] = useState([]);
    const [venueRequest, setVenueRequest] = useState({
        id: null,
        name: "",
        street: "",
        number: "",
        city: null,
        link: null,
        telephone: "",
    });
    const [venueDataFocused, setVenueDataFocused] = useState({});
    const { venue } = location.state || {};
    const [editable, setEditable] = useState(true);

    const placeholder = !venueRequest.link && !file;

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(`${cities}`);
                setCityList(response.data);
            } catch (error) {
                console.error("Error loading cities:", error);
            }

        
        };

        fetchCities();

        if (venue) {
            setVenueRequest({
                id: venue.venueId,
                name: venue.name,
                city: venue.city.id,
                link: venue.image,
                street: venue.street,
                number: venue.streetNumber,
                telephone: venue.telephone,
            });
            setEditable(false);
        }
    }, [venue]);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setVenueRequest((prev) => ({ ...prev, link: null }));
        }
    };

    const onChooseFile = () => inputRef.current.click();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "number" && isNaN(value)) return;
        setVenueRequest((prev) => ({ ...prev, [name]: value }));
    };

    const handleFocus = (field) => setVenueDataFocused((prev) => ({ ...prev, [field]: true }));

    const handleBlur = (field) => setVenueDataFocused((prev) => ({ ...prev, [field]: false }));

    const getCityName = (id) => cityList.find((c) => c.id === id)?.name || "City";

    const handleVenueAction = useCallback(async (action) => {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        if (action === "delete") {
            try {
                const response = await axios.delete(`${venues}/${venueRequest.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    navigate("/admin-panel/venues");
                } else {
                    throw new Error("Failed to delete venue");
                }
            } catch (error) {
                console.error("Error deleting venue:", error);
            }
        } else if (action === "upload") {
            formData.append("image", file);
            formData.append(
                "venue",
                new Blob([JSON.stringify(venueRequest)], { type: "application/json" })
            );

            

            try {
                const requestUrl = `${venues}${venueRequest.id ? `/${venueRequest.id}` : ""}`;
                const response = await axios.post(requestUrl, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if ([200, 201].includes(response.status)) {
                    navigate("/admin-panel/venues");
                } else {
                    throw new Error("Failed to upload venue");
                }
            } catch (error) {
                console.error("Error uploading venue:", error);
            }
        }
    }, [venueRequest, file, navigate]);

    const cityLabel = (
        <Label
            label="City"
            value={ venueRequest.city }
            variant={ editable ? "default" : "disabled" }
            className="mb-24 !text-neutral-700"
            leftIcon={ <FontAwesomeIcon className="mr-8" icon={ faLocationPin } /> }
            rightIcon={ <FontAwesomeIcon icon={ faChevronDown } /> }
        >
            { getCityName(venueRequest.city) }
        </Label>
    );

    return (
        <div className="pt-40 px-40 font-body text-neutral-800 w-full flex flex-col">
            <div className="flex pb-16 border-b border-b-neutral-200">
                <p className="text-heading-h6 flex-1">
                    { venueRequest.id === null ? "New Venue" : venueRequest.name }
                </p>
                { !editable && <Button onClick={ () => setEditable(true) }>Edit Venue</Button> }
                { editable && venueRequest.id && (
                    <Button
                        variant="tertiary"
                        className="!text-error-600"
                        onClick={ () => handleVenueAction("delete") }
                    >
                        Delete Venue
                    </Button>
                ) }
            </div>

            <div className="flex items-center justify-center border-b border-b-neutral-200">
                <div className="rounded-16 relative py-32">
                    <input
                        type="file"
                        onChange={ handleImageChange }
                        className="hidden"
                        ref={ inputRef }
                    />
                    <img
                        className={ `w-[270px] h-[260px] rounded-16 object-cover ${placeholder ? "opacity-60" : ""
                            }` }
                        src={
                            placeholder
                                ? "/placeholder.png"
                                : venueRequest.link
                                    ? venueRequest.link
                                    : URL.createObjectURL(file)
                        }
                        alt={ placeholder ? "" : "Uploaded" }
                    />
                    <div className="bg-neutral-800 bg-opacity-80 absolute top-[75.4%] rounded-b-16 w-full flex justify-center">
                        { editable && (
                            <Button
                                variant="tertiary"
                                className="!text-neutral-0 !font-normal"
                                onClick={ onChooseFile }
                            >
                                Upload Image
                            </Button>
                        ) }
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 pt-32 border-b border-b-neutral-200 mb-24">
                <div className="mr-16">
                    <Label
                        label="Venue Name"
                        value={ venueRequest.name }
                        className="mb-24 !text-neutral-700"
                        leftIcon={ <FontAwesomeIcon icon={ faBuilding } /> }
                        active={ venueDataFocused.name }
                    >
                        <Input
                            name="name"
                            text="Venue"
                            value={ venueRequest.name || "" }
                            onChange={ handleChange }
                            onFocus={ () => handleFocus("name") }
                            onBlur={ () => handleBlur("name") }
                            disabled={ !editable }
                        />
                    </Label>
                    <Label
                        label="Street"
                        value={ venueRequest.street }
                        className="mb-24 !text-neutral-700"
                        leftIcon={ <FontAwesomeIcon icon={ faLocationPin } /> }
                        active={ venueDataFocused.street }
                    >
                        <Input
                            name="street"
                            text="Street"
                            value={ venueRequest.street || "" }
                            onChange={ handleChange }
                            onFocus={ () => handleFocus("street") }
                            onBlur={ () => handleBlur("street") }
                            disabled={ !editable }
                        />
                    </Label>
                </div>
                <div>
                    <Label
                        label="Phone"
                        value={ venueRequest.telephone }
                        className="mb-24 !text-neutral-700"
                        leftIcon={ <FontAwesomeIcon icon={ faPhone } /> }
                        active={ venueDataFocused.telephone }
                    >
                        <Input
                            name="telephone"
                            text="Phone"
                            value={ venueRequest.telephone || "" }
                            onChange={ handleChange }
                            onFocus={ () => handleFocus("telephone") }
                            onBlur={ () => handleBlur("telephone") }
                            disabled={ !editable }
                        />
                    </Label>
                    <Label
                        label="Street Number"
                        value={ venueRequest.number }
                        className="!text-neutral-700"
                        leftIcon={ <FontAwesomeIcon icon={ faHashtag } /> }
                        active={ venueDataFocused.number }
                    >
                        <Input
                            name="number"
                            text="Number"
                            value={ venueRequest.number || "" }
                            onChange={ handleChange }
                            onFocus={ () => handleFocus("number") }
                            onBlur={ () => handleBlur("number") }
                            disabled={ !editable }
                        />
                    </Label>
                </div>
                <div className="col-span-2">
                    { editable ? (
                        <LabeledDropdown value={ venueRequest.city } label={ cityLabel }>
                            <DropdownItem
                                onClick={ () => setVenueRequest({ ...venueRequest, city: null }) }
                                className={ `${venueRequest.city === null ? "font-semibold" : "font-normal"
                                    }` }
                            >
                                Choose city
                            </DropdownItem>
                            { cityList.map((city) => (
                                <DropdownItem
                                    key={ city.id }
                                    onClick={ () =>
                                        setVenueRequest({ ...venueRequest, city: city.id })
                                    }
                                    className={ `flex hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer ${city.id === venueRequest.city
                                        ? "font-semibold"
                                        : "font-normal"
                                        }` }
                                >
                                    { city.name }
                                </DropdownItem>
                            )) }
                        </LabeledDropdown>
                    ) : (
                        cityLabel
                    ) }
                </div>
            </div>
            { editable && (
                <div className="flex justify-end pb-40 gap-12">
                    <Button variant="secondary" onClick={ () => navigate("/admin-panel/venues") }>
                        Cancel
                    </Button>
                    <Button onClick={ () => handleVenueAction("upload") }>
                        { venueRequest.id === null ? "Add Venue" : "Save changes" }
                    </Button>
                </div>
            ) }
        </div>
    );
};

export default AddVenue;

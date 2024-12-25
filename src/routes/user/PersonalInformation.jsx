import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faLocationPin, faEnvelope, faChevronDown, faEarthEurope, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Button from "../../components/Button";
import Label from "../../components/Label";
import { Input } from "../../components/Input";
import Image from "../../components/Image";
import Modal from "../../components/Modal";
import { LabeledDropdown, DropdownItem } from "../../components/Dropdown";

import { url, cities, user } from "../../utils/api";

const PersonalInformation = () => {
    const [editable, setEditable] = useState(false);

    const navigate = useNavigate();
    const inputRef = useRef();
    const [file, setFile] = useState(null);
    const [cityList, setCityList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [validEmail, setValidEmail] = useState(true);
    const [modal, setModal] = useState(false);
    const [userRequest, setUserRequest] = useState({});

    const [userDataFocused, setUserDataFocused] = useState({});

    const placeholder = !userRequest.image && !file;

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get(`${url}${cities}`);
                setCityList(response.data);
            } catch (error) {
                console.error("Error loading cities:", error);
            }
        };

        const fetchCountries = async () => {
            try {
                const response = await axios.get(`${url}/api/countries`);
                setCountryList(response.data);
            } catch (error) {
                console.error("Error loading cities:", error);
            }
        };

        fetchCities();
        fetchCountries();
    }, []);

    const handleimageChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setUserRequest((prev) => ({ ...prev, image: null }));
            setFile(selectedFile);
        }
    };

    const onChooseFile = () => inputRef.current.click();

    const validateEmail = (email) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        setValidEmail(isValid);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") validateEmail(value);
        setUserRequest((prev) => ({ ...prev, [name]: value }));
    };

    const handleFocus = (field) => setUserDataFocused((prev) => ({ ...prev, [field]: true }));

    const handleBlur = (field) => setUserDataFocused((prev) => ({ ...prev, [field]: false }));

    const getCityName = (id) => cityList.find((c) => c.id === id)?.name || "City";
    const getCountryName = (id) => countryList.find((c) => c.id === id)?.name || "Country";

    const handleUserAction = useCallback(async (action) => {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        if (action === "deactivate") {
            try {
                const response = await axios.put(`${url}${user}/deactivate-account`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    localStorage.clear();
                    window.location.reload();
                    navigate("/");
                } else {
                    throw new Error("Failed to deactivate account!");
                }
            } catch (error) {
                console.error("Error deactivating account!", error);
            }
        } else if (action === "upload") {
            formData.append("image", file);
            formData.append("user", new Blob([JSON.stringify(userRequest)], { type: "application/json" }));

            try {
                const requestUrl = `${url}${user}/change-info`;
                const response = await axios.put(requestUrl, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if ([200, 201].includes(response.status)) {
                    setEditable(false);
                } else {
                    throw new Error("Failed to save data");
                }
            } catch (error) {
                console.error("Error uploading new data:", error);
            }
        }
    }, [userRequest, file, navigate]);

    const cityLabel = (
        <Label
            label="City"
            value={ userRequest.city }
            className="mb-24 !text-neutral-700"
            leftIcon={ <FontAwesomeIcon className="mr-8" icon={ faLocationPin } /> }
            rightIcon={ <FontAwesomeIcon icon={ faChevronDown } /> }
        >
            { getCityName(userRequest.city) }
        </Label>
    );

    const countryLabel = (
        <Label
            label="Country"
            value={ userRequest.country }
            className="mb-24 !text-neutral-700"
            leftIcon={ <FontAwesomeIcon className="mr-8" icon={ faEarthEurope } /> }
            rightIcon={ <FontAwesomeIcon icon={ faChevronDown } /> }
        >
            { getCountryName(userRequest.country) }
        </Label>
    );

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${url}${user}/details`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userData = response.data;
                setUserRequest({
                    id: userData.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    phone: userData.phone,
                    image: userData.image,
                    email: userData.email,
                    city: userData.city ? userData.city.id : null,
                    country: userData.city ? userData.city.country.id : null,
                });
            } catch (error) {
                console.error("Error loading user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    if (!userRequest) {
        return <div className="text-heading-h6 text-neutral-600 pl-[118px] pt-80">Loading...</div>;
    }

    return (
        <div className="bg-neutral-25 text-neutral-800 px-32 pb-160">
            <div className="flex pt-24 pb-32">
                <p className="text-heading-h5 flex-1">Personal Information</p>
                { !editable && <Button onClick={ () => setEditable(true) }>Edit Profile</Button> }
            </div>
            { !editable ? (
                <div className="h-[292px] bg-neutral-0 border border-neutral-200 rounded-24">
                    <div className="grid grid-cols-2 w-[650px]">
                        <div className="pl-16 py-16">
                            <Image className="h-[260px] w-[285px] object-cover rounded-16" src={ userRequest.image ? userRequest.image : file ? URL.createObjectURL(file) : "/user_placeholder.png" } alt="User image" />
                        </div>
                        <div className="flex flex-col text-body-l gap-12 py-16">
                            <p className="text-heading-h4">{ userRequest.firstName } { userRequest.lastName }</p>
                            <p><FontAwesomeIcon className="text-primary-600 mr-16" icon={ faPhone } />{ userRequest.phone }</p>
                            <p><FontAwesomeIcon className="text-primary-600 mr-16" icon={ faEnvelope } />{ userRequest.email }</p>
                            <p><FontAwesomeIcon className="text-primary-600 mr-[19px]" icon={ faLocationPin } />{ getCityName(userRequest.city) }</p>
                            <p><FontAwesomeIcon className="text-primary-600 mr-16" icon={ faEarthEurope } />{ getCountryName(userRequest.country) }</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex items-center justify-center border-b border-b-neutral-200">
                        <div className="rounded-16 relative pt-16 pb-32">
                            <input
                                type="file"
                                onChange={ handleimageChange }
                                className="hidden"
                                ref={ inputRef }
                            />
                            <img
                                className={ `w-[270px] h-[260px] rounded-16 object-cover ${placeholder ? "opacity-60" : ""}` }
                                src={
                                    placeholder
                                        ? "/user_placeholder.png"
                                        : userRequest.image
                                            ? userRequest.image
                                            : URL.createObjectURL(file)
                                }
                                alt={ placeholder ? "User placeholder" : "Uploaded" }
                            />
                            <div className="bg-neutral-800 bg-opacity-80 absolute top-[75.4%] rounded-b-16 w-full flex justify-center">
                                { editable && (
                                    <Button
                                        variant="tertiary"
                                        className="!text-neutral-0 !font-normal"
                                        onClick={ onChooseFile }
                                    >
                                        Upload image
                                    </Button>
                                ) }
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 pt-32 border-b border-b-neutral-200 mb-24">
                        <div className="mr-16">
                            <Label
                                label="First Name"
                                value={ userRequest.firstName }
                                className="mb-24 !text-neutral-700"
                                leftIcon={ <FontAwesomeIcon icon={ faUser } /> }
                                active={ userDataFocused.firstName }
                            >
                                <Input
                                    name="firstName"
                                    text="First Name"
                                    value={ userRequest.firstName || "" }
                                    onChange={ handleChange }
                                    onFocus={ () => handleFocus("firstName") }
                                    onBlur={ () => handleBlur("firstName") }
                                />
                            </Label>
                            <Label
                                label="Phone"
                                value={ userRequest.phone }
                                className="mb-24 !text-neutral-700"
                                leftIcon={ <FontAwesomeIcon icon={ faPhone } /> }
                                active={ userDataFocused.phone }
                            >
                                <Input
                                    name="phone"
                                    text="Phone"
                                    value={ userRequest.phone || "" }
                                    onChange={ handleChange }
                                    onFocus={ () => handleFocus("phone") }
                                    onBlur={ () => handleBlur("phone") }
                                    disabled={ !editable }
                                />
                            </Label>
                            <LabeledDropdown value={ userRequest.city } label={ cityLabel }>
                                <DropdownItem
                                    onClick={ () => setUserRequest({ ...userRequest, city: null }) }
                                    className={ `${userRequest.city === null ? "font-semibold" : "font-normal"}` }
                                >
                                    Choose city
                                </DropdownItem>
                                { cityList.map((city) => (
                                    <DropdownItem
                                        key={ city.id }
                                        onClick={ () =>
                                            setUserRequest({ ...userRequest, city: city.id })
                                        }
                                        className={ `flex hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer ${city.id === userRequest.city ? "font-semibold" : "font-normal"}` }
                                    >
                                        { city.name }
                                    </DropdownItem>
                                )) }
                            </LabeledDropdown>
                        </div>
                        <div>
                            <Label
                                label="Last Name"
                                value={ userRequest.lastName }
                                className="mb-24 !text-neutral-700"
                                leftIcon={ <FontAwesomeIcon icon={ faUser } /> }
                                active={ userDataFocused.lastName }
                            >
                                <Input
                                    name="lastName"
                                    text="Last Name"
                                    value={ userRequest.lastName || "" }
                                    onChange={ handleChange }
                                    onFocus={ () => handleFocus("lastName") }
                                    onBlur={ () => handleBlur("lastName") }
                                />
                            </Label>
                            <Label
                                label="Email"
                                value={ userRequest.email }
                                className="mb-24 !text-neutral-700"
                                error={ !validEmail }
                                leftIcon={ <FontAwesomeIcon icon={ faEnvelope } /> }
                                variant={ !validEmail ? 'error' : 'default' }
                                errorMessage={ validEmail ? null : "Enter valid email address" }
                            >
                                <Input
                                    name="email"
                                    value={ userRequest.email || "" }
                                    text="Email Address"
                                    error={ !validEmail }
                                    onChange={ handleChange }
                                    onFocus={ () => handleFocus("email") }
                                    onBlur={ () => handleBlur("email") }
                                />
                            </Label>
                            <LabeledDropdown value={ userRequest.country } label={ countryLabel }>
                                <DropdownItem
                                    onClick={ () => setUserRequest({ ...userRequest, country: null }) }
                                    className={ `${userRequest.country === null ? "font-semibold" : "font-normal"}` }
                                >
                                    Choose country
                                </DropdownItem>
                                { countryList.map((country) => (
                                    <DropdownItem
                                        key={ country.id }
                                        onClick={ () =>
                                            setUserRequest({ ...userRequest, country: country.id })
                                        }
                                        className={ `flex hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer ${country.id === userRequest.country ? "font-semibold" : "font-normal"}` }
                                    >
                                        { country.name }
                                    </DropdownItem>
                                )) }
                            </LabeledDropdown>
                        </div>
                    </div>
                    { editable && (
                        <div className="flex justify-start pb-40 gap-12">
                            <div className="!w-[226px] flex-1">
                                <Button variant="tertiary" onClick={ () => setModal(true) }>Deactivate My Account</Button>
                            </div>
                            <Button variant="secondary" onClick={ () => setEditable(false) }>
                                Cancel
                            </Button>
                            <Button onClick={ () => handleUserAction("upload") }>Save changes</Button>
                        </div>
                    ) }
                </div>
            ) }
            { modal && (
                <Modal>
                    <p className="text-heading-h6 text-neutral-900 pb-16">Are You sure You want to deactivate account?</p>
                    <p className="text-body-m text-neutral-500 text-justify">
                        You will not be able to access your reservations or book new tickets.
                    </p>
                    <div className="flex pt-32 gap-8 justify-end">
                        <Button variant="secondary" size="sm" onClick={ () => setModal(false) }>Back</Button>
                        <Button size="sm" onClick={ () => { handleUserAction("deactivate") } }>Deactivate</Button>
                    </div>
                </Modal>
            ) }
        </div>
    );
}

export default PersonalInformation;

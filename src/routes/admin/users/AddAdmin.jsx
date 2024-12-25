import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faLocationPin, faEnvelope, faChevronDown, faEarthEurope, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


import { url, cities, user, superAdmin } from "../../../utils/api";
import Label from "../../../components/Label";
import Button from "../../../components/Button";
import { Input } from "../../../components/Input";
import { DropdownItem, LabeledDropdown } from "../../../components/Dropdown";
import Modal from "../../../components/Modal";

const AddAdmin = () => {
    const [editable, setEditable] = useState(true);

    const navigate = useNavigate();
    const inputRef = useRef();
    const [file, setFile] = useState(null);
    const [cityList, setCityList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [validEmail, setValidEmail] = useState(true);
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

        if (action === "add") {
            formData.append("image", file);
            formData.append("user", new Blob([JSON.stringify(userRequest)], { type: "application/json" }));

            try {
                const requestUrl = `${url}${superAdmin}/user/new`;
                const response = await axios.post(requestUrl, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if ([200, 201].includes(response.status)) {
                    navigate('/admin-panel/users')
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
            value={userRequest.city}
            className="mb-24 !text-neutral-700"
            leftIcon={<FontAwesomeIcon className="mr-8" icon={faLocationPin} />}
            rightIcon={<FontAwesomeIcon icon={faChevronDown} />}
        >
            {getCityName(userRequest.city)}
        </Label>
    );

    const countryLabel = (
        <Label
            label="Country"
            value={userRequest.country}
            className="mb-24 !text-neutral-700"
            leftIcon={<FontAwesomeIcon className="mr-8" icon={faEarthEurope} />}
            rightIcon={<FontAwesomeIcon icon={faChevronDown} />}
        >
            {getCountryName(userRequest.country)}
        </Label>
    );

    useEffect(() => {
        setUserRequest({
            id: "",
            firstName: "",
            lastName: "",
            phone: "",
            image: null,
            email: "",
            city: null,
            country: null
        });
    }, []);

    if (!userRequest) {
        return <div className="text-heading-h6 text-neutral-600 pl-[118px] pt-80">Loading...</div>;
    }

    return (
        <div className="bg-neutral-25 text-neutral-800 px-32 pb-160">
            <div className="flex pt-24 pb-32">
                <p className="text-heading-h5 flex-1">Add New Admin</p>
            </div>
            <div>
                <div className="flex items-center justify-center border-b border-b-neutral-200">
                    <div className="rounded-16 relative pt-16 pb-32">
                        <img
                            className={`w-[270px] h-[260px] rounded-16 object-cover ${placeholder ? "opacity-60" : ""}`}
                            src={
                                placeholder
                                    ? "/user_placeholder.png"
                                    : userRequest.image
                                        ? userRequest.image
                                        : URL.createObjectURL(file)
                            }
                            alt={placeholder ? "User placeholder" : "Uploaded"}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 pt-32 border-b border-b-neutral-200 mb-24">
                    <div className="mr-16">
                        <Label
                            label="First Name"
                            value={userRequest.firstName}
                            className="mb-24 !text-neutral-700"
                            leftIcon={<FontAwesomeIcon icon={faUser} />}
                            active={userDataFocused.firstName}
                        >
                            <Input
                                name="firstName"
                                text="First Name"
                                value={userRequest.firstName || ""}
                                onChange={handleChange}
                                onFocus={() => handleFocus("firstName")}
                                onBlur={() => handleBlur("firstName")}
                            />
                        </Label>
                        <Label
                            label="Phone"
                            value={userRequest.phone}
                            className="mb-24 !text-neutral-700"
                            leftIcon={<FontAwesomeIcon icon={faPhone} />}
                            active={userDataFocused.phone}
                        >
                            <Input
                                name="phone"
                                text="Phone"
                                value={userRequest.phone || ""}
                                onChange={handleChange}
                                onFocus={() => handleFocus("phone")}
                                onBlur={() => handleBlur("phone")}
                                disabled={!editable}
                            />
                        </Label>
                        <LabeledDropdown value={userRequest.city} label={cityLabel}>
                            <DropdownItem
                                onClick={() => setUserRequest({ ...userRequest, city: null })}
                                className={`${userRequest.city === null ? "font-semibold" : "font-normal"}`}
                            >
                                Choose city
                            </DropdownItem>
                            {cityList.map((city) => (
                                <DropdownItem
                                    key={city.id}
                                    onClick={() =>
                                        setUserRequest({ ...userRequest, city: city.id })
                                    }
                                    className={`flex hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer ${city.id === userRequest.city ? "font-semibold" : "font-normal"}`}
                                >
                                    {city.name}
                                </DropdownItem>
                            ))}
                        </LabeledDropdown>
                    </div>
                    <div>
                        <Label
                            label="Last Name"
                            value={userRequest.lastName}
                            className="mb-24 !text-neutral-700"
                            leftIcon={<FontAwesomeIcon icon={faUser} />}
                            active={userDataFocused.lastName}
                        >
                            <Input
                                name="lastName"
                                text="Last Name"
                                value={userRequest.lastName || ""}
                                onChange={handleChange}
                                onFocus={() => handleFocus("lastName")}
                                onBlur={() => handleBlur("lastName")}
                            />
                        </Label>
                        <Label
                            label="Email"
                            value={userRequest.email}
                            className="mb-24 !text-neutral-700"
                            error={!validEmail}
                            leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
                            variant={!validEmail ? 'error' : 'default'}
                            errorMessage={validEmail ? null : "Enter valid email address"}
                        >
                            <Input
                                name="email"
                                value={userRequest.email || ""}
                                text="Email Address"
                                error={!validEmail}
                                onChange={handleChange}
                                onFocus={() => handleFocus("email")}
                                onBlur={() => handleBlur("email")}
                            />
                        </Label>
                        <LabeledDropdown value={userRequest.country} label={countryLabel}>
                            <DropdownItem
                                onClick={() => setUserRequest({ ...userRequest, country: null })}
                                className={`${userRequest.country === null ? "font-semibold" : "font-normal"}`}
                            >
                                Choose country
                            </DropdownItem>
                            {countryList.map((country) => (
                                <DropdownItem
                                    key={country.id}
                                    onClick={() =>
                                        setUserRequest({ ...userRequest, country: country.id })
                                    }
                                    className={`flex hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer ${country.id === userRequest.country ? "font-semibold" : "font-normal"}`}
                                >
                                    {country.name}
                                </DropdownItem>
                            ))}
                        </LabeledDropdown>
                    </div>
                </div>
                <div className="flex justify-end pb-40 gap-12">
                    <Button variant="secondary" onClick={() => navigate('/admin-panel/users')}>
                        Cancel
                    </Button>
                    <Button onClick={() => handleUserAction("add")}>Add</Button>
                </div>
            </div>

        </div>
    );
}

export default AddAdmin;

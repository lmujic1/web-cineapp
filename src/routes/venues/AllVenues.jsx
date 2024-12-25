import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faLocationPin, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import VenueCard from "../../components/card/VenueCard";
import Label from "../../components/Label";
import { LabeledDropdown, DropdownItem } from "../../components/Dropdown";
import Button from "../../components/Button";
import { Input } from "../../components/Input";

import { getFilterParams, getPaginationParams, handleFilterChange, handlePageChange } from "../../utils/utils";
import { url, venues, cities } from "../../utils/api";

const AllVenues = () => {
    const [venueList, setVenueList] = useState([]);
    const [maxPages, setMaxPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [cityList, setCityList] = useState([]);

    const [pagination, setPagination] = useState({ page: 1, size: 4 });
    const [filterParams, setFilterParams] = useState({ city: null });
    const [focused, setFocused] = useState(false);

    const loadCities = async () => {
        try {
            const response = await axios.get(`${url}${cities}`);
            setCityList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadVenues = async () => {
        try {
            const route = `${url}${venues}/search`;
            const search = searchParams.toString() ? `?${searchParams.toString()}` : '';
            const pagination = getPaginationParams(searchParams);
            setPagination(pagination);

            const response = await axios.get(`${route}${search}`);
            const data = response.data;
            if (parseInt(pagination.page) > 1) {
                setVenueList(prev => [...prev, ...data.content]);
            } else {
                setTotalPosts(data.totalElements);
                setMaxPages(data.totalPages);
                setVenueList(data.content);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        handleFilterChange(searchParams, setSearchParams, 'contains', value.length >= 3 ? value : null);
    };

    const handleFilter = (field, value) => {
        handlePageChange(searchParams, setSearchParams, { page: 1 });
        handleFilterChange(searchParams, setSearchParams, field, value);
    };

    const handlePage = (page) => {
        handlePageChange(searchParams, setSearchParams, { page });
    };

    useEffect(() => {
        const filterParams = getFilterParams(searchParams);
        setFilterParams(filterParams);
        loadVenues();
    }, [searchParams]);

    useEffect(() => {
        handlePage(1);
        loadCities();
    }, []);

    const getCityName = (id) => cityList?.find(c => c.id.toString() === id)?.name;

    const cityLabel = (
        <Label leftIcon={ <FontAwesomeIcon className="w-5 h-5 mr-8" icon={ faLocationPin } /> } rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ faChevronDown } /> }>
            { getCityName(filterParams.city) || "City" }
        </Label>
    );

    return (
        <div className="px-[118px] py-16 font-body">
            <p className="text-heading-h4 text-neutral-800 py-24">Venues ({ totalPosts })</p>
            <div className="grid grid-cols-5 gap-12 pb-8">
                <Label className="col-span-4" value={ filterParams.contains } active={ focused } leftIcon={ <FontAwesomeIcon icon={ faMagnifyingGlass } /> }>
                    <Input text="Search Venues" onChange={ handleSearchChange } onFocus={ () => setFocused(true) } onBlur={ () => setFocused(false) } />
                </Label>
                <LabeledDropdown value={ getCityName(filterParams.city) } label={ cityLabel }>
                    <DropdownItem onClick={ () => handleFilter('city', null) } className={ `${filterParams.city === null ? "font-semibold" : "font-normal"}` }>
                        All cities
                    </DropdownItem>
                    { cityList.map((city, index) => (
                        <DropdownItem key={ index } onClick={ () => handleFilter('city', city.id) } className={ `flex hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer ${city.id === parseInt(filterParams.city) ? "font-semibold" : "font-normal"}` }>
                            { city.name }
                        </DropdownItem>
                    )) }
                </LabeledDropdown>
            </div>
            <div className="grid gap-12 py-8 lg:grid-cols-2 sm:grid-cols-1">
                { venueList.map((item, index) => (
                    <Link key={ index } to={ `/venue-details/${item.venueId}` }>
                        <VenueCard className="h-[367px] mb-8" venue={ item } />
                    </Link>
                )) }
            </div>
            <div className="flex items-center justify-center pb-40">
                { pagination.page < maxPages && <Button variant="tertiary" onClick={ () => handlePage(parseInt(pagination.page) + 1) }>Load More</Button> }
            </div>
        </div>
    );
};

export default AllVenues;

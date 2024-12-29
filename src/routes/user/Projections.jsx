import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import axios from "axios";

import { TabGroup, Tab, TabContent } from "../../components/Tab";

import { lastPathPart } from "../../utils/utils";
import { reservation } from "../../utils/api";

const Projections = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [numberOfElements, setNumberOfElements] = useState({ upcoming: 0, past: 0 })
    const [selectedTab, setSelectedTab] = useState(lastPathPart(location.pathname) || 'upcoming');

    const navigateToTab = (tab) => {
        setSelectedTab(tab);
        navigate(`/user-profile/projections/${tab}`);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchNumberOfElements = async () => {
            try {
                const response = await axios.get(`${reservation}/count-elements`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setNumberOfElements({
                    upcoming: response.data.upcoming,
                    past: response.data.archived
                })
            } catch (error) {
                console.error("Error loading number of elements:", error);
            }
        };

        fetchNumberOfElements();
    }, [])

    return (
        <div className="bg-neutral-25 text-neutral-800 px-32 pb-160">
            <p className="text-heading-h5 pt-40 pb-16">Projections</p>
            <TabGroup selected={ selectedTab } onChange={ navigateToTab }>
                <Tab value="upcoming">Upcoming ({ numberOfElements.upcoming })</Tab>
                <Tab value="past">Past ({ numberOfElements.past })</Tab>
            </TabGroup>

            <TabContent>
                <Outlet />
            </TabContent>
        </div>
    )
}

export default Projections;

import { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { Tab, TabGroup, TabContent } from "../../../components/Tab";
import Button from "../../../components/Button";
import { NumberOfElementsContext } from "../AdminPanel";

import { lastPathPart } from "../../../utils/utils";
import { movies, url } from "../../../utils/api";

const Movies = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { numberOfElementsChanged } = useContext(NumberOfElementsContext);
    const [numberOfElements, setNumberOfElements] = useState({ drafts: 0, currently: 0, upcoming: 0, archived: 0 })
    const [selectedTab, setSelectedTab] = useState(lastPathPart(location.pathname) || 'drafts');

    const navigateToTab = (tab) => {
        setSelectedTab(tab);
        navigate(`/admin-panel/movies/${tab}`);
    };

    const getNumberOfElements = async () => {
        try {
            const result = await axios.get(`${url}${movies}/count-elements`);
            setNumberOfElements(result.data);
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getNumberOfElements()
    }, [numberOfElementsChanged])

    return (
        <div className="pt-32 px-40 font-body text-neutral-800 w-full">
            <div className="flex">
                <p className="text-heading-h6 pb-16 flex-1">Movies</p>
                <Button onClick={ () => navigate('/admin-panel/add-movie', { state: { from: location.pathname } }) }>Add Movie</Button>
            </div>
            <TabGroup selected={ selectedTab } onChange={ navigateToTab }>
                <Tab value="drafts">Drafts ({ numberOfElements.drafts })</Tab>
                <Tab value="currently">Currently Showing ({ numberOfElements.currently })</Tab>
                <Tab value="upcoming">Upcoming ({ numberOfElements.upcoming })</Tab>
                <Tab value="archived">Archived ({ numberOfElements.archived })</Tab>
            </TabGroup>

            <TabContent>
                <Outlet />
            </TabContent>
        </div>
    );
};

export default Movies;

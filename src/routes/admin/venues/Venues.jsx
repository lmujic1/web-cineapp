import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import VenueCard from "../../../components/card/VenueCard";
import { url, venues } from "../../../utils/api";
import Button from "../../../components/Button";

const Venues = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [venueList, setVenueList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);
    const [maxPages, setMaxPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);

    const fetchResults = async () => {
        try {
            const response = await axios.get(url + venues + "?page=" + currentPage + "&size=" + postsPerPage);
            if (currentPage > 1)
                setVenueList(pre => [...pre, ...response.data.content]);
            else {
                setTotalPosts(response.data.totalElements);
                setMaxPages(response.data.totalPages);
                setVenueList(response.data.content);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [currentPage]);

    return (
        <div className="px-40 py-16">
            <div className="border-b border-b-neutral-200 py-16 flex">
                <p className="text-heading-h6 text-neutral-800 flex-1">Venues ({ totalPosts })</p>
                <Button onClick={ () => navigate('/admin-panel/add-venue', { state: { from: location.pathname } }) }>
                    Add Venue
                </Button>
            </div>
            <div className="px-64">
                <div className="grid gap-32 py-32 lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
                    { venueList.map((item, index) => {
                        return (
                            <VenueCard
                                className="cursor-pointer"
                                key={ index }
                                venue={ item }
                                onClick={ () => navigate('/admin-panel/add-venue', { state: { venue: item } }) }
                            />
                        );
                    }) }
                </div>
            </div>
            <div className="flex items-center justify-center pt-16 pb-32">
                { currentPage < maxPages &&
                    <Button variant="tertiary" onClick={ () => setCurrentPage(prev => prev + 1) }>Load More</Button>
                }
            </div>
        </div>
    );
}

export default Venues;

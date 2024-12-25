import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import VenueCard from "../../components/card/VenueCard";
import { List, ListItem } from "../../components/List";

const VenueList = (props) => {
    const route = props.route;
    const [venues, setVenues] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(4);
    const [maxPages, setMaxPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);

    const fetchResults = async () => {
        try {
            const response = await axios.get(route + "?page=" + currentPage + "&size=" + postsPerPage);
            setVenues(response.data.content);
            setTotalPosts(response.data.totalElements)
            setMaxPages(response.data.totalPages + 1)
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        fetchResults();
    }, [currentPage])

    const paginateFront = () => {
        setCurrentPage(prev => prev + 1);
    }

    const paginateBack = () => {
        setCurrentPage(prev => prev - 1);
    }

    return (
        <List postsPerPage={ postsPerPage } totalPosts={ totalPosts } paginateBack={ paginateBack } paginateFront={ paginateFront } currentPage={ currentPage } maxPages={ maxPages }>
            <div className="grid gap-16 py-32 lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2">
                { venues.map((item, index) => {
                    return (
                        <ListItem key={ index }>
                            <Link key={ index } to={ `/venue-details/${item.venueId}` }>
                                <VenueCard key={ index } venue={ item } />
                            </Link>
                        </ListItem>
                    )
                }) }
            </div>
        </List>
    )
}

export default VenueList;

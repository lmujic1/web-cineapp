import axios from "axios";
import { useState, useEffect } from "react";

import MovieCard from "../../components/card/MovieCard";
import { List, ListItem } from "../../components/List";

const MovieList = ({ ...props }) => {
    const route = props.route;
    const [data, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(4);
    const [maxPages, setMaxPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);

    const fetchResults = async () => {
        try {
            const response = await axios.get(route + "?page=" + currentPage + "&size=" + postsPerPage);
            setMovies(response.data.content);
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

    return data.length > 0 ? (
        <List postsPerPage={ postsPerPage } totalPosts={ totalPosts } paginateBack={ paginateBack } paginateFront={ paginateFront } currentPage={ currentPage } maxPages={ maxPages }>
            <div className="grid gap-16 py-32 lg:grid-cols-4 sm:grid-cols-1 md:grid-cols-2">
                { data.map((item, index) => {
                    return (
                        <ListItem key={ index }>
                            <MovieCard key={ index } movie={ item } images={ item.images } />
                        </ListItem>
                    )
                }) }
            </div>
        </List>
    ) : (<div className="py-[30px] text-primary-600"><b>Currently, there are no {props.type} movies to display. Please check back later for updates.</b></div>)
}

export default MovieList;

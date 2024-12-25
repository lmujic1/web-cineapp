import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { format } from "date-fns"

import Card from "../Card";
import Image from "../Image";
import Badge from "../Badge";

import { createClassName } from "../../utils/utils";

const CurrentlyShowingCard = ({ className, ...props }) => {
    const movie = props.movie;
    const images = props.images;
    const movieProjections = props.projections;
    const genres = props.genres;
    const [cover, setCover] = useState();

    function getCover() {
        images.forEach(element => {
            if (element.cover) {
                setCover(element.link)
            }
        });
    }

    function getProjectionTimes() {
        return [...new Set(movieProjections?.map(projection => projection.time))].sort()
    }

    function getGenres() {
        return genres?.map((genre) => genre.name).sort()
    }

    useEffect(() => {
        getCover();
    }, [movie])

    return (
        <Link to={ `/movie-details/${movie.movieId}` }>
            <Card className={ createClassName("lg:h-[318px] md:h-[450px] sm:h-[450px] py-4 px-8 cursor-pointer", className) }>
                <div className="grid lg:grid-cols-4 gap-24 p-[10px]">
                    <Image className="w-[96%] h-[287px] rounded-16 object-cover" src={ cover } alt="Movie cover" />
                    <div className="text-neutral-800 mr-24 relative">
                        <p className="text-heading-h4 pb-8">{ movie.name }</p>
                        <div className="flex text-body-l font-normal pt-[10px] pb-[6px]">
                            <p className="border-primary-600 h-[20px] pr-12 border-r">{ movie.rating }</p>
                            <p className="border-primary-600 h-[20px] px-12 border-r">{ movie.language }</p>
                            <p className="pl-12">{ movie.duration } Min</p>
                        </div>
                        <div className="flex gap-16 py-8">
                            { getGenres()?.map((genre, index) => {
                                return <Badge key={ index }>{ genre }</Badge>
                            }) }
                        </div>
                        <p className="absolute bottom-0 text-body-m italic text-neutral-500">Playing in cinema until { format(movie.projectionEnd, "dd.MM.yyyy.") }</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-heading-h6 text-primary-600 py-12">Showtimes</p>
                        <div className="flex gap-12">
                            { getProjectionTimes()?.map((projection, index) => {
                                return (
                                    <div key={ index } className="p-[10px] text-heading-h6 border rounded-8 shadow-light-50 bg-neutral-0 border-neutral-200 text-neutral-800 hover:bg-primary-600 hover:!text-neutral-25 hover:border-primary-600 cursor-pointer">
                                        { projection.slice(0, 5) }
                                    </div>
                                )
                            }) }
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export default CurrentlyShowingCard;

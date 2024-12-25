import Badge from "../Badge";
import Button from "../Button";
import { Carousel, CarouselItem } from "../Carousel";
import Image from "../Image";

const CoverCarousel = ({ movies }) => {
    return (
        <Carousel covers={ true } navigation={ true }>
            { movies.map((slide, index) => {
                return (
                    <CarouselItem key={ index }>
                        { slide.images.map((img) => {
                            if (img.cover) return (
                                <Image key={ img.link } className="w-full object-cover h-[750px]" src={ img.link } alt="slika" />
                            )
                        }) }
                        <div className="absolute top-[376px] w-[45%] gap-32 left-[118px] font-body text-neutral-25">
                            <div>
                                <Badge>{ slide.genres[0].name }</Badge>
                            </div>
                            <h2 className="text-heading-h2 mb-12 mt-12">{ slide.name }</h2>
                            <p className="text-heading-h6">{ slide.synopsis }</p>
                            <Button variant="primary" className="mt-24">Buy Ticket</Button>
                        </div>
                    </CarouselItem>
                )
            }) }
        </Carousel>
    )
}

export default CoverCarousel;

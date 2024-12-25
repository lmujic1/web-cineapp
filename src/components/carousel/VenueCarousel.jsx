import Badge from "../Badge";
import { Carousel, CarouselItem } from "../Carousel";

const VenueCarousel = ({ venues }) => {
  return (
    <Carousel covers={ false }>
      { venues.map((item, index) => {
        return (
          <CarouselItem key={ index }>
            <Badge key={ index } className="border !text-neutral-400 !bg-neutral-25 !border-neutral-200 !py-32 !px-16">
              <p className="text-heading-h5">
                { item.name }
              </p>
            </Badge>
          </CarouselItem>
        )
      }) }
    </Carousel>
  )
}

export default VenueCarousel;

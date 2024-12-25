import MovieTable from './MovieTable';

const Upcoming = () => {
    return (
        <div>
            <MovieTable type="upcoming" selectable actions />
        </div>
    );
};

export default Upcoming;

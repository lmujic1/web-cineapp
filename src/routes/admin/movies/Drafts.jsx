import MovieTable from './MovieTable';

const Drafts = () => {
    return (
        <div>
            <MovieTable type="drafts" selectable actions />
        </div>
    );
};

export default Drafts;

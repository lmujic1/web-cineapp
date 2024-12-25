import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

import { Input } from "../Input";
import Label from "../Label";
import DateRangePicker from "../DateRangePicker";
import { MultiSelect, MultiSelectItem } from "../MultiSelect";
import { StepperContext } from "../Stepper";

const General = ({ genreList }) => {
    const { movieData, setMovieData } = useContext(StepperContext);
    const [movieDataFocused, setMovieDataFocused] = useState({});

    useEffect(() => {
        if (movieData.status === undefined) {
            setMovieData({ ...movieData, ["status"]: "DRAFT" });
        }
    }, [movieData]);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        if (newText.length <= 500) {
            setMovieData({ ...movieData, ["synopsis"]: newText });
        }
    };

    const handleSelectGenres = (values) => {
        setMovieData({ ...movieData, genres: values.map(id => Number(id)) });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovieData({ ...movieData, [name]: value });
    };

    const handleDurationChange = (e) => {
        setMovieData({ ...movieData, ["duration"]: Number(e.target.value) });
    }

    const onFocus = (fieldsAndValues) => {
        const updatedParams = { ...movieDataFocused, ...fieldsAndValues };
        setMovieDataFocused(updatedParams);
    };

    const onBlur = (fieldsAndValues) => {
        const updatedParams = { ...movieDataFocused, ...fieldsAndValues };
        setMovieDataFocused(updatedParams);
    };

    const getAllGenres = () => {
        const genreNames = movieData.genres.map(id => {
            const genre = genreList.find(genre => genre.id === id);
            return genre ? genre.name : '';
        }).filter(Boolean);

        if (genreNames.length <= 6) {
            return genreNames.join(', ');
        } else {
            const displayedGenres = genreNames.slice(0, 6);
            const remainingCount = genreNames.length - 6;
            return `${displayedGenres.join(', ')} +${remainingCount}`;
        }
    };

    const genreLabel = (
        <Label
            label="Genre"
            className="mb-24 !text-neutral-700"
            leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faFilm } /> }
            rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
        >
            { movieData.genres?.length > 0 ? getAllGenres() : "Choose genre" }
        </Label>
    );

    const dateRangeLabel = (
        <Label
            className="mb-24 !text-neutral-700"
            label="Projection Date"
            leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faCalendarDays } /> }
            rightIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faChevronDown } /> }
        >
            { movieData["projectionStart"] ? `${format(new Date(movieData["projectionStart"]), 'yyyy/MM/dd')} - ${format(new Date(movieData["projectionEnd"]), 'yyyy/MM/dd')}` : "Choose projection date" }
        </Label>
    );

    return (
        <div>
            <div className="grid grid-cols-2 gap-16">
                <div>
                    <Label
                        label="Movie Name"
                        value={ movieData["name"] }
                        className="mb-24 !text-neutral-700"
                        leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faFilm } /> }
                        active={ movieDataFocused.name }
                    >
                        <Input
                            name="name"
                            text="Type movie name"
                            value={ movieData["name"] || "" }
                            onChange={ handleChange }
                            onFocus={ () => onFocus({ name: true }) }
                            onBlur={ () => onBlur({ name: false }) }
                        />
                    </Label>
                    <Label
                        label="Language"
                        value={ movieData["language"] || "" }
                        className="mb-24 !text-neutral-700"
                        leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faLanguage } /> }
                        active={ movieDataFocused.language }
                    >
                        <Input
                            name="language"
                            value={ movieData["language"] || "" }
                            text="Type language"
                            onChange={ handleChange }
                            onFocus={ () => onFocus({ language: true }) }
                            onBlur={ () => onBlur({ language: false }) }
                        />
                    </Label>
                    <DateRangePicker
                        label={ dateRangeLabel }
                        startDate={ movieData.projectionStart ? new Date(movieData.projectionStart) : null }
                        endDate={ movieData.projectionEnd ? new Date(movieData.projectionEnd) : null }
                        minDate={ new Date() }
                        onClickApply={
                            (valueStart, valueEnd) => {
                                setMovieData((prevState) => ({
                                    ...prevState,
                                    ["projectionStart"]: format(valueStart, 'yyyy-MM-dd'),
                                    ["projectionEnd"]: format(valueEnd, 'yyyy-MM-dd')
                                }));
                            }
                        }
                        onClickCancel={
                            () => {
                                setMovieData((prevState) => {
                                    const { projectionStart, projectionEnd, ...rest } = prevState;
                                    return rest;
                                });
                            }
                        }
                    />
                    <Label
                        label="Director"
                        value={ movieData["director"] || "" }
                        className="mb-24 !text-neutral-700"
                        leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faUser } /> }
                        active={ movieDataFocused.director }
                    >
                        <Input
                            name="director"
                            value={ movieData["director"] || "" }
                            text="Add director"
                            onChange={ handleChange }
                            onFocus={ () => onFocus({ director: true }) }
                            onBlur={ () => onBlur({ director: false }) }
                        />
                    </Label>
                </div>
                <div>
                    <Label
                        label="PG Rating"
                        value={ movieData["rating"] || "" }
                        className="mb-24 !text-neutral-700"
                        leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faR } /> }
                        active={ movieDataFocused.rating }
                    >
                        <Input
                            name="rating"
                            value={ movieData["rating"] || "" }
                            text="Type PG rating"
                            onChange={ handleChange }
                            onFocus={ () => onFocus({ rating: true }) }
                            onBlur={ () => onBlur({ rating: false }) }
                        />
                    </Label>
                    <Label
                        label="Movie Duration"
                        value={ movieData["duration"] || "" }
                        className="mb-24 !text-neutral-700"
                        leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faClock } /> }
                        active={ movieDataFocused.duration }
                    >
                        <Input
                            name="duration"
                            value={ movieData["duration"] || "" }
                            text="Type movie duration"
                            onChange={ handleDurationChange }
                            onFocus={ () => onFocus({ duration: true }) }
                            onBlur={ () => onBlur({ duration: false }) }
                        />
                    </Label>
                    <MultiSelect
                        label={ genreLabel }
                        selectedValues={ movieData.genres || [] }
                        onClick={ handleSelectGenres }
                    >
                        { genreList.map((genre, index) => (
                            <MultiSelectItem key={ index } value={ genre.id }>
                                { genre.name }
                            </MultiSelectItem>
                        )) }
                    </MultiSelect>
                    <Label
                        label="Trailer"
                        value={ movieData["trailer"] }
                        className="mb-24 !text-neutral-700"
                        leftIcon={ <FontAwesomeIcon className="w-5 h-5" icon={ fas.faLink } /> }
                        active={ movieDataFocused.trailer }
                    >
                        <Input
                            name="trailer"
                            text="Insert trailer link"
                            value={ movieData["trailer"] || "" }
                            onChange={ handleChange }
                            onFocus={ () => onFocus({ trailer: true }) }
                            onBlur={ () => onBlur({ trailer: false }) }
                        />
                    </Label>
                </div>
            </div>
            <Label
                label="Synopsis"
                className="mb-24 !text-neutral-700"
                leftIcon={ <FontAwesomeIcon icon={ fas.faT }></FontAwesomeIcon> }
                value={ movieData.synopsis }
                active={ movieDataFocused.text }
            >
                <textarea
                    value={ movieData.synopsis }
                    onChange={ handleTextChange }
                    placeholder="Write synopsis"
                    maxLength={ 500 }
                    onFocus={ () => onFocus({ text: true }) }
                    onBlur={ () => onBlur({ text: false }) }
                    rows={ 4 }
                    cols={ 150 }
                    style={ { resize: "none", outlineColor: "transparent" } }
                />
                <div style={ { textAlign: "right", fontSize: "0.8rem", color: "inherit" } }>
                    { movieData.synopsis ? movieData.synopsis.length : 0 }/{ 500 }
                </div>
            </Label>
        </div>
    );
}

export default General;

import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

import Button from "./Button";
import { Checkbox, FileInput } from "./Input";

const UploadImages = ({ files, onFileChange, onRemove }) => {
    const inputRef = useRef();
    const individualInputRefs = useRef([]);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files).slice(0, 4).map(file => ({ file, cover: false, link: null, id: null }));
            if (!selectedFiles.some(file => file.cover)) {
                selectedFiles[0].cover = true;
            }
            onFileChange(selectedFiles);
        }
    };

    const handleIndividualChange = (e, index) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = [...files];
            newFiles[index] = { file: e.target.files[0], cover: index === 0, link: null, id: null };
            if (index === 0 || !newFiles.some(file => file.cover)) {
                newFiles[0].cover = true;
            }
            onFileChange(newFiles);
        }
    };

    const handleCoverChange = (index) => {
        const newFiles = files.map((file, i) => ({ ...file, cover: i === index }));
        onFileChange(newFiles);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const onChooseIndividualFile = (index) => {
        if (individualInputRefs.current[index]) {
            individualInputRefs.current[index].click();
        }
    };

    const setInputRef = (el, index) => {
        if (el) {
            individualInputRefs.current[index] = el;
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        if (files.length === 0) {
            setIsDraggingOver(true);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (files.length === 0) {
            setIsDraggingOver(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (!files || files.length === 0) {
            const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 4).map((file, index) => ({
                file,
                cover: index === 0,
                link: null,
            }));
            onFileChange(droppedFiles);
        }
    };

    const renderFile = (index, file, isExisting, placeholder) => (
        <div className={ `flex flex-col w-full py-16 ${index === 0 ? "pl-16" : "pl-8"} ${index === 3 ? "pr-16" : "pr-8"}` }>
            <div className="rounded-16 relative">
                <FileInput
                    accept="image/*"
                    onChange={ (e) => handleIndividualChange(e, index) }
                    className="hidden"
                    ref={ (el) => setInputRef(el, index) }
                />
                <img
                    className={ `w-full h-[240px] rounded-16 object-cover ${placeholder ? 'opacity-60' : ''}` }
                    src={ placeholder ? "/placeholder.png" : isExisting ? file.link : URL.createObjectURL(file.file) }
                    alt={ placeholder ? "" : `Uploaded ${index + 1}` }
                />
                <div className="bg-neutral-800 bg-opacity-80 absolute top-[80%] rounded-b-16 w-full flex justify-center">
                    <Button
                        variant="tertiary"
                        className="!text-neutral-0 !font-normal"
                        onClick={ () => onChooseIndividualFile(index) }
                    >
                        Upload Image
                    </Button>
                </div>
            </div>
            <div className="flex pt-16 gap-12">
                <div className="flex-1" onClick={ () => { if (!placeholder) handleCoverChange(index) } }>
                    <Checkbox
                        isChecked={ file.cover || false }
                        rounded
                        className={ `${placeholder ? "cursor-not-allowed" : "cursor-pointer"}` }
                    >
                        Cover Image
                    </Checkbox>
                </div>
                <FontAwesomeIcon
                    className="text-primary-600 cursor-pointer"
                    icon={ faTrash }
                    onClick={ () => {
                        if (!placeholder) {
                            if (files[index].id) onRemove(files[index].id)
                            const newFiles = files.filter((_, i) => i !== index);
                            if (newFiles.length > 0 && !newFiles.some(file => file.cover)) {
                                newFiles[0].cover = true;
                            }
                            onFileChange(newFiles);
                        }
                    } }
                />
            </div>
        </div>
    );

    return (
        <>
            <div className="flex pr-24">
                <p className="text-body-l font-semibold mt-24 mb-8">Upload Images</p>
            </div>
            <div
                className={ `relative border border-neutral-200 rounded-16 min-h-160 flex items-center justify-center ${isDraggingOver ? "bg-neutral-200" : ""}` }
                onDragEnter={ handleDragEnter }
                onDragOver={ handleDragOver }
                onDragLeave={ handleDragLeave }
                onDrop={ handleDrop }
            >
                { files && files.length > 0 ? (
                    <div className="grid grid-cols-4">
                        { Array.from({ length: 4 }).map((_, index) => (
                            <div key={ index }>
                                { files[index]
                                    ? files[index].link !== null
                                        ? renderFile(index, files[index], true, false)
                                        : renderFile(index, files[index], false, false)
                                    : renderFile(index, {}, false, true) }
                            </div>
                        )) }
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <FileInput
                            accept="image/*"
                            onChange={ handleChange }
                            className="hidden"
                            ref={ inputRef }
                            multiple
                        />
                        <Button variant="tertiary" onClick={ onChooseFile }>
                            <FontAwesomeIcon icon={ faPlus } /> Upload Images
                        </Button>
                        <div className="text-neutral-500 text-body-m text-center">
                            or just drag and drop
                            <br /> <p className="mt-8">* Add up to 4 Images </p>
                        </div>
                    </div>
                ) }
            </div>
        </>
    );
};

export default UploadImages;

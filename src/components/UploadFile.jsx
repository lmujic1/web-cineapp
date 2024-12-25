import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import { FileInput } from "./Input";

const UploadFile = ({ file, text, onFileChange, onRemove, names }) => {
    const inputRef = useRef();

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            onFileChange(selectedFile);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div>
            <div className="flex pr-24">
                <p className="flex-1 text-body-l font-semibold mb-8">{ text }</p>
                { (file || names.length > 0) && (
                    <FontAwesomeIcon
                        className="text-primary-600 cursor-pointer"
                        icon={ faTrash }
                        onClick={ () => onRemove() }
                    />
                ) }
            </div>
            <div className="border border-neutral-200 bg-neutral-0 rounded-16 h-160 mr-24">
                { file === null && names.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <FileInput
                            accept=".csv,text/csv"
                            onChange={ handleChange }
                            className="hidden"
                            ref={ inputRef }
                        />
                        <Button variant="tertiary" onClick={ onChooseFile }>
                            <FontAwesomeIcon icon={ faPlus } />
                            Upload { text } via CSV
                        </Button>
                    </div>
                ) : (
                    <>
                        { file ? (
                            <p className="p-12">{ file.name }</p>
                        ) : (
                            <div className="text-body-m font-semibold p-12 grid grid-cols-3 gap-12">
                                { names.map((name, index) => (
                                    <p key={ index } className="pb-12">
                                        { name.firstName } { name.lastName }
                                        <br />
                                        <span className="text-body-s text-neutral-500 font-normal">{ name.role }</span>
                                    </p>
                                )) }
                            </div>
                        ) }
                    </>
                ) }
            </div>
        </div>
    );
};

export default UploadFile;

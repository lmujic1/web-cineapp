import { useState, useEffect, cloneElement, Children } from "react";

import { Dropdown, DropdownItem } from "./Dropdown";
import { Checkbox } from "./Input";

import { createClassName, useOutsideClick } from "../utils/utils";

const MultiSelect = ({ className, children, label, selectedValues, onClick }) => {
    const [open, setOpen] = useState(false);
    const [internalSelectedValues, setInternalSelectedValues] = useState([]);

    useEffect(() => {
        setInternalSelectedValues(selectedValues);
    }, [selectedValues]);

    const ref = useOutsideClick(() => { setOpen(false) });

    const handleSelect = (val) => {
        const newValues = internalSelectedValues.includes(val)
            ? internalSelectedValues.filter((v) => v !== val)
            : [...internalSelectedValues, val];
        setInternalSelectedValues(newValues);
        onClick(newValues);
    };

    return (
        <div className={ createClassName("w-full relative flex items-center justify-between py-3", className) } ref={ ref }>
            <div className={ createClassName("w-full", className) } onClick={ () => setOpen(!open) }>
                { label ? cloneElement(label, { active: open, value: internalSelectedValues.length > 0 ? internalSelectedValues : null }) : null }
            </div>
            { open && (
                <Dropdown className="overflow-y-scroll w-full top-[85%]" onClick={ () => setOpen(!open) }>
                    { Children.map(children, (child) =>
                        cloneElement(child, {
                            onClick: () => handleSelect(child.props.value),
                            isChecked: internalSelectedValues.includes(child.props.value),
                        })
                    ) }
                </Dropdown>
            ) }
        </div>
    );
}

const MultiSelectItem = ({ className, children, onClick, value, isChecked }) => {
    return (
        <DropdownItem className={ createClassName("items-center gap-4", className) } onClick={ onClick } value={ value }>
            <Checkbox isChecked={ isChecked } />
            { children }
        </DropdownItem>
    );
}

export { MultiSelect, MultiSelectItem };

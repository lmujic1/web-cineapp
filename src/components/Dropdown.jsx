import { useState, cloneElement } from "react";

import { createClassName, useOutsideClick } from "../utils/utils";

const Dropdown = ({ className, children }) => {
    return (
        <div className={ createClassName("absolute top-[110%] bg-neutral-0 z-50 border border-neutral-200 rounded-12 max-h-[220px] p-8", className) }>
            { children }
        </div>
    )
}

const DropdownItem = ({ className, children, onClick }) => {
    return (
        <div className={ createClassName("text-neutral-900 flex capitalize hover:bg-neutral-100 rounded-8 px-12 py-8 cursor-pointer", className) } onClick={ onClick }>{ children }</div>
    )
}

const LabeledDropdown = ({ className, children, label, value }) => {
    const [open, setOpen] = useState(false);

    const ref = useOutsideClick(() => { setOpen(false) })

    return (
        <div
            onClick={ () => setOpen(!open) }
            className={ createClassName("w-full relative flex items-center justify-between py-3", className) }
            ref={ ref }
        >
            { label ? cloneElement(label, { active: open, value: value }) : null }
            { open && (
                <Dropdown className="overflow-y-scroll w-full" onClick={ () => setOpen(!open) }>
                    { children }
                </Dropdown>
            ) }
        </div>
    )
}

export { Dropdown, DropdownItem, LabeledDropdown };

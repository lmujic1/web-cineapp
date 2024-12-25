import { Children, cloneElement } from "react";

const TabGroup = ({ children, selected, onChange }) => {
    return (
        <div className="flex gap-16 border-b border-neutral-200 w-full">
            { Children.map(children, child =>
                cloneElement(child, { selected, onChange })
            ) }
        </div>
    );
}

const Tab = ({ children, onChange, value, selected }) => {
    const handleClick = () => {
        if (onChange) {
            onChange(value);
        }
    }

    return (
        <div
            onClick={ handleClick }
            className={ `text-body-l pb-4 cursor-pointer ${selected === value ? 'border-b border-primary-600 text-primary-600 font-semibold' : ''}` }
        >
            { children }
        </div>
    );
}

const TabContent = ({ children }) => {
    return (
        <div className="py-24">
            { children }
        </div>
    );
}

export { Tab, TabGroup, TabContent };

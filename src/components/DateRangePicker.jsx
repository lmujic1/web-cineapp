import { useState, useEffect, cloneElement } from "react";
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import Button from "./Button";
import { createClassName, useOutsideClick } from "../utils/utils";

const DateRangePicker = ({ className, onClickApply, startDate, endDate, onClickCancel, label, minDate }) => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState([
        {
            startDate: startDate || null,
            endDate: endDate || new Date(""),
            key: "selection",
            color: "#B22222"
        }
    ]);

    const ref = useOutsideClick(() => { setOpen(false) });

    useEffect(() => {
        setState([
            {
                startDate: startDate || null,
                endDate: endDate || new Date(""),
                key: "selection",
                color: "#B22222"
            }
        ]);
    }, [startDate, endDate]);

    return (
        <div className={ createClassName("relative", className) }
            ref={ ref }>
            <div onClick={ () => { setOpen(!open) } }>
                { cloneElement(label, { active: open, value: state[0].startDate }) }
            </div>
            { open && (
                <div className="flex flex-col absolute top-[110%] h-[415px] bg-neutral-0 rounded-12 z-50 shadow-light-200 border border-neutral-200">
                    <div className="pt-8">
                        <DateRange
                            className="rounded-8 font-body"
                            editableDateInputs={ true }
                            dateDisplayFormat="yyyy/MM/dd"
                            moveRangeOnFirstSelection={ false }
                            onChange={ item => setState([item.selection]) }
                            minDate={ minDate }
                            ranges={ state }
                        />
                        <Button
                            className="absolute top-[355px] right-16"
                            size="sm"
                            onClick={ () => { onClickApply(state[0].startDate, state[0].endDate); setOpen(false); } }
                        >
                            Apply
                        </Button>
                        <Button
                            className="absolute top-[355px] right-96"
                            variant="secondary"
                            size="sm"
                            onClick={ () => {
                                setState([{
                                    startDate: null,
                                    endDate: new Date(""),
                                    key: "selection",
                                    color: "#B22222"
                                }]);
                                onClickCancel();
                                setOpen(false);
                            } }
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) }
        </div>
    );
};

export default DateRangePicker;

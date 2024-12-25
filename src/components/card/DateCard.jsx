import { format } from "date-fns";

import Card from "../Card";

import { createClassName } from "../../utils/utils";

const DateCard = ({ className, onClick, ...props }) => {
    const date = props.date;
    const value = props.value;
    const today = new Date();

    return (
        <Card onClick={ onClick } className={ createClassName("flex flex-col items-center justify-center h-[84px] rounded-8 shadow-light-50", className) }>
            <div className="flex">
                <p className="text-body-l font-semibold">{ format(date, "MMM") }</p>
                &nbsp;
                <p className="text-body-l font-semibold">{ date.getDate() }</p>
            </div>
            <p>{ date.getDate() === today.getDate() && date.getMonth() === today.getMonth() ? "Today" : format(date, "EEE") }</p>
        </Card>
    )
}

export default DateCard;

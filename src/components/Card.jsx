import { createClassName } from "../utils/utils";

const Card = ({ className, children, onClick }) => {
    return (
        <div onClick={ onClick } className={ createClassName("font-body gap-0 bg-neutral-0 rounded-24 border border-solid border-neutral-200 text-neutral-800 shadow-light-100", className) }>
            { children }
        </div>
    )
}

export default Card;

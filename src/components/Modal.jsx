import { createClassName } from "../utils/utils";

const Modal = ({ className, children }) => {
    return (
        <div className={ createClassName("w-[100vw] h-[100vh] top-0 left-0 bottom-0 right-0 fixed", className) }>
            <div className="w-[100vw] h-[100vh] top-0 left-0 bottom-0 right-0 fixed bg-neutral-900 bg-opacity-15">
                <div className="absolute top-[35%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-neutral-0 p-24 pb-32 rounded-12 shadow-light-50 max-w-[400px] min-w-[300px]">
                    { children }
                </div>
            </div>
        </div>
    )
}

export default Modal;

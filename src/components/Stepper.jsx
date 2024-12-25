import { useState, useEffect, useRef, createContext } from "react";

export const StepperContext = createContext(null);

const Stepper = ({ steps, currentStep, stepStatus }) => {
    const [newStep, setNewStep] = useState([]);
    const stepRef = useRef();

    const updateStep = (stepNumber, steps) => {
        const newSteps = [...steps];
        let count = 0;
        while (count < newSteps.length) {
            if (count === stepNumber) {
                newSteps[count] = {
                    ...newSteps[count],
                    highlited: false,
                    selected: true,
                    completed: stepStatus[count + 1],
                };
                count++;
            } else if (count < stepNumber) {
                newSteps[count] = {
                    ...newSteps[count],
                    highlited: true,
                    selected: true,
                    completed: true,
                };
                count++;
            } else {
                newSteps[count] = {
                    ...newSteps[count],
                    highlited: false,
                    selected: false,
                    completed: false,
                };
                count++;
            }
        }
        return newSteps;
    };

    useEffect(() => {
        const stepsState = steps.map((step, index) =>
            Object.assign({}, {
                description: step,
                completed: false,
                highlited: index === 0 ? true : false,
                selected: index === 0 ? true : false,
            })
        );
        stepRef.current = stepsState;
        const current = updateStep(currentStep - 1, stepRef.current);
        setNewStep(current);
    }, [steps, currentStep, stepStatus]);

    const displaySteps = newStep.map((step, index) => {
        return (
            <div key={ index } className={ index !== newStep.length - 1 ? "w-full flex items-center" : "flex items-center" } >
                <div className="relative flex flex-col items-center text-neutral-500">
                    <div className={ `rounded-full text-heading-h6 transition duration-500 ease-in-out border-2 border-neutral-500 h-40 w-40 flex items-center justify-center ${step.selected && !step.completed ? "border-primary-600 text-primary-600" : ""} ${step.completed ? "bg-primary-600 border-primary-600 text-primary-25" : ""}` }>
                        { index + 1 }
                    </div>
                    <div className={ `absolute top-0 text-center mt-[56px] w-128 text-body-l font-semibold capitalize ${step.completed ? "text-neutral-800" : ""}` }>
                        { step.description }
                    </div>
                </div>
                <div className={ `flex-auto border-t-2 transition duration-500 ease-in-out ${step.highlited ? "border-primary-600" : "border-neutral-200"}` }></div>
            </div>
        );
    });

    return (
        <div className="flex items-center justify-center pt-24 pb-64">
            <div className="w-[70%] flex justify-center items-center">
                { displaySteps }
            </div>
        </div>
    );
};

export default Stepper;

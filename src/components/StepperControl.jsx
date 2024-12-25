import { useContext } from "react";
import Button from "./Button";
import { StepperContext } from "./Stepper";

const StepperControl = ({ handleClick, currentStep, steps, saveToDraft, disableAdd, stepStatus }) => {
    const isContinueDisabled = !stepStatus[currentStep];
    const { movieData } = useContext(StepperContext);

    return (
        <div className="flex mt-24 mb-32">
            <div className="flex-1">
                <Button onClick={ () => handleClick("back") } disabled={ currentStep === 1 } variant="tertiary" className={ `!justify-start` }>Back</Button>
            </div>
            <div className="flex gap-16">
                <Button variant="secondary" onClick={ () => saveToDraft() }>Save to Drafts</Button>
                <Button onClick={ () => {
                    if (currentStep === steps.length) saveToDraft()
                    else handleClick("continue")
                } } disabled={ currentStep === steps.length && disableAdd || isContinueDisabled }>
                    { currentStep === steps.length ? movieData.id ? "Save changes" : "Add Movie" : "Continue" }</Button>
            </div>
        </div>
    )
}

export default StepperControl;

import { useNavigate } from "react-router-dom"
import Button from "../../components/Button";

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className="px-[118px] text-body-l font-body pt-40">
            <p className="text-heading-h6 text-neutral-800">Unauthorized</p>
            <br />
            <p className="font-semibold">You do not have access to the requested page.</p>
            <br />
            <Button onClick={ goBack }>Go Back</Button>
        </div>
    )
}

export default Unauthorized;

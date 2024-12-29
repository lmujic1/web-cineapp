import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Dropdown, DropdownItem } from "../../components/Dropdown";

import { logout } from "../../utils/api";

const UserOptions = ({ setUserClick }) => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole')

    const onFinish = async () => {
        const token = localStorage.getItem('token');

        try {
            // const response = await axios.post( logout, {}, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // });
            // if (response.status === 200) {
                localStorage.clear()
                navigate('/')
                setUserClick(false)
            // }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dropdown className="w-[300px] right-[118px]">
            <DropdownItem key="user-profile" onClick={ () => { navigate("/user-profile/info"); setUserClick(false) } }>Profile</DropdownItem>
            { (userRole === 'ADMIN' || userRole === 'SUPERADMIN' ) && <DropdownItem key="admin-panel" onClick={ () => { navigate("/admin-panel/movies/drafts"); setUserClick(false) } }>Admin</DropdownItem> }
            <DropdownItem key="log-out" className="text-primary-600 z-50" onClick={ onFinish }>Log Out</DropdownItem>
        </Dropdown>
    )
}

export default UserOptions;

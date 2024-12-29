import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { superAdmin } from "../../../utils/api";
import Button from "../../../components/Button";
import { List, ListItem } from "../../../components/List";
import UserTable from "./UserTable";

const Users = () => {
    const navigate = useNavigate();
    const location = useLocation();



    return (
        <div className="px-40 py-16">
            <div className="border-b border-b-neutral-200 py-16 flex">
                <p className="text-heading-h6 text-neutral-800 flex-1">Users</p>
                <Button onClick={ () => navigate('/admin-panel/add-admin', { state: { from: location.pathname } }) }>
                    Add Admin
                </Button>
            </div>

           <UserTable selectable actions></UserTable>
        </div>
    );
}

export default Users;

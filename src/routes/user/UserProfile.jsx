import { useState, useEffect, createContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faFilm, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import SideBar from "../../components/SideBar";

import { reservation, url } from "../../utils/api";

export const NumberOfElementsContext = createContext();

const UserProfile = () => {
    const [numberOfReservations, setNumberOfReservations] = useState(0);

    const getNumberOfReservations = async () => {
        const token = localStorage.getItem("token");
        try {
            const result = await axios.get(`${url}${reservation}/user/count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNumberOfReservations(result.data);
        } catch (err) {
            console.log("Error fetching reservations count:", err);
        }
    }

    useEffect(() => {
        getNumberOfReservations()
    }, [numberOfReservations])

    return (
        <div className="flex font-body text-body-l">
            <SideBar position="left" className="w-[264px] flex flex-col gap-32 p-32 text-neutral-300">
                <div className="text-heading-h5 pb-40 text-neutral-25">User Profile</div>
                <div className="flex items-center justify-center gap-12">
                    <p className="text-body-s">General</p>
                    <div className="bg-neutral-400 h-[1px] w-full" > </div>
                </div>
                <NavLink
                    to="/user-profile/info"
                    className={ ({ isActive }) => isActive ? "font-semibold text-neutral-0 shadow-light-400 underline" : "" }
                >
                    <FontAwesomeIcon icon={ faUser } />
                    <span className="pl-4">Personal Information</span>
                </NavLink>
                <NavLink
                    to="/user-profile/password"
                    className={ ({ isActive }) => isActive ? "font-semibold text-neutral-0 shadow-light-400 underline" : "" }
                >
                    <FontAwesomeIcon icon={ faLock } />
                    <span className="pl-8">Password</span>
                </NavLink>

                <div className="flex items-center justify-center gap-12">
                    <p className="text-body-s">Movies</p>
                    <div className="bg-neutral-400 h-[1px] w-full" />
                </div>
                <NavLink
                    to="/user-profile/reservations"
                    className={ ({ isActive }) => isActive ? "font-semibold text-neutral-0 shadow-light-400 underline" : "" }
                >
                    <FontAwesomeIcon icon={ faClock } />
                    <span className="pl-4">Pending reservations ({ numberOfReservations })</span>
                </NavLink>
                <NavLink
                    to="/user-profile/projections/"
                    className={ ({ isActive }) => isActive ? "font-semibold text-neutral-0 shadow-light-400 underline" : "" }
                >
                    <FontAwesomeIcon icon={ faFilm } />
                    <span className="pl-8">Projections</span>
                </NavLink>
            </SideBar>
            <NumberOfElementsContext.Provider value={ {
                numberOfReservations,
                setNumberOfReservations
            } }>
                <div className="pl-[264px] w-full">
                    <Outlet />
                </div>
            </NumberOfElementsContext.Provider>
        </div>
    )
}

export default UserProfile;

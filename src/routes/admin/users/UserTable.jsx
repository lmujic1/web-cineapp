import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEllipsis, faTrash } from '@fortawesome/free-solid-svg-icons';

import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import Pagination from '../../../components/Pagination';
import Button from '../../../components/Button';
import { NoDataRow, Table, TableCell, TableHeaderCell, TableHeaderRow, TableRow } from '../../../components/Table';


import { url, superAdmin } from "../../../utils/api";
import { Dropdown, DropdownItem } from '../../../components/Dropdown';

const UserTable = ({ type, selectable = false, actions = false }) => {
    const navigate = useNavigate();
    const [user,setUser] = useState()
    const [userList, setUserList] = useState([]);
    const [showActions, setShowActions] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, size: 5 });
    const [showMenuIndex, setShowMenuIndex] = useState(null);
    const [maxPages, setMaxPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deactivateModal, setDeactivateModal] = useState(false);
    
    const paginateFront = () => {
            setPagination({ ...pagination, page: pagination.page + 1 });
    }

    const paginateBack = () => {
        setPagination({ ...pagination, page: pagination.page - 1 });
    }

    const handleItemsPerPage = (value) => {
        setPagination({ ...pagination, size: value });
    }

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(url + superAdmin + "/users?page=" + pagination.page + "&size=" + pagination.size, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserList([ ...response.data.content]);
            setTotalPosts(response.data.totalElements);
            setMaxPages(response.data.totalPages + 1);
        } catch (err) {
            console.log(err);
        }
    };

    const deactivateUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${url}${superAdmin}/user/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('res deactivate', response.data)
            setDeleteModal(false)
        } catch (err) {
            console.log(err);
        }
    }

    const handleDelete = (user) => {
        setShowActions(false)
        setUser(user)
        setDeleteModal(true)
    }

    const handleDeactivate = (user) => {
        setShowActions(false)
        setUser(user)
        setDeactivateModal(true)
    }

    const deleteUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${url}${superAdmin}/user/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('res delete', response.data)
            setDeleteModal(false)
            setUser(null)
        } catch (err) {
            console.log(err);
        }
    }



    useEffect(() => {
        fetchData()
    }, [pagination])


    return (
        <div>
            <Table className="mb-16">
                <thead>
                    <TableHeaderRow>
                        <TableHeaderCell>FirstName</TableHeaderCell>
                        <TableHeaderCell>LastName</TableHeaderCell>
                        <TableHeaderCell>Email</TableHeaderCell>
                        <TableHeaderCell>Role</TableHeaderCell>
                        <TableHeaderCell>Activity</TableHeaderCell>
                        {actions ? <TableHeaderCell>action</TableHeaderCell> : null}
                    </TableHeaderRow>
                </thead>
                <tbody>
                    {userList.length > 0 ? (
                        userList.map((user, i) => {
                            return (
                                <TableRow key={i} className={`cursor-pointer${i + 1 === userList.length ? " border-b-0" : ""}`} onClick={() => { if (selectable) {} }}>
                                    <TableCell className={`w-[180px]${i + 1 === userList.length ? " rounded-8" : ""}`}>
                                            {user.firstName}
                                    </TableCell>
                                    <TableCell className="w-[180px]">
                                        {user.lastName}
                                    </TableCell>
                                    <TableCell className="w-[200px]">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="w-[150px]">
                                        {user.role}
                                    </TableCell>
                                    <TableCell className="w-[200px]">
                                        {user.softDelete ? <Badge color='red'>DEACTIVATED</Badge> : <Badge color='green'>Active</Badge>}
                                    </TableCell>
                                    { actions ? (
                                            <TableCell className="w-[84px]" onClick={ (e) => e.stopPropagation() }>
                                                <div style={ { position: 'relative' } }>
                                                    <Button
                                                        variant="tertiary"
                                                        onClick={ () => { setShowActions(!showActions); setShowMenuIndex(i) } }
                                                    >
                                                        <FontAwesomeIcon icon={ faEllipsis } />
                                                    </Button>
                                                    { showActions && showMenuIndex === i && (
                                                        <Dropdown className="w-[300px] right-0">
                                                           <DropdownItem onClick={ () => handleDeactivate(user) }>Deactivate</DropdownItem>
                                                           <DropdownItem onClick={ () => handleDelete(user) }>Permanently delete</DropdownItem>
                                                        </Dropdown>
                                                    ) }
                                                </div>
                                            </TableCell>
                                        ) : null 
                                    }
                                </TableRow>
                            );
                        })
                    ) : (
                        <NoDataRow />
                    )}
                </tbody>
            </Table>
            <Pagination
                table
                postsPerPage={pagination.size}
                totalPosts={totalPosts}
                paginateBack={paginateBack}
                paginateFront={paginateFront}
                currentPage={pagination.page}
                maxPages={maxPages}
                itemsPerPage={[5, 10, 15, 20]}
                handleItemsPerPage={handleItemsPerPage}
            />

            {deleteModal && (
                <Modal>
                    <p className="text-heading-h6 text-neutral-900 pb-16">Confirm Deletion</p>
                    <p className="text-body-m text-neutral-500 text-justify">
                        Are you sure you want to permanently delete this user?
                        <br /><br />
                        Name: {user.firstName} {user.lastName}
                        <br />
                        Email: {user.email}
                        <br /><br />
                        This action is irreversible and will result in the permanent removal of the user's profile and all associated data from the system.
                    </p>
                    <div className="flex pt-32 gap-8 justify-end">
                        <Button variant="secondary" size="sm" onClick={() => { setDeleteModal(false); setUser(null)}}>Cancel</Button>
                        <Button size="sm" onClick={() => deleteUser() }>Delete</Button>
                    </div>
                </Modal>
            )}

            { deactivateModal && (
                <Modal>
                    <p className="text-heading-h6 text-neutral-900 pb-16">Confirm Deactivation</p>
                    <p className="text-body-m text-neutral-500 text-justify">
                        Are you sure you want to deactivate account for user <b>{user.firstName} {user.lastName}</b>?
                        <br /><br />
                    </p>
                    <div className="flex pt-32 gap-8 justify-end">
                        <Button variant="secondary" size="sm" onClick={() => { setDeactivateModal(false); setUser(null)}}>Cancel</Button>
                        <Button size="sm" onClick={() => deactivateUser() }>Deactivate</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UserTable;

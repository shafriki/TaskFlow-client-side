import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import avatarImg from '../../../../src/assets/avatar.png';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';

const Navbar = () => {
    const { user, logOut } = useAuth();

    const Links = <>
    <NavLink to='/task' className={({ isActive }) => isActive ? 'font-bold text-[#1f5c59]' : 'text-[#251942]'}>Add Tasks</NavLink>

    <NavLink to='/alltasks' className={({ isActive }) => isActive ? 'font-bold text-[#28726f]' : 'text-[#251942]'}>All Tasks</NavLink>

    </>

    const handleLogout = () => {
        logOut();
        Swal.fire({
            title: 'Success!',
            text: 'You have logged out successfully.',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
            position: 'center'
        });
    };

    return (
        <div className="navbar bg-base-100 max-w-screen-xl mx-auto">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                            tabIndex={0}
                            className="menu bg-gradient-to-r from-[#070A16] via-[#070A16] to-[#070A16] menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            {Links}
                        </ul>
                </div>
                <Link to='/' className="btn btn-ghost text-xl">TaskFlow</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-5">
                        {Links}
                    </ul>
            </div>
            <div className="navbar-end flex gap-2 items-center">
                {user ? (
                    <>
                        <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover">
                                    <img alt={user.displayName} src={user.photoURL || avatarImg} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-40">
                                <li><Link to='/profile' className="btn btn-ghost">Profile</Link></li>
                                <li><button onClick={handleLogout} className="btn btn-ghost">Logout</button></li>
                            </ul>
                        </div>
                        <button onClick={handleLogout} className="btn hidden md:block">Logout</button>
                    </>
                ) : (
                    <Link to='/login' className="btn">Login</Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div
            className="hero bg-fixed min-h-screen"
            style={{
                backgroundImage: "url(https://i.ibb.co.com/q33RppLv/pexels-jeshoots-com-147458-714701.jpg)",
            }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                <p className="mb-5">
                    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                    quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
                <Link to='/login'><button className="btn btn-primary">Login Now</button>
                </Link>
                </div>
            </div>
            </div>
    );
};

export default Dashboard;
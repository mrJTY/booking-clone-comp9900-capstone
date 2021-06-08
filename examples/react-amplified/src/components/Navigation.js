import React from 'react';

import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <div>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/todo">Todo</NavLink>
            <NavLink to="/songs">Songs</NavLink>
            <NavLink to="/travel-deals">TravelDeals</NavLink>
        </div>
    );
}

export default Navigation;
import React from 'react';

export default function NavItem({ item }) {


    let style = {
        backgroundImage: `url(${item.img})`,
        backgroundPosition: "center",
        backgroundSize: "cover"
    }

    return(
        <div className="nav-item" style={style}>

        </div>
    );
}
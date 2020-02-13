import React from 'react';
import NavItem from './components/NavItem';

const ITEMS = [
    { id: 0, tag: "a", img: "https://puu.sh/Fa3As/40e9ef44e9.png", link: "#" },
    { id: 1, tag: "b", img: "https://puu.sh/Fa3As/40e9ef44e9.png", link: "#" },
    { id: 2, tag: "c", img: "https://puu.sh/Fa3As/40e9ef44e9.png", link: "#" },
    { id: 3, tag: "d", img: "https://puu.sh/Fa3As/40e9ef44e9.png", link: "#" },
    { id: 4, tag: "e", img: "https://puu.sh/Fa3As/40e9ef44e9.png", link: "#" },
    { id: 5, tag: "f", img: "https://puu.sh/Fa3As/40e9ef44e9.png", link: "#" }
]

const LASTITEM = { id: "last", tag: "last", img: "https://puu.sh/Fa3As/40e9ef44e9.png", link: "#" };


export default function Navigator() {

    return (
        <div className="navigator">
            <div>
                {ITEMS.map(item => <NavItem key={item.id} item={item} />)}
            </div>
            <div>
                <NavItem key={LASTITEM.id} item={LASTITEM} />
            </div>
        </div>
    );
}


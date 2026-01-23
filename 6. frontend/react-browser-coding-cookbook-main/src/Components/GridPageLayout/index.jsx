import { useState, ReactNode, ReactElement } from "react";
import StarRating from "../StarRating";
import TicTacToe from "../TicTacToe";
import "./index.css";
import Modal from "../Modal";

const GridPageLayout = ({
    children,
    menuList,
    footerList,
    navLinks,
}) => {
    const [open, setOpen] = useState(false);
    const toggleModal = () => setOpen(!open);
    const NavLinks = navLinks;

    return (
        <div className="container">
            <div className="nav-bar">
                
            </div>
            <div className="menu-bar">
                {NavLinks && <NavLinks />}
            </div>
            <div className="content-bar">
                {children}
            </div>
            <div className="footer-bar"></div>
        </div>
    )
}

export default GridPageLayout;
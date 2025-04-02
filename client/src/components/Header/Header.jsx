import React, { useState, useCallback } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AddPropertyModal from "../AddPropertyModal/AddPropertyModal";
import useAuthCheck from "../../hooks/useAuthCheck";
import { toast } from "react-toastify";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();
  const [modalOpened, setModalOpened] = useState(false);
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
  const { validateLogin } = useAuthCheck();

  const handleAddPropertyClick = useCallback(() => {
    if (validateLogin({ 
      errorMessage: "Please login to add properties",
      redirect: true 
    })) {
      setModalOpened(true);
    }
  }, [validateLogin]);

  const handleLogin = useCallback(() => {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname },
      authorizationParams: {
        prompt: "login"
      }
    });
  }, [loginWithRedirect]);

  const closeMenu = useCallback(() => setMenuOpened(false), []);

  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <Link to="/" onClick={closeMenu}>
          <img src="./logo.png" alt="logo" width={100} />
        </Link>

        {/* menu */}
        <OutsideClickHandler onOutsideClick={closeMenu}>
          <div
            className="flexCenter h-menu"
            style={getMenuStyles(menuOpened)}
          >
            <NavLink to="/properties" onClick={closeMenu}>
              Properties
            </NavLink>

            <a href="mailto:contact@example.com" onClick={closeMenu}>
              Contact
            </a>

            {/* add property */}
            <button 
              className="add-property-btn" 
              onClick={handleAddPropertyClick}
              aria-label="Add property"
            >
              Add Property
            </button>
            
            <AddPropertyModal 
              opened={modalOpened} 
              setOpened={setModalOpened} 
            />

            {/* login button */}
            {!isAuthenticated ? (
              <button 
                className="button" 
                onClick={handleLogin}
                aria-label="Login"
              >
                Login
              </button>
            ) : (
              <ProfileMenu 
                user={user} 
                logout={logout} 
                onItemClick={closeMenu}
              />
            )}
          </div>
        </OutsideClickHandler>

        {/* mobile menu toggle */}
        <button
          className="menu-icon"
          onClick={() => setMenuOpened((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpened}
        >
          <BiMenuAltRight size={30} />
        </button>
      </div>
    </section>
  );
};

export default React.memo(Header);
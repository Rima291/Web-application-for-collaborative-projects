import { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo from '../assets/img/logo.svg';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import { HashLink } from 'react-router-hash-link';

export const NavBar = () => {

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Acceuil</Nav.Link>
              <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Compétences</Nav.Link>
              <Nav.Link 
  href="https://mail.google.com/mail/?view=cm&fs=1&to=ceo@hortensia-agency.com" 
  className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'}
  target="_blank"  // Ouvre dans un nouvel onglet
>
  Email: ceo@hortensia-agency.com
</Nav.Link>
<Nav.Link 
  href="tel:+21620091092" 
  className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'}
>
  Téléphone: +216 20091092
</Nav.Link>


            </Nav>
            <span className="navbar-text">
              <div className="social-icon">
                <a href="https://www.linkedin.com/company/hortensia-agency/"><img src={navIcon1} alt="" /></a>
                <a href="https://www.facebook.com/Hortensia.production"><img src={navIcon2} alt="" /></a>
              </div>
              <HashLink to={'/auth'}>
                <button className="vvd"><span>Connectez-Vous</span></button>
              </HashLink>
            </span>
          </Navbar.Collapse>
      </Navbar>
  )
}

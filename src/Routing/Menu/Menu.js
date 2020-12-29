import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
import iconHome from '../../assets/icon-menu-home.svg';
import iconFav from '../../assets/icon-menu-fav.svg';
import iconCertificates from '../../assets/icon-menu-certificates.svg';
import iconProfile from '../../assets/icon-menu-profile.svg';
import iconHomeLight from '../../assets/icon-menu-home-light.svg';
import iconFavLight from '../../assets/icon-menu-fav-light.svg';
import iconCertificatesLight from '../../assets/icon-menu-certificates-light.svg';
import iconProfileLight from '../../assets/icon-menu-profile-light.svg';
//----------------------STYLES----------------------//
import './Menu.scss';

class Menu extends Component
{
    constructor(props){
        super(props);
        this.state = {
            buttonsState : [true, false, false, false]
        };
        this.arrayIconsLight    = [iconHomeLight, iconFavLight, iconCertificatesLight, iconProfileLight];
        this.arrayIcons         = [iconHome, iconFav, iconCertificates, iconProfile];
    }

    OnClickedMenuItem = (event, index) => {
        event.preventDefault();
        this.setState({
            buttonsState : [
                index === 0 ? true : false,
                index === 1 ? true : false,
                index === 2 ? true : false,
                index === 3 ? true : false
            ]
        });
        this.props.callback(index);
    };//OnClickedMenuItem

    render()
    {
        return (
            <div id = "menuContainer">
                <ul>
                    {this.state.buttonsState.map((button, index) => 
                        <li key = {index} onClick = {event => this.OnClickedMenuItem(event, index)}>
                            <img    src={button ? this.arrayIcons[index] : this.arrayIconsLight[index]}
                                    alt="icono de Menú" />
                        </li>
                    )}
                </ul>
            </div>
        );
    }
};

export default Menu;

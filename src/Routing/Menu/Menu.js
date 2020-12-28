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
    }
    render()
    {
        return (
            <div id = "menuContainer">
                <ul>
                    <li><img    src={this.state.buttonsState[0] ? iconHome : iconHomeLight}
                                alt="icono de Home"/>
                    </li>
                    <li><img    src={this.state.buttonsState[1] ? iconFav : iconFavLight}
                                alt="icono de Favoritos"/>
                    </li>
                    <li><img    src={this.state.buttonsState[2] ? iconCertificates : iconCertificatesLight}
                                alt="icono de Certificados"/>
                    </li>
                    <li><img    src={this.state.buttonsState[3] ? iconProfile : iconProfileLight}
                                alt="icono de Perfil"/>
                    </li>
                </ul>
            </div>
        );
    }
};

export default Menu;

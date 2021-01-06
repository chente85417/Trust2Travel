import React, { Component } from 'react';
import HomeContext from '../../Contexts/HomeContext.js';
import { Link } from 'react-router-dom';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
//----------------------STYLES----------------------//
import './Profile.scss';

class Profile extends Component
{
    constructor(props){
        super(props);
        this.user = "";
    }

    Logout = () => {
        document.cookie = "JWT= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        document.location.assign("/inicio");
    };//Logout

    setUser = (user) => {
        this.user = user;
        if (this.user === "")
        {
            return (
                <>
                    <div id="loginContainer">
                        <p>¿ya estás registrad@?</p>
                        <Link to="/login">
                            <strong>Iniciar sesión</strong>
                        </Link>
                    </div>
                    <p id="info">Próximamente añadiremos opciones para que puedas gestionar tu perfil</p>
                </>
            );
        }//if
        else
        {
            return(
                <>
                    <p id="wellcome">Hola <span>{this.user}</span></p>
                    <p id="info">Próximamente añadiremos opciones para que puedas gestionar tu perfil</p>
                    <div id="logoutContainer">
                        <p id="logout" onClick={this.Logout}><strong>Cerrar sesión</strong></p>
                    </div>
                </>
            );
        }//else
    };//setUser

    render()
    {
        return (
            <div id = "profileContainer">
                <HomeContext.Consumer>
                {value => this.setUser(value)}
                </HomeContext.Consumer>
            </div>
        );
    }
};

export default Profile;

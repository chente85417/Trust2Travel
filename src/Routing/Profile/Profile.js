import React, { Component } from 'react';
import HomeContext from '../../Contexts/HomeContext.js';
import { Link } from 'react-router-dom';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
import person from '../../assets/person-profile.svg';
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
                    <p id="wellcome">¡Hola, traveler!</p>
                    <p id="claim">¿ya estás registrad@?</p>
                    <div id="loginContainer">
                        <Link to="/login">Iniciar sesión</Link>
                    </div>
                    <div id="imgContainer">
                        <img src={person} alt="fondo no cargado"/>
                    </div>
                    <p id="info">En Trust 2 Travel trabajamos para incluir opciones para que puedas gestionar tu perfil.</p>
                </>
            );
        }//if
        else
        {
            return(
                <>
                    <p id="wellcome">¡Hola, traveler!</p>
                    <p id="claim">Este es tu perfil, desde aquí puedes iniciar o cerrar tu sesión</p>
                    <p id="userAccount">{this.user}</p>
                    <div id="logoutContainer">
                        <p id="logout" onClick={this.Logout}><strong>Cerrar sesión</strong></p>
                    </div>
                    <div id="imgContainer">
                        <img src={person} alt="fondo no cargado"/>
                    </div>
                    <p id="info">En Trust 2 Travel trabajamos para incluir opciones para que puedas gestionar tu perfil.</p>
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

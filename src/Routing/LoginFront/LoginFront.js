import React, { Component } from 'react';
/*import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'*/
import { Link } from 'react-router-dom';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
import iconEmail from '../../assets/icon-email.svg';
import iconGoogle from '../../assets/icon-google.svg';
import iconFacebook from '../../assets/icon-facebook.svg';
import iconClose from '../../assets/icon-close.svg';
//----------------------STYLES----------------------//
import './LoginFront.scss';

class LoginFront extends Component
{
    OnClickedLoginGoogle = () => {
        fetch(`${process.env.REACT_APP_URLBACK}loginGoogle`)
        .then(res => {
            console.log(res.status);
            console.log(res.url);
            window.location.assign(res.url);
            /*
            if (res.redirected)
            {
                console.log(res.url);
                window.location(res.url);
            }//if
            */
        });
    }

    OnClickedLoginFacebook = () => {
        //this.props.callback("/revista");
    }

    render()
    {
        return (
            <div id = "loginFrontContainer">
                <div id="controlsContainer">
                    <div id="closeContainer">
                        <Link to="/revista"><img src={iconClose} alt="icono de cerrar"/></Link>
                    </div>
                    <p id="caption">Crea tu cuenta</p>
                    <div id="buttonRegisterContainer" className="button">
                        <div className="innerContainer">
                            <div>
                                <img src={iconEmail} alt="icono de email"/>
                            </div>
                            <Link to="/registro">
                                <p>Email y contraseña</p>
                            </Link>
                        </div>
                    </div>
                    <div id="separatorContainer">
                        <div className="line"></div>
                        <div id="o">o</div>
                        <div className="line"></div>
                    </div>
                    <div id="buttonLoginGoogleContainer" className="button" onClick={this.OnClickedLoginGoogle}>
                        <div className="innerContainer" id="innerContainerGoogle">
                            <div>
                                <img src={iconGoogle} alt="icono de Google"/>
                            </div>
                            <p>Conectar con Google</p>
                        </div>
                    </div>
                    <div id="buttonLoginFacebookContainer" className="button">
                        <div className="innerContainer" id="innerContainerFacebook">
                            <div>
                                <img src={iconFacebook} alt="icono de Facebook"/>
                            </div>
                            <p>Conectar con Facebook</p>
                        </div>
                    </div>
                    <div id="loginContainer">
                        <p>¿ya estás registrad@?</p>
                        <Link to="/login">
                            <strong>Iniciar sesión</strong>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
};

export default LoginFront;

import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Validator } from '../../lib/validator.class.js';
//--------------------COMPONENTS--------------------//
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//----------------------ASSETS----------------------//
import logo from '../../assets/t2t-Logo.svg';
import iconBack from '../../assets/back.svg';
//----------------------STYLES----------------------//
import './FormLogin.scss';

class FormLogin extends Component
{
    constructor(props){
        super(props);
        this.state = {
            hiddenPass : true,
            showMessage : this.props.confirm,
            entryPrivateHome : 0
        }
        this.eyeIcon = <FontAwesomeIcon icon={faEye} onClick={this.togglePass} />
        this.eyeSlash = <FontAwesomeIcon icon={faEyeSlash} onClick={this.togglePass} />
        this.messageBoxCfg = {};

        if (this.props.confirm)
        {
            this.messageBoxCfg = {title : "Registro confirmado", body : "Puedes entrar con tus datos"};
        }//if
    }

    modal = () => {
        return (
            <Modal  show={this.state.showMessage} onHide={this.handleClose}
                    backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.messageBoxCfg.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.messageBoxCfg.body}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleClose}>
                        Entendido
                    </Button>
                </Modal.Footer>
            </Modal>);
    }//modal

    togglePass = () => {
        this.setState({hiddenPass : !this.state.hiddenPass});
    }//togglePass

    handleClose = () => {
        this.setState({showMessage : false});
    }//handleClose

    OnClickedLogin = (event) => {
        event.preventDefault();
        //Validate form data
        //EMAIL not null, valid email structure
        //PASSWORD not null, between 6 - 10 characters, must have letters, numbers and some special characters

        //EMAIL
        //Retrieve data
        const validator = new Validator();
        let validationResult = validator.ValidateEmail(event.target.userEmail.value);
        if (!validationResult.ret)
        {
            this.messageBoxCfg = {title : "Error", body : validationResult.caption};
            this.setState({showMessage : true});
            return;
        }//if
        //PASSWORD
        //Retrieve data
        validationResult = validator.ValidatePassword(event.target.passUser.value, /^(?=.*[*@%$&]*.*)(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z*@%$&]{6,}$/);
        if (!validationResult.ret)
        {
            this.messageBoxCfg = {title : "Error", body : validationResult.caption};
            this.setState({showMessage : true});
            return;
        }//if

        //Create JSON object with login data
        const LoginData = {
                "email" : event.target.userEmail.value,
                "password" : event.target.passUser.value
        };
        fetch(`${process.env.REACT_APP_URLBACK}login`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Allow-Credentials' : true,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(LoginData)
            }
        ).then(res => res.json()).then(data => {
            switch (data.ret)
            {
                case 0://FAILED LOGIN
                {
                    this.messageBoxCfg = {title : "Error", body : data.caption};
                    this.setState({showMessage : true});
                    break;
                }
                case 1://LOGIN OK, FIRST LOGIN
                {
                    console.log("login correcto - primer login");
                    document.cookie = `JWT=${data.caption}`;
                    this.setState({entryPrivateHome : 1});
                    break;
                }
                default://LOGIN OK, GO TO HOME
                {
                    console.log("login correcto");
                    document.cookie = `JWT=${data.caption}`;
                    this.setState({entryPrivateHome : 2});
                }
            }//switch
            /*if (data.ret)
            {
                this.setState({entryPrivateHome : true});
            }//if*/
        });
    }//OnClickedLogin

    ManageHome = () => {
        switch (this.state.entryPrivateHome)
        {
            case 0:
                {
                   return(<></>);
                }
            case 1:
                {
                    return(<Redirect to="/revista"/>);
                }
            default:
                {
                    return(<Redirect to="/home"/>);
                }
        }//switch
    };//ManageHome
    
    render()
    {
        let inputType = undefined;
        let eye = undefined;
        if (this.state.hiddenPass)
        {
            inputType = "password";
            eye = this.eyeIcon;
        }//if
        else
        {
            inputType = "text";
            eye = this.eyeSlash;
        }//else

        return (
            <div>
                {this.ManageHome()}
                {this.modal()}
                <form method="GET" action="" id = "formLoginContainer" onSubmit={this.OnClickedLogin}>
                    <div id="backContainer">
                        <Link to="/inicio"><img src={iconBack} alt="icono de volver"/></Link>
                    </div>
                    <img id="logoInFormLogin" src={logo} alt="logo de Trust2Travel"/>
                    <div id="groupEmail">
                        <input  type="email" className="editElements" id="userEmail" name="userEmail"
                                placeholder="Email" tabIndex="1" autoFocus={true} required={true}/>
                    </div>
                    <div id="groupPass">
                        <input  type={inputType} className="editElements" id="passUser" name="passUser"
                                placeholder="Contraseña" tabIndex="2" required={true}/>
                        {eye}
                    </div>
                    <Link to="/resetPass"><p id="textResetPass">¿No recuerdas tu contraseña?</p></Link>
                    <button type="submit" id="buttonLogin" className="button">Confirmar usuario</button>
                </form>
            </div>
        );
    }
};

export default FormLogin;

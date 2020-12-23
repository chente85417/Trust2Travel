import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Validator } from '../../lib/validator.class.js';
//--------------------COMPONENTS--------------------//
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//----------------------ASSETS----------------------//
import logo from '../../assets/t2t-Logo.svg';
//----------------------STYLES----------------------//
import './NewPass.scss';

class NewPass extends Component
{
    constructor(props){
        super(props);
        this.state = {
            hiddenPass : true,
            hiddenPassRepeat : true,
            showMessage : false
        }
        this.eyeIcon = <FontAwesomeIcon icon={faEye} onClick={this.togglePass} />
        this.eyeSlash = <FontAwesomeIcon icon={faEyeSlash} onClick={this.togglePass} />
        this.eyeIconRepeat = <FontAwesomeIcon icon={faEye} onClick={this.togglePassRepeat} />
        this.eyeSlashRepeat = <FontAwesomeIcon icon={faEyeSlash} onClick={this.togglePassRepeat} />
        this.messageBoxCfg = {};
    }

    modal = () => {
        return (
            <Modal  show={this.state.showMessage} onHide={this.handleClose}
                    backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.messageBoxCfg.title}Error</Modal.Title>
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

    togglePassRepeat = () => {
        this.setState({hiddenPassRepeat : !this.state.hiddenPassRepeat});
    }//togglePassRepeat

    handleClose = () => {
        this.setState({showMessage : false});
    }//handleClose

    getCookie = (cookie) => {
        let ret = undefined;
        let cookieString = decodeURIComponent(document.cookie);
        if (cookieString !== "")
        {
            let splitCookies = cookieString.split('=');
            let foundIndex = splitCookies.findIndex(element => element === cookie);
            if (foundIndex !== -'1')
            {
                return splitCookies[foundIndex + 1];
            } //if
            else
            {
                return ret;
            }//else
        }//if
        else
        {
            return ret;
        }//else
    }//getCookie

    OnClickedNewPass = (event) => {
        event.preventDefault();
        //Validate form data
        //PASSWORD not null, between 6 - 10 characters, must have letters, numbers and some special characters

        //PASSWORD
        //Retrieve data
        const validator = new Validator();
        let validationResult = validator.ValidatePassword(event.target.newPassUser.value, /^(?=.*[*@%$&]*.*)(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z*@%$&]{6,}$/);
        if (!validationResult.ret)
        {
            this.messageBoxCfg = {title : "Contraseña no válida", body : "Debe tener 6 caracteres como mínimo y contener números y letras. Puede contener los caracteres *@%$&"};
            this.setState({showMessage : true});
            return;
        }//if

        //PASSWORD REPEAT
        //Retrieve data
        //Validation of new password is made previously so only validate equality
        if (event.target.newPassUserRepeat.value !== event.target.newPassUser.value)
        {
            this.messageBoxCfg = {title : "Error", body : "Las contraseñas no coinciden"};
            this.setState({showMessage : true});
            return;
        }//if

        //TOKEN
        //Check out token on cookies
        const token = this.getCookie("usrchpassToken");
        if (token === undefined)
        {
            this.messageBoxCfg = {title : "Error", body : "Te pedimos disculpas. No es posible realizar el cambio en este momento. Inténtalo más tarde."};
            console.log('fallo de token',this.messageBoxCfg);
            this.setState({showMessage : true});
            return;
        }//if

        //Create JSON object with register data
        const newPassData = {
            "password" : event.target.newPassUser.value,
            "token" : token
        };
        fetch(`${process.env.REACT_APP_URLBACK}updatePass`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPassData)
            }
        ).then(res => res.json()).then(data => {
            if (!data.ret)
            {
                this.messageBoxCfg = {title : "Error", body : data.caption};
                this.setState({showMessage : true});
            }//if
            else
            {
                window.location.assign(data.caption);
            }//else
        });
    }//OnClickedNewPass

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

        let inputTypeRepeat = undefined;
        let eyeRepeat = undefined;
        if (this.state.hiddenPassRepeat)
        {
            inputTypeRepeat = "password";
            eyeRepeat = this.eyeIconRepeat;
        }//if
        else
        {
            inputTypeRepeat = "text";
            eyeRepeat = this.eyeSlashRepeat;
        }//else

        return (
            <div>
                {this.modal()}
                <form method="GET" action="" id = "formNewPassContainer" onSubmit={this.OnClickedNewPass}>
                    <img id="logoInForm" src={logo} alt="logo de Trust2Travel"/>
                    <div className="group">
                        <input  type={inputType} className="editElements" id="newPassUser" name="newPassUser"
                                placeholder="Contraseña" tabIndex="1" required={true}/>
                        {eye}
                    </div>
                    <div className="group">
                        <input  type={inputTypeRepeat} className="editElements" id="newPassUserRepeat" name="newPassUserRepeat"
                                placeholder="Repetir contraseña" tabIndex="2" required={true}/>
                        {eyeRepeat}
                    </div>
                    <button type="submit" id="buttonUpdatePass" className="button">Crear contraseña</button>
                </form>
            </div>
        );
    }
};

export default NewPass;

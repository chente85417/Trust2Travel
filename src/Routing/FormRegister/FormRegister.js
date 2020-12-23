import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Validator } from '../../lib/validator.class.js';
import { Link } from 'react-router-dom';
//--------------------COMPONENTS--------------------//
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//----------------------ASSETS----------------------//
import logo from '../../assets/t2t-Logo.svg';
import iconBack from '../../assets/back.svg';
//----------------------STYLES----------------------//
import './FormRegister.scss';

class FormRegister extends Component
{
    constructor(props){
        super(props);
        this.state = {
            hiddenPass : true,
            showMessage : false
        }
        this.eyeIcon = <FontAwesomeIcon icon={faEye} onClick={this.togglePass} />
        this.eyeSlash = <FontAwesomeIcon icon={faEyeSlash} onClick={this.togglePass} />
        this.messageBoxCfg = {};
        this.arrayTexts = [
            "Gracias por registrarse! Se ha enviado un link de confirmación a su cuenta de correo electrónico. Para finalizar el procedimiento de registro haga click en el vínculo que se muestra en el correo.",
            "Se ha enviado un link de confirmación a su cuenta de correo electrónico.",
            "Para finalizar el procedimiento de registro haga click en el vínculo que se muestra en el correo."];
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

    OnClickedRegister = (event) => {
        event.preventDefault();
        //Validate form data
        //EMAIL not null, valid email structure
        //PASSWORD not null, between 6 - 10 characters, must have letters, numbers and some special characters
        //BIRTHDAY dd/mm/yyyy format not null

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
            this.messageBoxCfg = {title : "Contraseña no válida", body : "Debe tener 6 caracteres como mínimo y contener números y letras. Puede contener los caracteres *@%$&"};
            this.setState({showMessage : true});
            return;
        }//if

        //BIRTHDAY
        //Retrieve data
        validationResult = validator.ValidateDate(event.target.birthdayUser.value);
        if (!validationResult.ret)
        {
            this.messageBoxCfg = {title : "Fecha no válida", body : validationResult.caption};
            this.setState({showMessage : true});
            return;
        }//if

        //GENDER
        //Retrieve data
        validationResult = validator.ValidateOption(event.target.genderUser.value, ["masculino", "femenino", "otro"]);
        if (!validationResult.ret)
        {
            this.messageBoxCfg = {title : "Error", body : validationResult.caption};
            this.setState({showMessage : true});
            return;
        }//if

        //Create JSON object with register data
        const registerData = {
                "dateBirth" : event.target.birthdayUser.value,
                "email" : event.target.userEmail.value,
                "gender": event.target.genderUser.value,
                "password" : event.target.passUser.value
        };
        //TODO: LANZAR LA LLAMADA AL END POINT PARA REGISTRAR AL NUEVO USUARIO
        fetch("http://localhost:8888/register", {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
            }
        ).then(res => res.json()).then(data => {
            if (!data.ret)
            {
                this.messageBoxCfg = {title : "Error", body : data.caption};
                this.setState({showMessage : true});
            }//if
            else
            {
                //this.props.callback(this.arrayTexts);
                window.location.assign(data.caption);
            }//else
        });
    }//OnClickedRegister
    
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
                {/* {this.state.showTerminatePage ? <Link to="/registroFin" /> : <></>} */}
                {this.modal()}
                <form method="GET" action="" id = "formRegisterContainer" onSubmit={this.OnClickedRegister}>
                    <div id="backContainer">
                        <Link to="/inicio"><img src={iconBack} alt="icono de volver"/></Link>
                    </div>
                    <img id="logoInFormRegister" src={logo} alt="logo de Trust2Travel"/>
                    <p id="text">Crea una cuenta para disfrutar al máximo de Trust 2 Travel</p>
                    <div id="groupEmail">
                        <input  type="email" className="editElements" id="userEmail" name="userEmail"
                                placeholder="Email" tabIndex="1" autoFocus={true} required={true}/>
                    </div>
                    <div id="groupPass">
                        <input  type={inputType} className="editElements" id="passUser" name="passUser"
                                placeholder="Contraseña" tabIndex="2" required={true}/>
                        {eye}
                    </div>
                    <div className="group">
                        <label htmlFor="birthdayUser">Fecha de nacimiento</label>
                        <div id="groupBirthday">
                            <input  type="date" className="editElements" name="birthdayUser"
                                    id="birthdayUser" tabIndex="3" required={true}/>
                        </div>
                    </div>
                    <div className="group">
                        <label htmlFor="genderUser">Género</label>
                        <div id="groupGender">
                            <select name="genderUser" className="editElements" id="genderUser">
                                <optgroup label="Género">
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                </optgroup>   
                            </select>
                        </div>
                    </div>
                    <button type="submit" id="buttonRegister" className="button">Crear cuenta</button>
                </form>
            </div>
        );
    }
};

export default FormRegister;

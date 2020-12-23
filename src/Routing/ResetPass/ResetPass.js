import React, { Component } from 'react';
import { Validator } from '../../lib/validator.class.js';
import { Link } from 'react-router-dom';
//--------------------COMPONENTS--------------------//
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//----------------------ASSETS----------------------//
import logo from '../../assets/t2t-Logo.svg';
import iconBack from '../../assets/back.svg';
//----------------------STYLES----------------------//
import './ResetPass.scss';

class ResetPass extends Component
{
    constructor(props){
        super(props);
        this.state = {
            showMessage : false
        }
        this.messageBoxCfg = {};
        this.arrayTexts = [
            "Se ha enviado un link a su cuenta de correo electrónico.",
            " Haga click en el link y se le llevará a una página donde podrá generar una nueva clave.",
            ""];
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

    handleClose = () => {
        this.setState({showMessage : false});
    }//handleClose

    OnClickedCheckEmail = (event) => {
        event.preventDefault();
        //Validate form data
        //EMAIL not null, valid email structure

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

        //Create JSON object with login data
        const resetPassEmailData = {
                "email" : event.target.userEmail.value
        };
        fetch(`${process.env.REACT_APP_URLBACK}/checkEmail`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resetPassEmailData)
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
    }//OnClickedCheckEmail

    render()
    {
        return (
            <div>
                {this.modal()}
                <form method="GET" action="" id = "resetPassContainer" onSubmit={this.OnClickedCheckEmail}>
                    <div id="backContainer">
                        <Link to="/login"><img src={iconBack} alt="icono de volver"/></Link>
                    </div>
                    <img id="logoInFormLogin" src={logo} alt="logo de Trust2Travel"/>
                    <div className="group">
                        <label htmlFor="userEmail">Escribe la dirección de correo con la que te registraste. Recibirás un correo con un link que te conducirá a una página para que cambies la contraseña</label>
                        <div id="groupEmail">
                            <input  type="email" className="editElements" id="userEmail" name="userEmail"
                                    placeholder="Email" tabIndex="1" autoFocus={true} required={true}/>
                        </div>
                    </div>
                    <button type="submit" id="buttonCheckEmail" className="button">Enviar email</button>
                </form>
            </div>
        );
    }
};

export default ResetPass;

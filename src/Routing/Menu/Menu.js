import React, { Component } from 'react';
import HomeContext from '../../Contexts/HomeContext.js';
//--------------------COMPONENTS--------------------//
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
            showMessage : false,
            buttonsState : [true, false, false, false]
        };
        this.arrayIconsLight    = [iconHomeLight, iconFavLight, iconCertificatesLight, iconProfileLight];
        this.arrayIcons         = [iconHome, iconFav, iconCertificates, iconProfile];
        this.messageBoxCfg = {title : "Opción de menú no operativa", body : "Para poder disponer de favoritos y usar tu perfil debes entrar como usuario registrado"};
        this.user = "";
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

    handleClose = () => {
        this.setState({showMessage : false});
    }//handleClose

    OnClickedMenuItem = (event, index) => {
        event.preventDefault();
        if (this.props.user === "" && (index === 1 || index === 3))
        {
            this.setState({showMessage : true});
            return;
        }//if
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

    setUser = (user) => {
        this.user = user;
        return(<></>);
    };//setUser

    render()
    {
        return (
            <div id = "menuContainer">
                <HomeContext.Consumer>
                {value => this.setUser(value)}
                </HomeContext.Consumer>
                {this.modal()}
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

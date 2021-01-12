import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Figure from 'react-bootstrap/Figure';
//----------------------ASSETS----------------------//
import iconPlus from '../../assets/icon-plus.svg';
import iconMinus from '../../assets/icon-minus.svg';
//----------------------STYLES----------------------//
import './Certificates.scss';

class Certificates extends Component
{    
    constructor(props){
        super(props);
        this.state = {
            clickedToggle : {id : undefined, extended : false}
        };
    }

    OnClickedExtend = (event) => {
        event.preventDefault();
        console.log(event.target);
        this.setState({clickedToggle : {    id : event.target.attributes.id.value,
                                            extended : event.target.attributes.id.value === this.state.clickedToggle.id ? !this.state.clickedToggle.extended : true}});
    };//OnClickedExtend

    SelectIcon = (id) => {
        let icon = undefined;
        if (parseInt(this.state.clickedToggle.id) === id)
        {
            if (this.state.clickedToggle.extended)
            {
                icon = iconMinus;
            }//if
            else
            {
                icon = iconPlus;
            }//else
        }//if
        else
        {
            icon = iconPlus;
        }//else
        return icon;
    };//SelectIcon

    LoadCertificates = () => {
        let arrayItems = this.props.basicData.map(item => {
            return( <Card key = {item.CERTID}>
                        <Card.Header>
                            <div className="logoContainer">
                                <img className="logo" src={item.LOGO} alt="logo del certificado"/>
                            </div>
                            <p className="name">{item.ETIQUETA}</p>
                            <Accordion.Toggle as={Figure} eventKey={item.CERTID} onClick={this.OnClickedExtend} >
                                <img id={item.CERTID} className="extend" src={this.SelectIcon(item.CERTID)} alt="icono de extender lista"/>
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey={item.CERTID}>
                            <Card.Body>
                                <p className="description">{item.DESCRIPCION}</p>
                                <p className="web">
                                    Visita la web oficial para más información</p>
                                <a href={item.WEBSITE} target = "_blank">pulsando aquí.</a>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>);
        });

        //console.log(arrayItems);

        return (
            <Accordion>
                {arrayItems}
            </Accordion>
        );
    };//LoadCertificates

    render()
    {
        console.log(this.props.basicData);
        return (
            <div id = "certificatesContainer">
                <p id="caption">Certificados</p>
                <p id="note">En Trust 2 Travel trabajamos con certificados emitidos por entidades a nivel europeo. Actualmente contamos con 6 certificados.</p>
                {this.LoadCertificates()}
            </div>
        );
    }
};

export default Certificates;

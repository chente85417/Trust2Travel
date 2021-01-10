import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
import Loading from '../Loading/Loading.js';
import MiniCertificates from '../MiniCertificates/MiniCertificates.js';
import Activities from '../Activities/Activities.js';
import Map from '../Map/Map.js';
//----------------------ASSETS----------------------//
import iconBack from '../../assets/back.svg';
import iconLocation from '../../assets/icon-location.svg';
//----------------------STYLES----------------------//
import './Details.scss';

class Details extends Component
{
    constructor(props){
        super(props);
        this.state = {
            loadedData : false
        };
        this.currentResults = undefined;
    }

    componentDidMount = () => {
        fetch(`${process.env.REACT_APP_URLBACK}getEstablishmentDetails/${this.props.alID}`)
        .then(res => res.json()).then(data => {
            if (!data.ret)
            {
                //INFORMAR DE QUE NO SE HA PODIDO COMPLETAR LA CONSULTA
                //this.messageBoxCfg = {title : "Error", body : data.caption};
                //this.setState({showMessage : true});
            }//if
            else
            {
                //PINTAR LOS RESULTADOS
                this.currentResults = data.caption;
                this.setState({loadedData : true});
            }//else
        });        
    };//componentDidMount

    HideDetails = () => {
        this.props.callback();
    };//HideDetails

    InsertComponents = () => {
        const mainPoint = { latitude : this.currentResults[0].LATITUD,
                            longitude : this.currentResults[0].LONGITUD,
                            name : this.currentResults[0].NOMBRE
                        };
        return (
            <>
                <div id="header">
                    <div id="backContainer" onClick = {this.HideDetails}>
                        <img src={iconBack} alt="icono de volver"/>
                    </div>
                </div>
                <div id="imageContainer">
                    <img src={this.currentResults[0].LOGO} alt="imagen del establecimiento no disponible" />
                </div>
                <p id="name">{this.currentResults[0].NOMBRE}</p>
                <div id="addressContainer">
                    <div id="iconLocationContainer">
                        <img src={iconLocation} alt="icono de localización" />
                    </div>
                    <p id="location">{this.currentResults[0].PROVINCIA}, {this.currentResults[0].COMUNIDAD}, {this.currentResults[0].PAIS}</p>
                    <p id="direction">{this.currentResults[0].DIRECCION}</p>
                </div>
                <div className="separator"></div>
                <p id="infoDetails">{this.currentResults[0].DESCRIPCION}</p>
                <div id="phoneContainer">
                    <p className="caption">Teléfono</p>
                    <p id="phone">{this.currentResults[0].TELEFONO}</p>
                </div>
                <div id="emailContainer">
                    <p className="caption">Email</p>
                    <p id="email">{this.currentResults[0].EMAIL}</p>
                </div>
                <div className="separator"></div>
                <MiniCertificates alID = {this.props.alID} caption = "Certificados"/>
                <div className="separator"></div>
                <p id="caption">Localización</p>
                <Map main = {mainPoint} nearbyElements = {[]} zoomLevel = {13}/>
                <div className="separator"></div>
                <Activities location = {this.currentResults[0].PROVINCIA} />
                <div id="footer">
                    <a href={this.currentResults[0].WEBSITE} target="_blank">IR A LA WEB</a>
                </div>
            </>
        );
    };//InsertComponents

    render()
    {
        return (
            <div id = "detailsContainer">
                {/* <Loading /> */}
                {this.state.loadedData ? this.InsertComponents() : <Loading />}
            </div>
        );
    }
};

export default Details;

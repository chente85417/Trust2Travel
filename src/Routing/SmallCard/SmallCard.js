import React, { Component } from 'react';
//import DetailsContext from '../../Contexts/DetailsContext.js';
//--------------------COMPONENTS--------------------//
import Loading from '../Loading/Loading.js';
import SmallCertificate from '../SmallCertificate/SmallCertificate.js';
import SmallCategory from '../SmallCategory/SmallCategory.js';
import Details from '../Details/Details.js';
import { withRouter } from 'react-router-dom';
//----------------------ASSETS----------------------//
import iconLocation from '../../assets/icon-location.svg';
//----------------------STYLES----------------------//
import './SmallCard.scss';

class SmallCard extends Component
{
    constructor(props){
        super(props);
        this.state = {
            showResults : false,
            showDetails : false
        };
        this.currentResults = undefined;
    }

    componentDidMount = () => {
        fetch(`${process.env.REACT_APP_URLBACK}getEstablishmentBasics/${this.props.data.ALID}`)
        .then(res => res.json()).then(data => {
            //console.log(data);
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
                this.setState({showResults : true});
            }//else
        });        
    };//componentDidMount

    LoadDetails = () => {
        //this.TellID(this.props.data.ALID);
        //this.props.history.push(`/details/${this.props.data.ALID}`);
        this.setState({showDetails : true});
    };//LoadDetails

    HideDetails = () => {
        this.setState({showDetails : false});
    };//InsertBasicData

    InsertCertificates = () => {
        let arrayCertificates = this.props.data.CERTS.map(item => <SmallCertificate key = {item.CERTID} data = {item} />);
        return (
            <>
                {arrayCertificates}
            </>
        );
    };//InsertCertificates

    InsertCategories = () => {
        let arrayCategories = this.props.data.CATEGORIAS.map((item, index) => <SmallCategory key = {index} data = {item} />);
        return (
            <>
                {arrayCategories}
            </>
        );
    };//InsertCategories

    DrawContents = () => {
        if (this.state.showResults)
        {
            return (
                <>
                    <div id="imageContainer">
                        <img src={this.currentResults[0].LOGO} alt="imagen del establecimiento no disponible" />
                    </div>
                    <p id="name">{this.currentResults[0].NOMBRE}</p>
                    <div id="addressContainer">
                        <div id="iconLocationContainer">
                            <img src={iconLocation} alt="icono de localización" />
                        </div>
                        <p id="address">{this.currentResults[0].DIRECCION}, {this.currentResults[0].PROVINCIA}</p>
                    </div>
                    <p id="info">{this.currentResults[0].DESCRIPCION}</p>
                    <p id="certificates">Certificados y categorías</p>
                    <div id="labelsContainer">
                        {this.InsertCertificates()}
                        {this.InsertCategories()}
                    </div>
                    <p id="mas" onClick = {this.LoadDetails}>VER MÁS</p>
                </>
            );
        }//if
        else
        {
            return (<Loading />);
        }//else
    };//DrawContents

    render()
    {
        return (
            <div id = "smallCardContainer">
                {/* <DetailsContext.Consumer>
                    {callback => this.TellID = callback}
                </DetailsContext.Consumer> */}
                {this.state.showDetails ? <Details alID = {this.props.data.ALID} callback = {this.HideDetails} /> : this.DrawContents()}
            </div>
        );
    }
};

export default withRouter(SmallCard);

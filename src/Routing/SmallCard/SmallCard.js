import React, { Component } from 'react';
import HomeContext from '../../Contexts/HomeContext.js';
//import DetailsContext from '../../Contexts/DetailsContext.js';
//--------------------COMPONENTS--------------------//
import Loading from '../Loading/Loading.js';
import SmallCertificate from '../SmallCertificate/SmallCertificate.js';
import SmallCategory from '../SmallCategory/SmallCategory.js';
import Details from '../Details/Details.js';
import { withRouter } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//----------------------ASSETS----------------------//
import iconLocation from '../../assets/icon-location.svg';
import iconFav from '../../assets/icon-fav-on.svg';
import iconNoFav from '../../assets/icon-fav-off.svg';
//----------------------STYLES----------------------//
import './SmallCard.scss';

class SmallCard extends Component
{
    constructor(props){
        super(props);
        this.state = {
            showResults : false,
            showDetails : false,
            showMessage : false,
            isFavourite : false
        };
        this.currentResults = undefined;
        this.user = "";
        this.messageBoxCfg = {};
        this.JWTValue = document.cookie.replace(/(?:(?:^|.*;\s*)JWT\s*\=\s*([^;]*).*$)|^.*$/, "$1");
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
                this.currentResults = data.caption;

                if (this.JWTValue !== "")
                {
                    //Checkout if it is set as favourite
                    const searchData = {
                        "JWT" : this.JWTValue,
                        "id" : this.props.data.ALID
                    };
                    //console.log(searchData);
                    fetch(`${process.env.REACT_APP_URLBACK}checkFavourite`, {
                        method: 'POST',
                        headers: {
                            'Access-Control-Allow-Origin' : '*',
                            'Access-Control-Allow-Headers' : '*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(searchData)
                        }
                    ).then(res => res.json()).then(dataFav => {
                        if (dataFav.ret === "error")
                        {
                            this.messageBoxCfg = {title : "Error", body : dataFav.caption};
                            this.setState({showMessage : true});
                        }//if
                        else
                        {
                            this.setState({showResults : true, isFavourite : dataFav.ret});
                        }//else
                    });
                }//if
                else
                {
                    this.setState({showResults : true, isFavourite : false});
                }//else
            }//else
        });        
    };//componentDidMount

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

    setUser = (user) => {
        this.user = user;
        return(
            <>
                {this.state.showDetails ? <Details alID = {this.props.data.ALID} callback = {this.HideDetails} /> : this.DrawContents()}
            </>
        );
    };//setUser

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

    OnClickedFavourites = () => {
        if (this.user !== "")
        {
            if (this.state.isFavourite)
            {
                //retirar de favoritos
                //añadir a favoritos
                const deleteData = {
                    "JWT" : this.JWTValue,
                    "alID" : this.props.data.ALID
                };
                fetch(`${process.env.REACT_APP_URLBACK}eraseFavourite`, {
                    method: 'DELETE',
                    headers: {
                        'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Headers' : '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(deleteData)
                    }
                ).then(res => res.json()).then(data => {
                    if (data.ret === "error")
                    {
                        this.messageBoxCfg = {title : "Error", body : data.caption};
                        this.setState({showMessage : true});
                    }//if
                    else
                    {
                        if (data.ret === true)
                        {
                            this.setState({isFavourite : false});
                            if (this.props.callback)
                            {
                                this.props.callback();
                            }//if
                        }//if
                    }//else
                });
            }//if
            else
            {
                //añadir a favoritos
                const insertData = {
                    "JWT" : this.JWTValue,
                    "alID" : this.props.data.ALID
                };
                fetch(`${process.env.REACT_APP_URLBACK}addFavourite`, {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Headers' : '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(insertData)
                    }
                ).then(res => res.json()).then(data => {
                    if (data.ret === "error")
                    {
                        this.messageBoxCfg = {title : "Error", body : data.caption};
                        this.setState({showMessage : true});
                    }//if
                    else
                    {
                        if (data.ret === true)
                        {
                            this.setState({isFavourite : true});
                        }//if
                    }//else
                });
            }//else
        }//if
        else
        {
            this.messageBoxCfg = {title : "Ups!", body : "Para poder guardar favoritos debes acceder con tu cuenta."};
            this.setState({showMessage : true});
        }//else
    };//OnClickedFavourites

    DrawContents = () => {
        if (this.state.showResults)
        {
            return (
                <>
                    <div id="imageContainer">
                        <img src={this.currentResults[0].LOGO} alt="imagen del establecimiento no disponible" />
                    </div>
                    <p id="name">{this.currentResults[0].NOMBRE}</p>
                    <div id="favContainer" onClick={this.OnClickedFavourites}>
                        <img src={this.state.isFavourite ? iconFav : iconNoFav} alt="icono de favoritos"/>
                    </div>
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
                {this.modal()}
                <HomeContext.Consumer>
                {value => this.setUser(value)}
                </HomeContext.Consumer>
                {/* <DetailsContext.Consumer>
                    {callback => this.TellID = callback}
                </DetailsContext.Consumer> */}
            </div>
        );
    }
};

export default withRouter(SmallCard);

import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
import Loading from '../Loading/Loading.js';
//----------------------ASSETS----------------------//
import iconLocation from '../../assets/icon-location.svg';
//----------------------STYLES----------------------//
import './Activities.scss';

class Activities extends Component
{
    constructor(props){
        super(props);
        this.state = {
            loadedData : false
        };
        this.currentResults = [];
    }

    componentDidMount = () => {
        fetch(`${process.env.REACT_APP_URLBACK}getActivities/${this.props.location}`)
        .then(res => res.json()).then(data => {
            console.log(data);
            if (!data.ret)
            {
                //INFORMAR DE QUE NO SE HA PODIDO COMPLETAR LA CONSULTA
                //this.messageBoxCfg = {title : "Error", body : data.caption};
                //this.setState({showMessage : true});
                this.setState({loadedData : true});
            }//if
            else
            {
                //PINTAR LOS RESULTADOS
                this.currentResults = data.caption;
                this.setState({loadedData : true});
            }//else
        });        
    };//componentDidMount

    InsertActivities = () => {
        return (
            this.currentResults.map(activity => {
                return (
                    <div key = {activity.ACTID} className="cardActivity">
                        <div className="image">
                            <img src={activity.IMAGEN} alt="imagen no disponible"/>
                        </div>
                        <div className="dataContainer">
                            <p className="name">{activity.NOMBRE}</p>
                            <p className="description">{activity.DESCRIPCION}</p>
                            <div className="addressContainer">
                                <div className="iconLocationContainer">
                                    <img src={iconLocation} alt="icono de localización" />
                                </div>
                                <p className="direction">{activity.DIRECCION}</p>
                                <p className="location">{activity.LOCALIDAD}</p>
                            </div>
                        </div>
                    </div>
                );
            })
        );
    };//InsertActivities

    render()
    {
        return (
            <div id = "activitiesContainer">
                <p id="caption">Actividades en la zona</p>
                <div id="cardsContainer">
                    {this.state.loadedData ? this.InsertActivities() : <Loading />}
                </div>
            </div>
        );
    }
};

export default Activities;

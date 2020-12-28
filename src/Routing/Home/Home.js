import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
import Seeker from '../Seeker/Seeker.js';
import Menu from '../Menu/Menu.js';
//----------------------ASSETS----------------------//
import logo from '../../assets/t2t-Logo.svg';
//----------------------STYLES----------------------//
import './Home.scss';

class Home extends Component
{
    LaunchSearch = (searchData) => {
        fetch(`${process.env.REACT_APP_URLBACK}search`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchData)
            }
        ).then(res => res.json()).then(data => {
            console.log(data);
            if (!data.ret)
            {
                //INFORMAR DE QUE NO SE HA PODIDO COMPLETAR LA CONSULTA
                //this.messageBoxCfg = {title : "Error", body : data.caption};
                //this.setState({showMessage : true});
            }//if
            else
            {
                //PINTAR LOS RESULTADOS
            }//else
        });        
    };//LaunchSearch

    render()
    {
        return (
            <div id = "homeContainer">
                <img id="logoInHome" src={logo} alt="logo de Trust2Travel"/>
                <div id="frontImage">
                    <p>Viaja local y consciente</p>
                </div>
                <Seeker callbackSearch = {this.LaunchSearch} />
                <p id="smallCardsViewerCaption">Cerca de tí</p>
                <div id="smallCardsViewer">
                    Contenedor de tarjetas por hacer con visualización horizontal corrida mediante scroll
                </div>
                <Menu />
            </div>
        );
    }
};

export default Home;

import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
import Seeker from '../Seeker/Seeker.js';
import Certificates from '../Certificates/Certificates.js';
import Menu from '../Menu/Menu.js';
//----------------------ASSETS----------------------//
import logo from '../../assets/t2t-Logo.svg';
//----------------------STYLES----------------------//
import './Home.scss';

class Home extends Component
{
    constructor(props){
        super(props);
        this.state = {
            arrayShowMenuItems : [true, false, false, false]
        };
    }

    componentDidMount(){
        //Retrieve from DB all basic certificates data to pass them to certificates component
        //Retrieved once reducing DB query stress

    }//componentDidMount

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

    OnMenuItem = (item) => {
        this.setState({
            arrayShowMenuItems : [
                item === 0 ? true : false,
                item === 1 ? true : false,
                item === 2 ? true : false,
                item === 3 ? true : false
            ]
        });
    };//OnMenuItem

    InsertMenuScreen = () => {
        let count = 0;
        while (!this.state.arrayShowMenuItems[count])
        {
            ++count;
        }//while
        if (count < this.state.arrayShowMenuItems.length)
        {
            switch (count)
            {
                case 0://MAIN
                {
                    return (<>
                                <img id="logoInHome" src={logo} alt="logo de Trust2Travel"/>
                                <div id="frontImage">
                                    <p>Viaja local y consciente</p>
                                </div>
                                <Seeker callbackSearch = {this.LaunchSearch} />
                                <p id="smallCardsViewerCaption">Cerca de tí</p>
                                <div id="smallCardsViewer">
                                    Contenedor de tarjetas por hacer con visualización horizontal corrida mediante scroll
                                </div>
                            </>);
                }
                case 1://FAVOURITES
                {
                    break;
                }
                case 2://CERTIFICATES
                {
                    return (<>
                                <Certificates basicData = {this.props.initData} />
                            </>);
                }
                default://PROFILE
                {

                }
            }//switch
        }//if
    };//InsertMenuScreen

    render()
    {
        return (
            <div id = "homeContainer">
                {this.InsertMenuScreen()}
                <Menu callback = {this.OnMenuItem} />
            </div>
        );
    }
};

export default Home;

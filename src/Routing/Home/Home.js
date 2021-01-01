import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
import Seeker from '../Seeker/Seeker.js';
import Certificates from '../Certificates/Certificates.js';
import Menu from '../Menu/Menu.js';
import SmallCard from '../SmallCard/SmallCard.js';
//----------------------ASSETS----------------------//
import logo from '../../assets/t2t-Logo.svg';
//----------------------STYLES----------------------//
import './Home.scss';

class Home extends Component
{
    constructor(props){
        super(props);
        this.state = {
            arrayShowMenuItems : [true, false, false, false],
            showResults : false
        };
        this.currentResults = undefined;
        this.searchData = {
            provincia : "",
            comunidad : "",
            filtros : [false, false, false]
        };
    }

    componentDidMount(){
        let storageValue = localStorage.getItem('currentHomeSearch');
        if (storageValue !== null)
        {
            let aux = JSON.parse(storageValue);
            this.currentResults = aux.recordset;
            this.searchData = aux.search;

            this.setState({showResults : true});
        }//if       
    }//componentDidMount

    LaunchSearch = (searchData) => {
        this.searchData = searchData;
        fetch(`${process.env.REACT_APP_URLBACK}startSearch`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchData)
            }
        ).then(res => res.json()).then(data => {
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
                this.currentResults = data.data;
                let storageData = {search : this.searchData, recordset : data.data};
                localStorage.setItem('currentHomeSearch', JSON.stringify(storageData));
                this.setState({showResults : true});
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
                                <Seeker currentSearch = {this.searchData} callbackSearch = {this.LaunchSearch} />
                                <p id="smallCardsViewerCaption">{this.state.showResults ? `Resultados - ${this.currentResults.length}` : "Cerca de tí"}</p>
                                {this.state.showResults ? this.InsertResults() : <></>}
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

    InsertResults = () => {
        let arrayItems = this.currentResults.map(item => <SmallCard key = {item.ALID} data = {item} />);
        return (
            <div id="smallCardsViewer">
                {arrayItems}                  
            </div>
        );
    };//InsertResults

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

import React, { Component } from 'react';
import HomeContext from '../../Contexts/HomeContext.js';
//--------------------COMPONENTS--------------------//
import Seeker from '../Seeker/Seeker.js';
import Favs from '../Favs/Favs.js';
import Certificates from '../Certificates/Certificates.js';
import Menu from '../Menu/Menu.js';
import SmallCard from '../SmallCard/SmallCard.js';
import Loading from '../Loading/Loading.js';
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
            showResults : false,
            searching : false
        };
        this.processedArrayResults = [];
        this.searchData = {
            provincia : "",
            comunidad : "",
            filtros : [false, false, false]
        };
        this.user = "vagb.chente@gmail.com";
        //this.user = "";
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
        this.setState({searching : true});
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
                //Process the results
                this.processedArrayResults = [];
                const categories = ["Gestión ambiental", "Eco-turismo", "Agro-turismo"];
                let aux = [];
                this.searchData.filtros.forEach((item, index) => {
                    if (item)
                    {
                        aux.push(categories[index]);
                    }//if
                });
                console.log(aux);
                console.log(data.data);
                let currentID = "";
                let item = {
                    ALID : undefined,
                    NOMBRE : "",
                    CERTS : [],
                    CATEGORIAS : []
                    };
                for (let count = 0; count < data.data.length; ++count)
                {
                    if (currentID !== data.data[count].ALID)
                    {
                        if (currentID !== "")
                        {
                            this.processedArrayResults.push(item);
                        }//if
                        item = {    ALID : data.data[count].ALID,
                                    NOMBRE : data.data[count].NOMBRE,
                                    CERTS : [{  CERTID : data.data[count].CERTID,
                                                ETIQUETA : data.data[count].ETIQUETA,
                                                LOGO : data.data[count].LOGO}],
                                    CATEGORIAS : aux
                                };
                        currentID = data.data[count].ALID;
                    }//if
                    else
                    {
                        item.CERTS.push(data.data[count].CERTID);
                    }//else
                }//for
                if (currentID !== "")
                {
                    this.processedArrayResults.push(item);
                }//if

                console.log(this.processedArrayResults);


                //this.currentResults = data.data;
                //console.log(data.data);
                let storageData = {search : this.searchData, recordset : data.data};
                localStorage.setItem('currentHomeSearch', JSON.stringify(storageData));
                this.setState({showResults : true, searching : false});
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
                                {this.state.searching ? <Loading /> : <></>}
                                <img id="logoInHome" src={logo} alt="logo de Trust2Travel"/>
                                <div id="frontImage">
                                    <p>Viaja local y consciente</p>
                                </div>
                                <Seeker currentSearch = {this.searchData} callbackSearch = {this.LaunchSearch} />
                                <p id="smallCardsViewerCaption">{this.state.showResults ? `Resultados - ${this.processedArrayResults.length}` : "Cerca de tí"}</p>
                                {this.state.showResults ? this.InsertResults() : <></>}
                            </>);
                }
                case 1://FAVOURITES
                {
                    return (<>
                        <Favs /*user = {this.user}*/ />
                    </>);
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
        let arrayItems = this.processedArrayResults.map(item => <SmallCard key = {item.ALID} data = {item} />);
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
                <HomeContext.Provider value = {this.user}>
                {this.InsertMenuScreen()}
                <Menu callback = {this.OnMenuItem} />
                </HomeContext.Provider>
            </div>
        );
    }
};

export default Home;

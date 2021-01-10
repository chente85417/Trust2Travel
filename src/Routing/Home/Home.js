import React, { Component } from 'react';
import HomeContext from '../../Contexts/HomeContext.js';
//--------------------COMPONENTS--------------------//
import Seeker from '../Seeker/Seeker.js';
import Favs from '../Favs/Favs.js';
import Profile from '../Profile/Profile.js';
import Certificates from '../Certificates/Certificates.js';
import Menu from '../Menu/Menu.js';
import SmallCard from '../SmallCard/SmallCard.js';
import Loading from '../Loading/Loading.js';
import Map from '../Map/Map.js';
import L from 'leaflet';
//----------------------ASSETS----------------------//
import logo from '../../assets/t2t-Logo.svg';
//----------------------STYLES----------------------//
import './Home.scss';

class Home extends Component
{
    constructor(props){
        super(props);
        this.state = {
            user : "",
            positionAvailable : false,
            arrayShowMenuItems : [true, false, false, false],
            showResults : false,
            searching : false,
            nearbySelected : {ALID : undefined, NOMBRE : "", CERTS : [], CATEGORIAS : []}
        };
        this.processedArrayResults = [];
        this.searchData = {
            provincia : "",
            comunidad : "",
            filtros : [false, false, false]
        };
        this.currentLat = undefined;
        this.currentLong = undefined;
        this.arrayNearbyItems = [];
    }

    componentDidMount(){
        this.GetLocation().then(data => {
            if (data.ret)
            {
                this.currentLat = data.coords[0];
                this.currentLong = data.coords[1];
                const origin = L.latLng(this.currentLat, this.currentLong);
                fetch(`${process.env.REACT_APP_URLBACK}getLocations`)
                .then(res => res.json()).then(data => {
                    if (!data.ret)
                    {
                        //INFORMAR DE QUE NO SE HA PODIDO COMPLETAR LA CONSULTA
                        //this.messageBoxCfg = {title : "Error", body : data.caption};
                        //this.setState({showMessage : true});
                    }//if
                    else
                    {
                        let candidates = 10;
                        let found = 0;
                        let count = 0;
                        while ((found < candidates)&&(count < data.caption.length))
                        {
                            if (origin.distanceTo(L.latLng(data.caption[count].LATITUD, data.caption[count].LONGITUD)) < 50000)
                            {
                                this.arrayNearbyItems.push(data.caption[count]);
                                ++found;
                            } //if
                            ++count;
                        }//while
                        console.log(this.currentLat, this.currentLong, this.arrayNearbyItems);
                        this.setState({positionAvailable : true});
                    }//else
                });        
            }//if
            else
            {
                console.log("no me dejas que te posicione");
            }//else
        });
        /*
        fetch(`${process.env.REACT_APP_URLBACK}getUsr`)
        .then(res => res.json()).then(data => {
            console.log(data);
        });*/
        var JWTValor = document.cookie.replace(/(?:(?:^|.*;\s*)JWT\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        const token = {"JWT" : JWTValor};
        //console.log(token);
        fetch(`${process.env.REACT_APP_URLBACK}getUsr`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(token)
            }
        ).then(res => res.json()).then(data => {
            if (!data.ret)
            {
                this.setState({user : data.user});
            }//if
            else
            {
                this.setState({user : data.user});
            }//else
        });
        let storageValue = localStorage.getItem('currentHomeSearch');
        if (storageValue !== null)
        {
            let aux = JSON.parse(storageValue);
            this.currentResults = aux.recordset;
            this.searchData = aux.search;

            this.setState({showResults : true});
        }//if       
    }//componentDidMount

    GetLocation = () => {
        return new Promise((response, reject) => {
            let res = {};
            navigator.geolocation.getCurrentPosition((position) =>  {
                res = {ret : true, coords : [position.coords.latitude, position.coords.longitude]};
                response(res);
            }, 
                (err) => {
                res = {ret : false};
                response(res);
            }
                                                    ); 
                                                });
    };//GetLocation

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
                //console.log(aux);
                //console.log(data.data);
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

                //console.log(this.processedArrayResults);


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
                                {this.InsertResults()}
                            </>);
                }
                case 1://FAVOURITES
                {
                    return (<><Favs /*user = {this.user}*/ /></>);
                }
                case 2://CERTIFICATES
                {
                    return (<><Certificates basicData = {this.props.initData} /></>);
                }
                default://PROFILE
                {
                    return (<><Profile /*user = {this.state.user}*/ /></>);
                }
            }//switch
        }//if
    };//InsertMenuScreen

    InsertResults = () => {
        if (this.state.showResults)
        {
            let arrayItems = this.processedArrayResults.map(item => <SmallCard key = {item.ALID} data = {item} />);
            return (
                <>
                    <p id="smallCardsViewerCaption">{this.state.showResults ? `${this.processedArrayResults.length} Resultados` : "Cerca de tí"}</p>
                    <div id="smallCardsViewer">
                        {arrayItems}                  
                    </div>
                </>
            );
        }//if
        else
        {
            if (this.state.positionAvailable)
            {
                const mainPoint = { latitude : this.currentLat,
                                    longitude : this.currentLong,
                                    name : ""
                                };
                return (
                    <>
                        <p id="nearbyCaption">Cerca de tí</p>
                        <div id="nearbyContainer">
                            <Map    main = {mainPoint} 
                                    nearbyElements = {this.arrayNearbyItems} 
                                    zoomLevel = {8}
                                    callback = {this.ShowMe} />
                        </div>
                        {this.state.nearbySelected.ALID !== undefined ? 
                        <div id="nearbyCardsViewer">
                            <SmallCard key = {this.state.nearbySelected.ALID} data = {this.state.nearbySelected} />                 
                        </div>  : <></>}
                    </>
                );
            }//if
            else
            {
                return (<></>);
            }//else
        }//else        
    };//InsertResults

    ShowMe = (id, name) => {
        this.setState({nearbySelected : {ALID : id, NOMBRE : name, CERTS : [], CATEGORIAS : []}});
    };//ShowMe

    render()
    {
        return (
            <div id = "homeContainer">
                <HomeContext.Provider value = {this.state.user}>
                {this.InsertMenuScreen()}
                <Menu callback = {this.OnMenuItem} />
                </HomeContext.Provider>
            </div>
        );
    }
};

export default Home;

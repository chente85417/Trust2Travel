import React, { Component } from 'react';
import HomeContext from '../../Contexts/HomeContext.js';
//--------------------COMPONENTS--------------------//
import Loading from '../Loading/Loading.js';
import SmallCard from '../SmallCard/SmallCard.js';
//----------------------ASSETS----------------------//
import iconNoFavs from '../../assets/icon-no-favs.svg';
//----------------------STYLES----------------------//
import './Favs.scss';

class Favs extends Component
{
    constructor(props){
        super(props);
        this.state = {
            loadedData : -1
        };
        this.processedArrayResults = [];
        this.user = "";
    }

    componentDidMount = () => {
        const searchData = {
            "user" : this.user
        };
        console.log(searchData);

        fetch(`${process.env.REACT_APP_URLBACK}getFavs`, {
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
                if (data.data.length)
                {
                    //Process the results
                    this.processedArrayResults = [];
                    let aux = [];
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

                    this.setState({loadedData : 1});
                }//if
                else
                {
                    this.setState({loadedData : 0});
                }//else
            }//else
        });        
    };//componentDidMount

    DeleteMe = () => {
        this.componentDidMount();
    };//DeleteMe

    InsertElements = () => {
        let arrayItems = this.processedArrayResults.map(item => <SmallCard key = {item.ALID} data = {item} callback = {this.DeleteMe} />);
        return (
            <div id="smallCardsViewer">
                {arrayItems}                  
            </div>
        );
    };//InsertElements

    setUser = (user) => {
        this.user = user;
        return(<></>);
    };//setUser

    render()
    {
        let contents = undefined;
        switch (this.state.loadedData)
        {
            case 1:
                {
                    contents =  <>
                                    <p id="smallCardsViewerCaption">{`${this.processedArrayResults.length} alojamientos guardados`}</p>
                                    {this.InsertElements()}
                                </>;
                    break;
                }
            case 0:
                {
                    contents =  <>
                                    <p id="smallCardsViewerCaption"></p>
                                    <div id="imageContainer"><img src={iconNoFavs} alt="imagen no favoritos"/></div>
                                    <p id="text">Aún no has guardado ningún alojamiento en favoritos</p>
                                </>;
                    break;
                }
            default:
                {
                    contents =  <>
                                    <p id="smallCardsViewerCaption">{`Consultando...`}</p>
                                    <Loading />
                                </>;
                }
        }//switch
        return (
            <div id = "favsContainer">
                <HomeContext.Consumer>
                {value => this.setUser(value)}
                </HomeContext.Consumer>
                {contents}
            </div>
        );
    }
};

export default Favs;

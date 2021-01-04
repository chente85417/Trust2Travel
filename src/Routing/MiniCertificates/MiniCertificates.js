import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
import Loading from '../Loading/Loading.js';
//----------------------ASSETS----------------------//
//----------------------STYLES----------------------//
import './MiniCertificates.scss';

class MiniCertificates extends Component
{
    constructor(props){
        super(props);
        this.state = {
            loadedData : false
        };
        this.currentResults = undefined;
    }

    componentDidMount(){
        fetch(`${process.env.REACT_APP_URLBACK}getCertificates/${this.props.alID}`)
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

    InsertComponents = () => {
        return (
            <>
                <p id="caption">{this.props.caption}</p>
                {this.currentResults.map(item => {
                    return (
                        <div key = {item.CERTID} className="certificateContainer">
                            <div className="logoContainer">
                                <img src = {item.LOGO} alt = "logo"/>
                            </div>
                            <p>{item.ETIQUETA}</p>
                        </div>
                    );
                })}
            </>    
        );
    };//InsertComponents

    render()
    {
        return (
            <div id = "miniCertificatesContainer">
                {this.state.loadedData ? this.InsertComponents() : <Loading />}
            </div>
        );
    }
};

export default MiniCertificates;

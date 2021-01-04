import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
//----------------------STYLES----------------------//
import './SmallCertificate.scss';

class SmallCertificate extends Component
{
    render()
    {
        return (
            <div className = "smallCertificateContainer">
                <div className="logoContainer">
                    <img src = {this.props.data.LOGO} alt = "logo"/>
                </div>
                <div className="label">
                    <p>{this.props.data.ETIQUETA}</p>
                </div>
            </div>
        );
    }
};

export default SmallCertificate;

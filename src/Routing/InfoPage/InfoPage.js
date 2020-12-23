import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
import logo from '../../assets/t2t-Logo.svg';
//----------------------STYLES----------------------//
import './InfoPage.scss';

class InfoPage extends Component
{
    render()
    {
        return (
            <div id = "infoPageContainer">
                <img id="logoInInfo" src={logo} alt="logo de Trust2Travel"/>
                <p id="p1">{this.props.text1}</p>
                <p id="p2">{this.props.text2}</p>
                <p id="p3">{this.props.text3}</p>
            </div>
        );
    }
};

export default InfoPage;

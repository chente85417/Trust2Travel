import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
import logo from '../../assets/t2t-Logo.svg';
import { Redirect, withRouter } from "react-router-dom";

//----------------------STYLES----------------------//
import './Logo.scss';

class Logo extends Component
{
    constructor(props) {
        super(props);
        this.state = {launchLoginFront : false};
    }

    componentDidMount()
    {
        setTimeout(() => this.setState({launchLoginFront: true}), 3000);
    };

    render()
    {
        return (
            <div id = "logoContainer">
                {this.state.launchLoginFront ?
                    <Redirect to="/inicio" /> :
                    <img id="App-logo" src={logo} alt="logo de Trust2Travel"/>}
            </div>
        );
    }
};

export default withRouter(Logo);

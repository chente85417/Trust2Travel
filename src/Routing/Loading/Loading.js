import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
import Spinner from 'react-bootstrap/Spinner';
//----------------------ASSETS----------------------//
//----------------------STYLES----------------------//
import './Loading.scss';

class Loading extends Component
{
    render()
    {
        return (
            <div id = "loadingContainer">
                <Spinner id="spinner" animation="border" />
            </div>
        );
    }
};

export default Loading;

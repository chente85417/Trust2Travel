import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
//----------------------STYLES----------------------//
import './SmallCategory.scss';

class SmallCategory extends Component
{
    render()
    {
        return (
            <div className = "smallCategoryContainer">
                <p>{this.props.data}</p>
            </div>
        );
    }
};

export default SmallCategory;

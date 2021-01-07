import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
import iconClose from '../../assets/icon-close.svg';
//----------------------STYLES----------------------//
import './Filters.scss';

class Filters extends Component
{
    constructor(props){
        super(props);
        this.state = {
            selectedFilters : this.props.arraySelectedFilters
        };
    }
    onClickedClose = (event) => {
        if (event.currentTarget.getAttribute("id") === "buttonSearch")
        {
            this.props.callback(this.state.selectedFilters, true);
        }//if
        else
        {
            this.props.callback(this.state.selectedFilters);
        }//else
    }//onClickedClose

    ToggleFilter = (event) => {
        let arrayFiltersChanged = this.state.selectedFilters;
        arrayFiltersChanged[event.target.value] = !this.state.selectedFilters[event.target.value];
        this.setState({selectedFilters : arrayFiltersChanged});
    };//ToggleFilter

    CleanFilters = () => {
        this.setState({selectedFilters : [false, false, false]})
    };//CleanFilters

    render()
    {
        return (
            <div id="filtersBkg">
                <div id = "filtersContainer">
                    <div id="filtersControls">
                        <div id="closeContainer" onClick = {this.onClickedClose}>
                            <img src={iconClose} alt="icono de cerrar"/>
                        </div>
                        <p id="caption">Filtros</p>
                        <p id="explanation">Elige los tipos de certificados que quieres que tenga tu alojamiento</p>
                        <div className="itemContainer">
                            <div>
                                <input  type="checkbox" id="envManagement" name="envManagement" value="0"
                                        checked={this.state.selectedFilters[0]}
                                        onChange={this.ToggleFilter}/>
                                <label htmlFor="envManagement">Gestión ambiental</label>
                            </div>
                            <p className="itemText">Organización y gestión de los recursos para prevenir y mitigar el impacto ambiental.</p>
                        </div>
                        <div className="itemContainer">
                            <div>
                                <input  type="checkbox" id="ecoTourism" name="ecoTourism" value="1"
                                        checked={this.state.selectedFilters[1]}
                                        onChange={this.ToggleFilter}/>
                                <label htmlFor="ecoTourism">Eco-turismo</label>
                            </div>
                            <p className="itemText">Alojamientos responsables en áreas naturales que cuidan el ambiente y el bienestar de la población local</p>
                        </div>
                        <div className="itemContainer">
                            <div>
                                <input  type="checkbox" id="agroTourism" name="agroTourism" value="2"
                                        checked={this.state.selectedFilters[2]}
                                        onChange={this.ToggleFilter}/>
                                <label htmlFor="agroTourism">Agro-turismo</label>
                            </div>
                            <p className="itemText">Alojamientos para descubrir y disfrutar de los entornos rurales y naturales que rodean el entorno.</p>
                        </div>
                        <p id="clean" onClick={this.CleanFilters}>Limpiar filtros</p>
                        <button type="button" id="buttonSearch" className="button" onClick={this.onClickedClose}>Mostrar resultados</button>
                    </div>
                </div>
            </div>
        );
    }
};

export default Filters;

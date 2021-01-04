import React, { Component } from 'react';
//--------------------COMPONENTS--------------------//
import Filters from '../Filters/Filters.js';
import Loading from '../Loading/Loading.js';
import ListGroup from 'react-bootstrap/ListGroup';
//----------------------ASSETS----------------------//
import iconFilter from '../../assets/icon-filter.svg';
//----------------------STYLES----------------------//
import './Seeker.scss';

class Seeker extends Component
{
    constructor(props){
        super(props);
        this.state = {
            showFilters : false,
            showLocationsList : false,
            hasFilters : false,
            initialized : false
        };
        this.initData = [];
        this.currentLocationsList = [];
        this.inputRef = React.createRef();
        this.arraySelectedFilters = this.props.currentSearch.filtros;
        
    }
    onClickedFilters = () => {
        this.setState({showFilters : true});
    }//onClickedFilters

    closeFilters = (arraySelectedFilters, search = false) => {
        this.arraySelectedFilters = arraySelectedFilters;
        //console.log(this.arraySelectedFilters);
        this.setState({showFilters : false, hasFilters : this.arraySelectedFilters.reduce((acum, item) => item || acum, false)});
        if (search)
        {
            this.PrepareQuery();
        }//if
    }//closeFilters

    componentDidMount(){
        //Retrieve from DB all data needed for seeker to operate
        //Retrieved once reducing DB query stress
         fetch(`${process.env.REACT_APP_URLBACK}initSeekerData`)
         .then(res => res.json()).then(data => {
            if (data.ret)
            {
                this.initData = data.caption.map(item => item.RES);
                this.setState({initialized : true});
                //console.log(this.initData);
            }//if
            /*
            else
            {
                this.messageBoxCfg = {title : "Error", body : data.caption};
                this.setState({showMessage : true});
            }//else
            */
        });
    }//componentDidMount

    OnChangeInput = (event) => {
        event.preventDefault();
        //console.log(event.target.value);
        if (event.target.value !== "")
        {
            let regex = new RegExp(`^${event.target.value}[a-zA-Z\u00C0-\u017F\\s]*$`, 'i');
            //console.log(regex);
            this.currentLocationsList = this.initData.filter(item => regex.test(item));
            //console.log(this.currentLocationsList);

            this.setState({showLocationsList : true});
        }//if
        else
        {
            this.setState({showLocationsList : false});
        }//else
    };//OnChangeInput

    InsertList = () => {
        let arrayItems = [];
        let cont = 0;
        while(/*(cont < 4) && */(cont < this.currentLocationsList.length))
        {
            arrayItems.push(<ListGroup.Item key = {cont} eventKey = {this.currentLocationsList[cont]} >{this.currentLocationsList[cont]}</ListGroup.Item>);
            ++cont;
        }//while

        //console.log(arrayItems);

        return (
            <ListGroup onSelect = {this.LocationClicked}>
                {arrayItems}
            </ListGroup>
        );
    };//InsertList

    LocationClicked = (key) => {
        this.inputRef.current.value = key;
        this.PrepareQuery();
        this.setState({showLocationsList : false});
    };//LocationClicked

    SendSearch = () => {
    };//SendSearch

    RequestQuery = (event) => {
        event.preventDefault();
        this.PrepareQuery();
    };//RequestQuery

    PrepareQuery = () => {
        const searchData = {
            provincia : this.inputRef.current.value,
            comunidad : this.inputRef.current.value,
            filtros : this.arraySelectedFilters
        };
        this.props.callbackSearch(searchData);
    };//PrepareQuery

    InsertComponents = () => {
        return (
            <form method = "GET" action = "" id = "seekerContainer" onSubmit={this.RequestQuery}>
                {this.state.showFilters ? <Filters  arraySelectedFilters = {this.arraySelectedFilters}
                                                    callback  = {this.closeFilters} /> : <></>}
                <div id="textContainer">
                    <input  type="text" id="seekerText" name="seekerText" 
                            placeholder="¿A dónde quieres ir?" tabIndex="1" autoFocus={true}
                            onChange = {this.OnChangeInput} ref = {this.inputRef} defaultValue = {this.props.currentSearch.provincia}/>
                    {this.state.showLocationsList ? this.InsertList() : <></>}
                </div>
                <div id="filterContainer" onClick={this.onClickedFilters}>
                    <img src={iconFilter} alt="icono del filtro"/>
                    {this.state.hasFilters ? <div id="activeFilters"></div> : <></>}
                </div>
            </form>
        );
    };//InsertComponents

    render()
    {
        return(
            <>
                {/* <Loading /> */}
                {this.state.initialized ? this.InsertComponents() : <Loading />}
            </>
        );
    }
};

export default Seeker;

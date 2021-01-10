import React, { Component } from 'react';
import { MapContainer, WMSTileLayer, LayersControl, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
import icon from '../../assets/marker-icon-mini.png';
import iconMain from '../../assets/main-icon-mini.png';
import iconShadowMain from '../../assets/marker-shadow-mini.png';
//----------------------STYLES----------------------//
import './Map.scss';
import 'leaflet/dist/leaflet.css';

//import { Tooltip } from 'leaflet';

var mainIcon = L.icon({
    iconUrl: iconMain,
    shadowUrl: iconShadowMain,

    iconSize:       [18, 29],
    shadowSize:     [29, 29],
    iconAnchor:     [9, 28],
    shadowAnchor:   [9, 28]
});

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadowMain,

    iconSize:       [18, 29],
    shadowSize:     [29, 29],
    iconAnchor:     [9, 28],
    shadowAnchor:   [9, 28]
});

L.Marker.prototype.options.icon = DefaultIcon;

class Map extends Component
{
    constructor(props){
        super(props);
        this.mainLong = this.props.main.longitude;
        this.mainLat = this.props.main.latitude;
        this.mainName = this.props.main.name;
    }

    OnClickedPopup = (event) => {
        event.preventDefault();
        this.props.callback(event.currentTarget.getAttribute("id"), event.currentTarget.value);
    };//OnClickedPopup

    InsertNearbys = (items) => {
        let arrayNearbys = items.map(element => {
            return(
                <Marker key = {element.ALID} position={[element.LATITUD, element.LONGITUD]}>
                    <Popup>
                        <p id={element.ALID} onClick={this.OnClickedPopup}>{element.NOMBRE}</p>
                    </Popup>
                </Marker>
            );
        });
        return (
            <>
                {arrayNearbys}
            </>
        );
    };//InsertNearbys

    render()
    {
        return (
            <div id = "mapContainer">
                <MapContainer center={[this.mainLat, this.mainLong]} zoom={this.props.zoomLevel} scrollWheelZoom={false}>
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked name="OpenStreetMap">
                            <TileLayer
                                opacity="1"
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                //url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer name="Satélite">
                            <WMSTileLayer
                                layers= "OI.OrthoimageCoverage"
                                format= 'image/jpeg'
                                transparent= 'false'
                                opacity="1"
                                version= '1.3.0'
                                attribution= "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España"
                                //attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS"
                                //url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <Marker position={[this.mainLat, this.mainLong]} icon={mainIcon}>
                        {this.mainName !== "" ? <Popup>{this.mainName}</Popup> : <></>}
                    </Marker>
                    {this.InsertNearbys(this.props.nearbyElements)}
                </MapContainer>
            </div>
        );
    }
};

export default Map;

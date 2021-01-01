import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
//--------------------COMPONENTS--------------------//
//----------------------ASSETS----------------------//
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
//----------------------STYLES----------------------//
import './Map.scss';
import 'leaflet/dist/leaflet.css';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

class Map extends Component
{
    render()
    {
        return (
            <div id = "mapContainer">
                <p id="caption">Localización</p>
                <MapContainer center={[this.props.latitude, this.props.longitude]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[this.props.latitude, this.props.longitude]}>
                        <Popup>{this.props.name}</Popup>
                    </Marker>
                </MapContainer>
            </div>
        );
    }
};

export default Map;

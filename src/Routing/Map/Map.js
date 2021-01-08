import React, { Component } from 'react';
import { MapContainer, WMSTileLayer, LayersControl, TileLayer, Marker, Popup } from 'react-leaflet';
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
/*
var pnoa = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&", {
    layers: "OI.OrthoimageCoverage",//nombre de la capa (ver get capabilities)
    format: 'image/jpeg',
    transparent: true,
    version: '1.3.0',//wms version (ver get capabilities)
    attribution: "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España"
 }).addTo(map);
*/
class Map extends Component
{
    render()
    {
        return (
            <div id = "mapContainer">
                <p id="caption">Localización</p>
                <MapContainer center={[this.props.latitude, this.props.longitude]} zoom={13} scrollWheelZoom={false}>
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
                    <Marker position={[this.props.latitude, this.props.longitude]}>
                        <Popup>{this.props.name}</Popup>
                    </Marker>
                </MapContainer>
            </div>
        );
    }
};

export default Map;

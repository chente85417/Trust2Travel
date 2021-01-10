import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//--------------------COMPONENTS--------------------//
import Carousel from 'react-bootstrap/Carousel';
//----------------------ASSETS----------------------//
import onboarding1 from '../../assets/onboarding1.png';
import onboarding2 from '../../assets/onboarding2.png';
import onboarding3 from '../../assets/onboarding3.png';
//----------------------STYLES----------------------//
import './Onboarding.scss';

class Onboarding extends Component
{
    render()
    {
        return (
            <div id = "onboardingContainer">
                <Link to="/home">
                    <p id="omitir">omitir</p>
                </Link>
                <div id="carouselContainer">  
                    <Carousel>  
                        <Carousel.Item className="item" >
                            <img    className="d-block w-100"  
                                    src={onboarding1}
                                    alt="" />  
                            <Carousel.Caption>
                                <div className="innerTextContainer">
                                    <h3>Viaja consciente</h3>
                                    <p>Con Trust2Travel, encuentra los mejores alojamientos con certificados de sostenibilidad, ecoturismo y gestión ambiental</p>
                                </div>
                            </Carousel.Caption>  
                        </Carousel.Item  >  
                        <Carousel.Item className="item" >  
                            <img    className="d-block w-100"  
                                    src={onboarding2}
                                    alt="" />  
                            <Carousel.Caption>
                                <div className="innerTextContainer">
                                    <h3>Actividades que complementan</h3>
                                    <p>Encuentra actividades recomendadas por las entidades certificadoras cerca de tus alojamientos favoritos</p>
                                </div>
                            </Carousel.Caption>  
                        </Carousel.Item>
                        <Carousel.Item className="item" >  
                            <img    className="d-block w-100"  
                                    src={onboarding3}
                                    alt="" />  
                            <Carousel.Caption>
                                <div className="innerTextContainer">
                                    <h3>Guarda tus lugares favoritos</h3>
                                    <p>Guarda los sitios que más te han gustado y busca información sobre los certificados que utilizamos en Trust 2 Travel</p>
                                </div>
                            </Carousel.Caption>  
                        </Carousel.Item>    
                    </Carousel>  
                </div>  
            </div>
        );
    }
};

export default Onboarding;

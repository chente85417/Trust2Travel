import React, { Component } from 'react';
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
//import DetailsContext from './Contexts/DetailsContext.js';
//--------------------COMPONENTS--------------------//
import Logo from './Routing/Logo/Logo.js';
import LoginFront from './Routing/LoginFront/LoginFront.js';
import FormRegister from './Routing/FormRegister/FormRegister.js';
import FormLogin from './Routing/FormLogin/FormLogin.js';
import Onboarding from './Routing/Onboarding/Onboarding.js';
import Home from './Routing/Home/Home.js';
import Details from './Routing/Details/Details.js';
import InfoPage from './Routing/InfoPage/InfoPage.js';
import ResetPass from './Routing/ResetPass/ResetPass.js';
import NewPass from './Routing/NewPass/NewPass.js';
import Loading from './Routing/Loading/Loading.js';
//----------------------ASSETS----------------------//

//----------------------STYLES----------------------//
import './App.scss';

class App extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {  loadPage : "/", comp : <Logo />,
                    viewLogin: false,
                    user: 1,
                    infoTexts : ["1", "2", "3"],
                    homeData : undefined
                    /*currentDetailID : undefined*/
                  };
    this.arrayTextsRegister = [
      "Gracias por registrarse!",
      "Se ha enviado un link de confirmación a su cuenta de correo electrónico.",
      "Para finalizar el procedimiento de registro haga click en el vínculo que se muestra en el correo."];
    this.arrayTextsReset = [
      "Se ha enviado un link a su cuenta de correo electrónico.",
      " Haga click en el link y se le llevará a una página donde podrá generar una nueva clave.",
      ""];
  }

  setInfoTexts = (arrayTexts) => {
    this.setState({infoTexts : [arrayTexts[0], arrayTexts[1], arrayTexts[2]]});
  }//setInfoTexts

  componentDidMount(){
    localStorage.removeItem('currentHomeSearch');
    if (this.state.homeData === undefined)
    {
      //console.log("tratamos de obtener los datos para el home");
      fetch(`${process.env.REACT_APP_URLBACK}getCertificatesBasics`)
      .then(res => res.json()).then(data => {
         if (data.ret)
         {
             //console.log("desde el didmount de App.js ", data.caption);
             this.setState({homeData : data.caption});
         }//if
         /*
         else
         {
             this.messageBoxCfg = {title : "Error", body : data.caption};
             this.setState({showMessage : true});
         }//else
         */
     });
    }//if
  }
/*
  SetALID = (id) => {
    this.setState({currentDetailID : id});
    <Redirect to="/details" />;
  };//SetALID
*/
  render()
  {
    //localStorage.removeItem('currentHomeSearch');
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/">
              {!this.state.viewLogin ? <Logo /> : <LoginFront />} 
            </Route>
            <Route path="/inicio">
              <LoginFront />
            </Route>
            <Route path="/revista">
              {this.state.user ? <Onboarding /> : <Redirect to="/" />}
            </Route>
            <Route path="/registro">
              {<FormRegister callback = {this.setInfoTexts} />}
            </Route>
            <Route exact path="/login/confirm">
              {<FormLogin confirm = {true} />}
            </Route>
            <Route path="/login">
              {<FormLogin confirm = {false} />}
            </Route>
            <Route path="/home">
              {/* <DetailsContext.Provider value = {this.SetALID}> */}
                {this.state.homeData !== undefined ? <Home initData = {this.state.homeData} /> : <Loading />} 
              {/* </DetailsContext.Provider> */}
            </Route>
            <Route path="/details">
              <Details />
            </Route>
            <Route exact path="/infoPage/GenericError">
              {<InfoPage text1 = "Lo sentimos, no es posible acceder a la aplicación" text2 = "Error acceso OAuth" text3 = "Se ha producido un problema que impide el acceso a través de OAuth. Inténtalo de nuevo más tarde." />}
            </Route>
            <Route exact path="/infoPage/FailOAuth">
              {<InfoPage text1 = "No es posible acceder a la aplicación" text2 = "Confirmación de registro pendiente" text3 = "Aunque hayas utilizado Google debes confirmar previamente tu registro. Revisa tus correos pues Trust2Travel te ha enviado un correo con un link de confirmación." />}
            </Route>
            <Route exact path="/infoPage/register">
              {<InfoPage text1 = {this.arrayTextsRegister[0]} text2 = {this.arrayTextsRegister[1]} text3 = {this.arrayTextsRegister[2]} />}
            </Route>
            <Route exact path="/infoPage/reset">
              {<InfoPage text1 = {this.arrayTextsReset[0]} text2 = {this.arrayTextsReset[1]} text3 = {this.arrayTextsReset[2]} />}
            </Route>
            <Route path="/resetPass">
              {<ResetPass callback = {this.setInfoTexts} />}
            </Route>
            <Route path="/newPass">
              {<NewPass />}
            </Route>
          </Switch>
        </Router>
      </div>
    );
  };
};

export default App;

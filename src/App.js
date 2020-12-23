import React, { Component } from 'react';
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
//--------------------COMPONENTS--------------------//
import Logo from './Routing/Logo/Logo.js';
import LoginFront from './Routing/LoginFront/LoginFront.js';
import FormRegister from './Routing/FormRegister/FormRegister.js';
import FormLogin from './Routing/FormLogin/FormLogin.js';
import Onboarding from './Routing/Onboarding/Onboarding.js';
import Home from './Routing/Home/Home.js';
import InfoPage from './Routing/InfoPage/InfoPage.js';
import ResetPass from './Routing/ResetPass/ResetPass.js';
import NewPass from './Routing/NewPass/NewPass.js';
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
                    infoTexts : ["1", "2", "3"] };
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

  render()
  {
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
              {<Home />}
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

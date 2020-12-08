import { Factoria } from "./factoria.js";
import { MessageBox } from "./messageBox.class.js";
import {Validator} from '../lib/validator.class.js';

export class FormLogin{
    constructor(callbackAction, callbackLoginOauth = null)
    {
        this.callback = callbackAction;
        this.callbackLoginOAuth = callbackLoginOauth;
        this.nodeForm = Factoria("form", [  ["id", "formLogin"],
                                            ["name", "formLogin"],
                                            ["action", ""],
                                            ["method", "POST"]], "");
        this.createWindow();
    }

    createWindow()
    {
        const nodeContLoginData = Factoria("div", [["id", "contLoginData"], ["class", "contLoginData"]], "");
            //USER EMAIL CONTROL
            const nodeEditEmail = Factoria("div", [["class", "editElements"]], "");
                let nodeLabelEdit = Factoria("label", [["for", "userEmail"]], "Usuario (email):");
                let nodeInputEdit = Factoria("input", [ ["type", "email"],
                                                    ["name", "userEmail"],
                                                    ["id", "userEmail"],
                                                    ["placeholder", "email usuario"],
                                                    ["tabindex", "1"],
                                                    ["autofocus", "true"],
                                                    ["required", "true"]], "");
            nodeEditEmail.appendChild(nodeLabelEdit);
            nodeEditEmail.appendChild(nodeInputEdit);
        nodeContLoginData.appendChild(nodeEditEmail);
            //PASSWORD CONTROL
            const nodeEditPass = Factoria("div", [["class", "editElements"]], "");
                nodeLabelEdit = Factoria("label", [["for", "passUser"]], "Contraseña:");
                nodeInputEdit = Factoria("input", [ ["type", "password"],
                                                    ["name", "passUser"],
                                                    ["id", "passUser"],
                                                    ["placeholder", "contraseña"],
                                                    ["tabindex", "2"],
                                                    ["autofocus", "true"],
                                                    ["required", "true"]], "");
            nodeEditPass.appendChild(nodeLabelEdit);
            nodeEditPass.appendChild(nodeInputEdit);
        nodeContLoginData.appendChild(nodeEditPass);
            //FORM BUTTONS
        const nodeBtnsContainer = Factoria("div", [["id", "btnsContainerLogin"]], "");
            const nodeBtnSubmit = Factoria("button", [  ["type", "button"],
                                                        ["id", "btnLoginSubmit"],
                                                        ["class", "btn"]], "Entrar");
        
            const nodeBtnCancel = Factoria("button", [  ["type", "button"],
                                                        ["id", "btnLoginCancel"],
                                                        ["class", "btn"]], "Cancelar");
        nodeBtnsContainer.appendChild(nodeBtnSubmit);
        nodeBtnsContainer.appendChild(nodeBtnCancel);

            //OAUTH BUTTONS
        const nodeOAuthBtnsContainer = Factoria("div", [["id", "btnsContainerOAuthLogin"]], "");
            const nodeBtnGoogle = Factoria("button", [  ["type", "button"],
                                                        ["id", "btnOAuthGoogle"],
                                                        ["class", "btn"]], "Entrar con Google");
    
            const nodeBtnFacebook = Factoria("button", [["type", "button"],
                                                        ["id", "btnOAuthFacebook"],
                                                        ["class", "btn"]], "Entrar con Facebook");
        nodeOAuthBtnsContainer.appendChild(nodeBtnGoogle);
        nodeOAuthBtnsContainer.appendChild(nodeBtnFacebook);

        this.nodeForm.appendChild(nodeContLoginData);
        this.nodeForm.appendChild(nodeBtnsContainer);
        this.nodeForm.appendChild(nodeOAuthBtnsContainer);

        //EVENT HANDLING
        nodeBtnSubmit.addEventListener("click", (evnt) => {this.OnClickedLogin(evnt)});
        nodeBtnCancel.addEventListener("click", (evnt) => {this.OnClickedCancel(evnt)});
        nodeBtnGoogle.addEventListener("click", (evnt) => {this.OnClickedOAuthGoogle(evnt)});
        nodeBtnFacebook.addEventListener("click", (evnt) => {this.OnClickedOAuthFacebook(evnt)});
    }//createWindow

    OnClickedLogin(evnt)
    {
        //Validate form data
        //EMAIL not null, valid email structure
        //PASSWORD not null, between 6 - 10 characters, must have letters, numbers and some special characters
        
        //EMAIL
        //Retrieve data
        const userEmail = document.querySelector("#userEmail").value;
        const validator = new Validator();
        if (!validator.ValidateEmail(userEmail))
            return;
    
        //PASSWORD
        //Retrieve data
        const passUser = document.querySelector("#passUser").value;
        if (!validator.ValidatePassword(passUser, /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/))
            return;

        //Create JSON object with register data
        const loginData = {
                "email" : userEmail,
                "password" : passUser
        };

        this.callback(true, loginData);
        this.nodeForm.remove();  
    }//OnClickedLogin

    OnClickedCancel(evnt)
    {
        const ret = {
            "res" : 0,
            "msg" : "cancel"
        };
        this.nodeForm.remove();      
        this.callback(false, ret);
    }//OnClickedCancel

    OnClickedOAuthGoogle(evnt)
    {
        this.nodeForm.remove();
        if (this.callbackLoginOAuth)
        {
            this.callbackLoginOAuth({provider : "Google"});
        }//if
    }//OnClickedOAuthGoogle

    OnClickedOAuthFacebook(evnt)
    {
        this.nodeForm.remove();
        if (this.callbackLoginOAuth)
        {
            this.callbackLoginOAuth({provider : "Facebook"});
        }//if
    }//OnClickedOAuthFacebook
};
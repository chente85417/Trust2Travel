import {FormRegister} from './formRegister.class.js';
import {FormLogin} from './formLogin.class.js';
import {MessageBox} from './messageBox.class.js';

//--------------------CALLBACKS--------------------//
const formRegisterCallback = (ret, callbackData) => {
    if (ret)
    {
        fetch("http://localhost:8888/register", {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(callbackData)
            }
        ).then(res => res.json()).then(data => {
            switch (data.res)
            {
                case 0:
                    {
                        const msg = [
                            {
                                "caption" : data.msg,
                                "class" : "highText"
                            }
                        ];
                        const cfg = {
                            "operation" : "Inform",
                            "btn1Caption" : "",
                            "btn2Caption" : ""
                        };
                        let message = new MessageBox(msg, cfg, null);
                        message.DoModal();
                        document.querySelector("#loginContainer").className = "";
                        break;
                    }
                case 1:
                    {
                        document.querySelector("#loginContainer").className = "";
                        break;
                    }
            }//switch
        });
    }
    else
    {
        //document.querySelector("#loginContainer").className = "";
    }//else
};//formRegisterCallback

const formLoginCallback = (ret, callbackData) => {
    if (ret)
    {
        fetch("http://localhost:8888/login", {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(callbackData)
            }
        ).then(res => res.json()).then(data => {
            switch (data.res)
            {
                case 0:
                    {
                        const msg = [
                            {
                                "caption" : data.msg,
                                "class" : "highText"
                            }
                        ];
                        const cfg = {
                            "operation" : "Inform",
                            "btn1Caption" : "",
                            "btn2Caption" : ""
                        };
                        let message = new MessageBox(msg, cfg, null);
                        message.DoModal();
                        break;
                    }
                case 1:
                    {
                        break;
                    }
            }//switch
        });
    }
    else
    {
        //document.querySelector("#loginContainer").className = "";
    }//else
}//formLoginCallback

const oauthCallback = (oauthData) => {
    fetch(`http://localhost:8888/login${oauthData.provider}`);
}//oauthCallback

//--------------------EVENT LISTENERS--------------------//
document.querySelector("#btn_register").addEventListener("click", (e) => {
    e.preventDefault();

    document.querySelector("main").appendChild(new FormRegister(formRegisterCallback).nodeForm);
    document.querySelector("#formRegister").className = "movForm";
});

document.querySelector("#btn_login").addEventListener("click", (e) => {
    e.preventDefault();

    document.querySelector("main").appendChild(new FormLogin(formLoginCallback, oauthCallback).nodeForm);
    document.querySelector("#formLogin").className = "movForm";
});
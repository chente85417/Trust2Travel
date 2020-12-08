////////////////////////////////////////////
//              THE BRIDGE                //
//                                        //
//    CREW CHALLENGE PROJECT Sept 2020    //
//             TRUST2TRAVEL               //
////////////////////////////////////////////
//                                        //
//Developer:                              //
//  Vicente Alejandro Garcerán Blanco     //
//  vagb.fullstack@gmail.com              //
//                                        //
//*See Readme.md file for complete team   //
//reference                               //
//                                        //
//    Main Express backend server file    //
//                                        //
////////////////////////////////////////////

//---------------MODULES------------------//
const dotenv        = require('dotenv');
const express       = require("express");
const bodyParser    = require("body-parser");
const corsEnable    = require("cors");
const cookieParser  = require("cookie-parser");
const mysql         = require("mysql");
const fetch         = require("node-fetch");
const Validator     = require("./src/lib/validatorNode.class");
const bcrypt        = require("bcrypt");
const {google}      = require("googleapis");

//------------INITIALIZATION--------------//
//Loading of environment variables
dotenv.config();

//Creation of Express server object
const serverObj = express();

//Raise Express server on listening port
serverObj.listen(process.env.PORT || 8888, () => {console.log(`Express server listening on port ${process.env.PORT}`)});

//OAuth2 client for Google
let googleOAuth2Client = undefined;

//Data connection to MySQL
const connectionData = {
    "host" : process.env.DB_HOST,
    "user" : process.env.DB_USER,
    "password" : process.env.DB_PASSWORD,
    "database" : process.env.DB_DATABASE
};

//-------------MIDDLEWARES----------------//
const publicFiles = express.static("src");//Change for build for production
serverObj.use(publicFiles);
serverObj.use(bodyParser.urlencoded({"extended" : false}));
serverObj.use(bodyParser.json());
serverObj.use(corsEnable());
serverObj.use(cookieParser());

//-------------FUNCTIONS----------------//
const validateRegisterData = (data) => {
	if (data === undefined || data === null) {
		return {"ret" : false, "msg" : "Datos de registro no definidos!"};
    }
    
    const validator = new Validator();

	//EMAIL
	let validatorOutput = validator.ValidateEmail(data.email);
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//PASSWORD
	validatorOutput = validator.ValidatePassword(data.password, /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/);
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//BIRTHDAY
	validatorOutput = validator.ValidateDate(data.dateBirth);
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//GENDER
	validatorOutput = validator.ValidateOption(data.gender, ["Hombre", "Mujer", "Otro"]);
	if (!validatorOutput.ret){
		return validatorOutput.msg;
	}
	return true;
};//validateRegisterData

const validateLoginData = (data) => {
	if (data === undefined || data === null) {
		return {"ret" : false, "msg" : "Datos de acceso no definidos!"};
    }
    
    const validator = new Validator();

	//EMAIL
	let validatorOutput = validator.ValidateEmail(data.email);
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	//PASSWORD
	validatorOutput = validator.ValidatePassword(data.password, /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/);
	if (!validatorOutput.ret) {
		return validatorOutput.msg;
	}
	return true;
};//validateLoginData

const connectorDB = (dbms, connectionData) => {
	let connectionDB = null;
	switch (dbms) {
	case "MySQL":
	{
		const prom = new Promise((resolve, reject) => {
			if (mysql !== undefined) {
				if (typeof connectionData !== "object") {
					reject({"ret" : 0, "msg" : "MySQL connection data is not a valid JSON"});
				}
				try {
					console.log(connectionData);
					connectionDB = mysql.createConnection(connectionData);
				} catch (e) {
					reject({"ret" : 0, "msg" : `Unable to create MySQL connection
				Please check connection data is correct`});
				}
				if (connectionDB){
					console.log("intentando conectar");
					connectionDB.connect(function(err) {
						if (err) {
							reject({"ret" : 0, "msg" : err});
						}
						resolve(connectionDB);
					});
				}
			} else {
				reject({"ret" : 0, "msg" : `MySQL connection failed
			mysql driver not found`});
			}
		});
		return prom;
	}
	case "Mongo":
	{
		break;
	}
	}
};//connectorDB

const createGoogleOAuth = () => {
    //Retrieve previously stored credentials for accessing Google auth service
    let GOOGLE_CLIENT_SECRET    = `${process.env.GOOGLE_CLIENT_SECRET}`;
    let GOOGLE_CLIENT_ID        = `${process.env.GOOGLE_CLIENT_ID}`;
    //Creation of an OAuth2 client for the application
    //This object is in charge of communication with Google auth service
    return new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        //This is the url Google will call once the permissions are granted
        "http://localhost:8888/login/?Provider=Google"
    );
};//createGoogleOAuth

const getGoogleOAuthUrl = (oauthClient) => {
    //Define scopes for data retrieving
	const scopes = [
		"https://www.googleapis.com/auth/userinfo.profile",
		"https://www.googleapis.com/auth/userinfo.email",
	];
    //Return the url to redirect the user to ask for permissions on Google
	return oauthClient.generateAuthUrl({
		"access_type": "offline",
		"prompt": "consent",
		//A single scope can be passed as string
		"scope": scopes
	});
};//getGoogleOAuthUrl

//-----------SERVER ROUTING---------------//
//REGISTER NEW USER (POST)
serverObj.post("/register", (req, res) => {
    //Validate new user data
    const validationResults = validateRegisterData(req.body);
    if (validationResults !== true)
    {
        //Validation KO --> exit
        res.send({"res" : 0, "msg" : validationResults.msg});
        //TODO: REDIRIGIR A / POR DATOS DE REGISTRO ERRÓNEOS
    }//if
    else
    {
        //Validation OK --> Connect to DB
        connectorDB("MySQL", connectionData)
			.then((connectionDB) => {
                //DB connection OK --> Check if new user is already registered
				connectionDB.query({
                    sql : "SELECT USRID FROM usuarios WHERE EMAIL LIKE ?",
                    values : [req.body.email]},
                    function (err, result) {
                    if (err)
                    {
                        //Query KO --> error
                        throw err;
                        //TODO: TRATAR EL ERROR Y REDIRIGIR A /
                    }//if
                    else if (result.length)
                    {
                        //Found user in DB --> No registering and exit
                        res.send({"res" : "0", "msg" : "Usuario ya registrado!"});
                        //TODO: REDIRIGIR A / POR USUARIO YA REGISTRADO
                    }//else if
                    else
                    {
                        //User OK --> Store in DB
                        //Hash the password
                        bcrypt.hash(req.body.password, 10)
                            .then(hash => {
                                //Password hashed OK --> Proceed to store new user in DB
                                connectionDB.query({
                                    sql : `INSERT INTO usuarios(USRID, EMAIL, PASS, FECHANACIMIENTO, GENERO)
                                                        VALUES (NULL, ?, ?, ?, ?)`,
                                    values : [req.body.email, hash, req.body.dateBirth, req.body.gender],
                                    function (err, result) {
                                        if (err)
                                        {
                                            //Query KO --> error
                                            throw err;
                                            //TODO: TRATAR EL ERROR Y REDIRIGIR A /
                                        }//if
                                        else if (result.affectedRows)
                                        {
                                            //Query OK --> New user registered
                                            connectionDB.end();
                                            //Proceed to grant access with JWT authorization
                                            //Generate JWT
                                            const Payload = {
                                                "user" : req.body.email,
                                                "iat" : new Date()
                                            };
                                            const jwt = JWT.buildJWT(Payload);
                                            //Send JWT to the browser
                                            res.cookie("JWT", jwt, {"httpOnly" : true})
                                            .send({"res" : "1", "msg" : "Usuario registrado!"});
                                            //TODO: REDIRIGIR AL ÁREA PERSONAL TRAS REGISTRO VÁLIDO                                            
                                        }//else if
                                    }
                                })
                                .catch(fail => {
                                    connectionDB.end();
                                    //Password hash KO --> exit
                                    res.send(fail);
                                   //TODO: REDIRIGIR A / POR FALLO DE ENCRIPTACIÓN DE PASSWORD
                                })
                            });					
					}//else
				});
            })
            //DB connection KO --> exit
			.catch((fail) => {
                res.send(fail);
                //TODO: REDIRIGIR A / POR FALLO DE CONEXIÓN CON DB
			});
    }//else
});

//CREDENTIALS CHECKOUT (POST)
serverObj.post("/login", (req, res) => {
    //Validate credentials
    const validationResults = validateLoginData(req.body);
    if (validationResults !== true)
    {
        //Validation KO --> exit
        res.send({"res" : 0, "msg" : validationResults.msg});
        //TODO: REDIRIGIR A / POR FALLO DE VALIDACIÓN DE CREDENCIALES
    }//if
    else
    {
        //Validation OK --> Look for the user in DB
        connectorDB("MySQL", connectionData)
		.then((connectionDB) => {
            //DB connection OK --> Check if user is registered
			const sql = "SELECT USRID, PASS, USER_PROFILE FROM users WHERE EMAIL LIKE ?";
			connectionDB.query({
                sql : "SELECT USRID, PASS FROM usuarios WHERE EMAIL LIKE ?",
                values : [req.body.email]},
                function (err, result) {
                    if (err)
                    {
                        //Query KO --> error
                        throw err;
                        //TODO: TRATAR EL ERROR Y REDIRIGIR A /
                    }//if
                    else if (result.length)
                    {
                        connectionDB.end();
                        //Found user in DB --> Checkout the password hash
                        bcrypt.compare(req.body.pass, result[0].PASS)
                            .then(hashResult => {
                                if (hashResult)
                                {
                                    //Hash OK --> Create authentication token and grant access
                                    //Generate JWT
                                    const Payload = {
                                        "user" : req.body.email,
                                        "iat" : new Date()
                                    };
                                    const jwt = JWT.buildJWT(Payload);
                                    //Send JWT to the browser
                                    res.cookie("JWT", jwt, {"httpOnly" : true})
                                    .send({"res" : "1", "msg" : "Sesión abierta"});
                                    //TODO: REDIRIGIR AL ÁREA PERSONAL TRAS LOGIN VÁLIDO
                                }//if
                                else
                                {
                                    //Hash KO --> Reject
                                    res.send({"res" : "0", "msg" : "Contraseña inválida!"});
                                    //TODO: REDIRIGIR A / POR PASSWORD INCORRECTO
                                }//else
                            });
                    }//else if
                    else
                    {
                        connectionDB.end();
                        //Not found user in DB --> Reject login
                        res.send({"res" : "0", "msg" : "Usuario no registrado!"});
                        //TODO: REDIRIGIR A / POR USUARIO NO ENCONTRADO
                    }//else
			    });
        })
        //DB connection KO --> exit
		.catch((fail) => {
            res.send(fail);
            //TODO: REDIRIGIR A / POR FALLO DE CONEXIÓN CON DB
		});
    }//else
});

//OAUTH LOGIN REQUEST USING GOOGLE (GET)
serverObj.get("/loginGoogle", (req, res) => {
    //Creation of Google OAuth2 client
    googleOAuth2Client = createGoogleOAuth();
    //Redirect the user to Google auth permissions
    res.redirect(getGoogleOAuthUrl(googleOAuth2Client));
});

//OAUTH LOGIN REQUEST USING FACEBOOK (GET)
serverObj.get("/loginFacebook", (req, res) => {
    
});

//OAUTH LOGIN (GET)
serverObj.get("/login/:Provider", async (req, res) => {
    const provider = req.params.Provider;
    switch (provider)
    {
        case "Google":
            {
                if (googleOAuth2Client)
                {
                    const {code} = req.query;
                    if (code)
                    {
                        const { tokens } = await googleOAuth2Client.getToken(code);
                        googleOAuth2Client.setCredentials(tokens);
                        if (tokens.id_token && tokens.access_token) {
                            // Fetch the user's profile with the access token and bearer
                            try {
                                const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`, {
                                    headers : {
                                        'Authorization': `Bearer ${tokens.id_token}`
                                    }
                                });
                                const googleUser = await res.json();
                            } catch (error) {
                                console.log(error);
                                // throw new Error(error.message);
                            }
                        }//if
                        else
                        {
                            //No data for token generation --> exit
                            res.redirect("/");
                        }//else
                    }//if
                }//if
                else
                {
                    //No oauth client ready --> exit
                    res.redirect("/");
                }//else
                break;
            }
        case "Facebook":
            {
                break;
            }
    }//switch
});
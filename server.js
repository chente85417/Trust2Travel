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
const JWT           = require("./src/lib/jwt");
const nodemailer    = require('nodemailer');
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
const validateData = (dataJSON) => {
    if (dataJSON === undefined || dataJSON === null) {
		return {"ret" : false, "caption" : "Datos de registro no definidos!"};
    }
    
    const validator = new Validator(); 
    let validatorOutput = undefined;

    const data = Object.entries(dataJSON);

    data.some(entry => {
        let [type, value] = [...entry];
        switch(type)
        {
            case "email":
            {
                validatorOutput = validator.ValidateEmail(value);
                break;
            }
            case "password":
            {
                validatorOutput = validator.ValidatePassword(value, /^(?=.*[*@%$&]*.*)(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z*@%$&]{6,}$/);
                if (!validatorOutput.ret)
                {
		            validatorOutput.caption = "Debe tener 6 caracteres como mínimo y contener números y letras";
	            }//if
                break;
            }
            case "dateBirth":
            {
                validatorOutput = validator.ValidateDate(value);
                break;
            }
            case "gender":
            {
                validatorOutput = validator.ValidateOption(value, ["masculino", "femenino", "otro"]);
                break;
            }
            default:
            {
                break;
            }
        }//switch
        return !validatorOutput.ret;
    });

    if (!validatorOutput.ret)
    {
		return validatorOutput.caption;
	}//if
    return {ret : true, caption : ""};
}//validateData

const connectorDB = (dbms, connectionData) => {
	let connectionDB = null;
	switch (dbms) {
	case "MySQL":
        {
            const prom = new Promise((resolve, reject) => {
                if (mysql !== undefined)
                {
                    if (typeof connectionData !== "object")
                    {
                        reject({"ret" : 0, "msg" : "MySQL connection data is not a valid JSON"});
                    }//if
                    try { connectionDB = mysql.createConnection(connectionData); }
                    catch (e) { reject({"ret" : 0, "msg" : `Unable to create MySQL connection. Please check connection data is correct`});
                    }
                    if (connectionDB)
                    {
                        connectionDB.connect(function(err) {
                            if (err)
                            {
                                reject({"ret" : 0, "msg" : err});
                            }//if
                            resolve(connectionDB);
                        });
                    }//if
                }//if
                else
                {
                    reject({"ret" : 0, "msg" : `MySQL connection failed. MySQL driver not found`});
                }//else
            });
            return prom;
        }
	case "Mongo":
        {
            break;
        }
    default:
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
        "http://localhost:8888/login/Google"
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
    //Generic failure message
    const failMsg = "Lo sentimos. Se ha producido un error durante el proceso de registro y no ha sido posible completarlo. Inténtalo de nuevo más tarde.";
    //---VALIDATION OF NEW USER´S DATA--//
    const validationResults = validateData(req.body);
    if (validationResults.ret !== true)
    {
        //Data validation fails --> Exit sending error information
        res.send(validationResults);
    }//if
    else
    {
        //Validation succeedes --> GO ON
        //--CREATE A CONNECTION WITH DB--//
        connectorDB("MySQL", connectionData)
        .then((connectionDB) => {
            //Created connection with DB --> GO ON
            //--CHECK OUT IF NEW USER ALREADY EXISTS IN DB--//
            try {
                connectionDB.query({
                    sql : "SELECT USRID FROM usuarios WHERE EMAIL LIKE ?",
                    values : [req.body.email]},
                    function (err, result) {
                    if (err)
                    {
                        //Query failed
                        throw err;
                    }//if
                    else if (result.length)
                    {
                        console.log("Eliminación de conexión con BD tras comprobar que el usuario ya está registrado");
                        connectionDB.end();
                        //Found user in DB --> No registering and exit
                        res.send({"ret" : false, "caption" : "Usuario ya registrado!"});
                    }//else if
                    else
                    {
                        //New user not found in DB --> GO ON
                        //--STORE THE USER IN THE DB--//
                        //Hash the password
                        bcrypt.hash(req.body.password, 10)
                            .then(hash => {
                                //Password hashed OK --> GO ON
                                //Create a hash to confirm registration
                                bcrypt.hash(req.body.email, 10)
                                .then(hashConfirm => {
                                    //Hash token created --> GO ON
                                    hashConfirm = hashConfirm.replace(/\//g, "A");
                                    //--OPEN A TRANSACTION TO INSERT IN DB--//
                                    connectionDB.beginTransaction(function(err) {
                                        if (err)
                                        {
                                            //Transaction failed --> Exit and inform
                                            throw err;
                                        }//if
                                        else
                                        {
                                            //--INSERT NEW USER IN USERS TABLE--//
                                            connectionDB.query({
                                                sql : `INSERT INTO
                                                            usuarios(USRID, EMAIL, FECHANACIMIENTO, GENERO, CONFIRMACIONREGISTRO)
                                                            VALUES (NULL, ?, ?, ?, ?)`,
                                                values : [req.body.email, req.body.dateBirth, req.body.gender, hashConfirm]}, 
                                                function (err, results) {
                                                    if (err)
                                                    {
                                                        //Error in query --> rollback
                                                        return connectionDB.rollback(function() {
                                                            throw err;
                                                        });
                                                    }//if
                                                    else
                                                    {
                                                        //--INSERT PROFILE FOR THE USER IN PROFILES TABLE--//
                                                        connectionDB.query({
                                                            sql : `INSERT INTO 
                                                                        perfiles(EXT_USRID, PERFIL, PASS)
                                                                        VALUES (?, ?, ?)`,
                                                            values : [results.insertId, "registrado", hash]}, 
                                                            function (err, results) {
                                                                if (err)
                                                                {
                                                                    //Error in query --> rollback
                                                                    return connectionDB.rollback(function() {
                                                                        throw err;
                                                                    });
                                                                }//if
                                                                else
                                                                {
                                                                    //--COMMIT TRANSACTION--//
                                                                    connectionDB.commit(function(err) {
                                                                        if (err)
                                                                        {
                                                                            //Commit failed --> rollback
                                                                            return connectionDB.rollback(function() {
                                                                                throw err;
                                                                            });
                                                                        }//if
                                                                        else
                                                                        {
                                                                            //Transaction committed --> Send confirmation email to the user
                                                                            //Send confirmation mail to new user
                                                                            async function main() {
                                                                                let transporter = nodemailer.createTransport({
                                                                                    service: 'Gmail',
                                                                                    auth: {
                                                                                        user: 'vagb.casual@gmail.com',
                                                                                        pass: 'vagbcasual'
                                                                                    },
                                                                                    tls : { rejectUnauthorized: false }
                                                                                });

                                                                                await transporter.sendMail({
                                                                                from: 'vagb.casual@gmail.com',
                                                                                to: req.body.email,
                                                                                subject: "Confirmación del proceso de registro",
                                                                                text: "",
                                                                                html: `<p>Este correo ha sido enviado desde trust2travel para confirmar el proceso de registro</p>
                                                                                <p>Haga click en <a href='http://localhost:8888/confirm/${hashConfirm}'>este enlace</a> para aceptar el registro y será conducido a la aplicación</p>`,
                                                                                });
                                                                                //console.log("Message sent: ", info.messageId);
                                                                            }
                                                                            main().catch(console.error());
                                                                            console.log("Eliminación de conexión con BD tras finalizar la operación con éxito");
                                                                            connectionDB.end();
                                                                            //ESTA LLAMADA DE REDIRECCIONAMIENTO FUNCIONA
                                                                            res.send({"ret" : true, "caption" : "http://localhost:3000/infoPage/register"});
                                                                            //ESTA LLAMADA DE REDIRECCIONAMIENTO NO CRUZA POR FALLO DE CORS
                                                                            //res.redirect("http://localhost:3000/infoPage");
                                                                        }//else
                                                                    });//commit
                                                                }//else
                                                            });
                                                    }//else                                    
                                                });
                                        }//else
                                    });
                                }).catch(fail => {
                                    //Confirm hash KO --> exit
                                    console.log("Eliminación de conexión con BD tras error de creación de hash de confirmación");
                                    connectionDB.end();
                                    console.log("Fallo al encriptar la confirmación del registro",fail);
                                    res.send({"ret" : false, "caption" : failMsg});
                                });			
                            }).catch(fail => {
                                console.log("Eliminación de conexión con BD tras error de creación de hash de contraseña");
                                connectionDB.end();
                                //Password hash KO --> exit
                                console.log("Fallo al encriptar la contraseña",fail);
                                res.send({"ret" : false, "caption" : failMsg});
                            });			
                    }//else
                })
            } catch(err){
                console.log("Eliminación de conexión con BD tras error de sentencia SQL");
                connectionDB.end();
                console.log("Fallo en sentencia SQL",err);
                res.send({"ret" : false, "caption" : failMsg});
            }
        }).catch((fail) => {
            //The connection with DB failed --> Exit sending error information
            console.log("Fallo de conexión con la BD",fail);
            res.send({"ret" : false, "caption" : failMsg});
        });
    }//else  
});

//CONFIRMATION OF REGISTER PROCESS (GET)
serverObj.get("/confirm/:Token", (req, res) => {
    const confirmationToken = req.params.Token;
    //Check out the received token inside users table
    connectorDB("MySQL", connectionData)
    .then((connectionDB) => {
        try {
        //DB connection OK --> Check if token exists in users table
        connectionDB.query({
            sql : "SELECT USRID FROM usuarios WHERE CONFIRMACIONREGISTRO LIKE ?",
            values : [confirmationToken]},
            function (err, result) {
                if (err)
                {
                    //Query KO --> error
                    throw err;
                    //TODO: TRATAR EL ERROR Y REDIRIGIR A /
                }//if
                else if (result.length)
                {
                    //Found token in DB --> Update confirmation
                    connectionDB.query({
                        sql : "UPDATE usuarios SET CONFIRMACIONREGISTRO = NULL WHERE USRID  = ?",
                        values : [result[0].USRID]},
                        function (err, result) {
                            if (err)
                            {
                                //Query KO --> error
                                throw err;
                            }//if
                            else if (result.changedRows)
                            {
                                connectionDB.end();
                                //TODO: ACTUALIZADA CONFIRMACIÓN --> REDIRECCIÓN AL LOGIN
                                res.redirect("http://localhost:3000/login/confirm");
                            }//else if
                        });
                }
            });
        } catch(err){
            connectionDB.end();
            console.log("Fallo en sentencia SQL",err);
            res.status(500).send({error: 'Se ha producido un error en el proceso de confirmación'})
        }
    })
    //DB connection KO --> exit
    .catch((fail) => {
        console.log("Fallo de conexión con la BD",fail);
        //SI EL PROCESO DE CONFIRMACIÓN FALLA, POR EJEMPLO, POR FALLAR LA CONEXIÓN CON LA BD, ENTONCES ¿CÓMO AVISAMOS AL USUARIO DE QUE SU REGISTRO NO SE HA PODIDO CONFIRMAR?¿SE LE ENVÍA OTRO EMAIL INFORMANDO DE ELLO? LO QUE NO PARECE TENER SENTIDO ES ENVIAR UNA RESPUESTA CON res.send
        res.status(500).send({error: 'Se ha producido un error en el proceso de confirmación'})
    });
});

//CREDENTIALS CHECKOUT (POST)
serverObj.post("/login", (req, res) => {
    //Generic failure message
    const failMsg = "Lo sentimos. Se ha producido un error durante el proceso de login y no ha sido posible completarlo. Inténtalo de nuevo más tarde.";
    //---VALIDATION OF USER´S LOGIN DATA--//
    const validationResults = validateData(req.body);
    if (validationResults.ret !== true)
    {
        //Data validation fails --> Exit sending error information
        res.send(validationResults);
    }//if
    else
    {
        //Validation succeedes --> GO ON
        //--CREATE A CONNECTION WITH DB--//
        connectorDB("MySQL", connectionData)
		.then((connectionDB) => {
            //Created connection with DB --> GO ON
            //--CHECK IF USER IS REGISTERED--//
            try {
			    connectionDB.query({
                    sql : "SELECT USRID, CONFIRMACIONREGISTRO, ONBOARDING FROM usuarios WHERE EMAIL LIKE ?",
                    values : [req.body.email]},
                    function (err, resultA) {
                    if (err)
                    {
                        //Query failed
                        throw err;
                    }//if
                    else if (resultA.length)
                    {
                        //The user is a registered one --> GO ON
                        //--CHECK IF USER IS PENDING OF CONFIRMATION--//
                        if (resultA[0].CONFIRMACIONREGISTRO === null)
                        {
                            //User is confirmed --> GO ON
                            //--RETRIEVE THE PASSWORD--//
                            connectionDB.query({
                                sql : "SELECT PASS FROM perfiles WHERE EXT_USRID = ? AND PERFIL = 'registrado'",
                                values : [resultA[0].USRID]},
                                function (err, resultB) {
                                if (err)
                                {
                                    //Query failed
                                    throw err;
                                }//if
                                else if (resultB[0].PASS)
                                {
                                    //The password is found for target user and profile --> GO ON
                                    //--COMPARE THE INSERTED PASSWORD WITH THE STORED ONE--//
                                    bcrypt.compare(req.body.password, resultB[0].PASS)
                                        .then(hashResult => {
                                            if (hashResult)
                                            {
                                                //Passwords match --> GO ON
                                                //--CREATE SESSION WITH A JWT--//
                                                const Payload = {
                                                    "user" : req.body.email,
                                                    "iat" : new Date()
                                                };
                                                const jwt = JWT.buildJWT(Payload);
                                                //--CHECK THE ONBOARDING CONDITION--//
                                                if (resultA[0].ONBOARDING)
                                                {
                                                    //Is the first access so update the onboarding flag and redirect to the onboarding page
                                                    connectionDB.query({
                                                        sql : "UPDATE usuarios SET ONBOARDING = '0' WHERE USRID = ?",
                                                        values : [resultA[0].USRID]},
                                                        function (err, resultUpdateOnboarding) {
                                                            if (err)
                                                            {
                                                                //Query failed
                                                                throw err;
                                                            }//if
                                                            else if (resultUpdateOnboarding)
                                                            {
                                                                //The onboarding flag has been properly updated
                                                                connectionDB.end();
                                                                //Send JWT to the browser
                                                                res.cookie("JWT", jwt, {"httpOnly" : true})
                                                                .redirect("http://localhost:3000/revista");
                                                            }//else if
                                                            else
                                                            {
                                                                //The update of onboarding flag could not be accomplished
                                                                connectionDB.end();
                                                                console.log("Error al actualizar el flag de onboarding ",failMsg);
                                                                res.send({"ret" : false, "caption" : failMsg});
                                                            }//else
                                                        });
                                                }//if
                                                else
                                                {
                                                    connectionDB.end();
                                                    //Is not the first access so redirect to the home page
                                                    //Send JWT to the browser
                                                    res.cookie("JWT", jwt, {"httpOnly" : true})
                                                    .send({"ret" : true, "caption" : "Sesión abierta"});
                                                }//else
                                            }//if
                                            else
                                            {
                                                connectionDB.end();
                                                //Passwords don´t match --> Reject
                                                res.send({"ret" : false, "caption" : "Contraseña inválida!"});
                                            }//else
                                        })
                                        .catch(fail => {
                                            connectionDB.end();
                                            console.log("Error interno de la función de comparación de la contraseña");
                                            //No password found for this profile --> Reject
                                            res.send({"ret" : false, "caption" : "Lo sentimos. Se ha producido un error durante el proceso de login y no ha sido posible completarlo. Inténtalo de nuevo más tarde."});
                                        });
                                }//else if
                                else
                                {
                                    connectionDB.end();
                                    //No password found for this profile --> Reject
                                    res.send({"ret" : false, "caption" : "No se ha encontrado contraseña para este usuario!"});
                                }//else
                            });                            
                        }//if
                        else
                        {
                            connectionDB.end();
                            //The user is trying to access but still pending of confirmation --> Reject and inform
                            res.send({"ret" : false, "caption" : "No puedes acceder hasta que no confirmes tu registro"});
                        }//else
                    }//else if
                    else
                    {
                        connectionDB.end();
                        //Not found user in DB --> Reject login
                        res.send({"ret" : false, "caption" : "Usuario no registrado!"});
                    }//else
                });
            } catch(err){
                connectionDB.end();
                console.log("Fallo en sentencia SQL",err);
                res.send({"ret" : false, "caption" : failMsg});
            }
        }).catch((fail) => {
           //The connection with DB failed --> Exit sending error information
           console.log("Fallo de conexión con la BD",fail);
           res.send({"ret" : false, "caption" : failMsg});
        });
    }//else
});

//OAUTH LOGIN REQUEST USING GOOGLE (GET)
serverObj.get("/loginGoogle", (req, res) => {
    //Creation of Google OAuth2 client
    googleOAuth2Client = createGoogleOAuth();
    //Redirect the user to Google auth permissions
    let a = getGoogleOAuthUrl(googleOAuth2Client);
    console.log(a);
    res.redirect(a);
});

//OAUTH LOGIN REQUEST USING FACEBOOK (GET)
serverObj.get("/loginFacebook", (req, res) => {
    
});

//OAUTH LOGIN (GET)
serverObj.get("/login/:Provider", (req, res) => {
    const provider = req.params.Provider;
    let oauthUserData = undefined;
    switch (provider)
    {
        case "Google":
            {
                if (googleOAuth2Client)
                {
                    const {code} = req.query;
                    console.log('código temporal ',code);
                    if (code)
                    {
                        const p = new Promise((resolve, reject) => {
                            resolve(googleOAuth2Client.getToken(code));
                        });
                        p.then((dataFromGoogle) => {
                            const { tokens } = dataFromGoogle;
                            googleOAuth2Client.setCredentials(tokens);
                            if (tokens.id_token && tokens.access_token) {
                                // Fetch the user's profile with the access token and bearer
                                try {
                                    console.log('previo a la llamada');
                                    fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`, {
                                            headers : {
                                                'Authorization': `Bearer ${tokens.id_token}`
                                            }
                                        })
                                        .then(data => {
                                            oauthUserData = data.json();
                                            res.redirect("/");
                                        });
                                } catch (error) {
                                    console.log(error);
                                    // throw new Error(error.message);
                                    res.redirect(301, "/");
                                }
                            }//if
                            else
                            {
                                //No data for token generation --> exit
                                res.redirect(301, "/");
                            }//else
                        })
                    }//if
                }//if
                else
                {
                    //No oauth client ready --> exit
                    console.log('no hay cliente oauth');
                    res.redirect(301, "/");
                }//else
                break;
            }
        case "Facebook":
            {
                break;
            }
        default:
            {
                break;
            }
    }//switch
});

//EMAIL CHECKOUT FOR PASSWORD RESET (POST)
serverObj.post("/checkEmail", (req, res) => {
    //Generic failure message
    const failMsg = "Lo sentimos. En este momento no se puede hacer el cambio de contraseña. Inténtalo de nuevo más tarde.";
    //---VALIDATION OF USER´S EMAIL--//
    const validationResults = validateData(req.body);
    if (validationResults.ret !== true)
    {
        //Data validation fails --> Exit sending error information
        res.send(validationResults);
    }//if
    else
    {
        //Validation succeedes --> GO ON
        //--CREATE A CONNECTION WITH DB--//
        connectorDB("MySQL", connectionData)
		.then((connectionDB) => {
            //Created connection with DB --> GO ON
            //--CHECK OUT IF NEW USER ALREADY EXISTS IN DB--//
            try {
			    connectionDB.query({
                    sql : "SELECT USRID, CONFIRMACIONREGISTRO, PENDINGRESETPASS FROM usuarios WHERE EMAIL LIKE ?",
                    values : [req.body.email]},
                    function (err, result) {
                    if (err)
                    {
                        //Query failed
                        throw err;
                    }//if
                    else if (result.length)
                    {
                        //Found user in DB --> GO ON
                        //--CHECK OUT IF USER IS PENDING OF CONFIRMATION--//
                        if (result[0].CONFIRMACIONREGISTRO !== null)
                        {
                            connectionDB.end(); 
                            //User requests pass change but has not confirmed registration yet --> Reject and inform
                            res.send({"ret" : false, "caption" : "Debes confirmar el registro antes de cambiar la contraseña. Revisa el correo con el que te registraste"});
                        }//if
                        else
                        {
                            //Hash the email and insert it in this user´s register
                            bcrypt.hash(req.body.email, 10)
                            .then(hash => {
                                hash = hash.replace(/\//g, "A");
                                connectionDB.query({
                                    sql : `UPDATE usuarios SET PENDINGRESETPASS = ? WHERE USRID = ?`,
                                    values : [hash, result[0].USRID]},
                                    function (err, result) {
                                        if (err)
                                        {
                                            //Query failed
                                            throw err;
                                        }//if
                                        else if (result.affectedRows)
                                        {
                                            connectionDB.end(); 
                                            //The token to change password is stored --> GO ON
                                            //--SEND AN EMAIL TO USER WITH A LINK TO UPDATE THE PASSWORD--//
                                            async function main() {
                                                let transporter = nodemailer.createTransport({
                                                    service: 'Gmail',
                                                    auth: {
                                                        user: 'vagb.casual@gmail.com',
                                                        pass: 'vagbcasual'
                                                    },
                                                    tls : { rejectUnauthorized: false }
                                                });
                                            
                                                await transporter.sendMail({
                                                from: 'vagb.casual@gmail.com',
                                                to: req.body.email,
                                                subject: "Cambio de contraseña para trust2travel",
                                                text: "Por favor, acuda al siguiente link para generar una nueva contraseña:",
                                                html: `<a href='http://localhost:8888/resetPass/${hash}'>cambiar contraseña</a>`,
                                                });
                                                //console.log("Message sent: ", info.messageId);
                                            }
                                            main().catch(console.error);
                                            //ESTA LLAMADA DE REDIRECCIONAMIENTO FUNCIONA
                                            res.send({"ret" : true, "caption" : "http://localhost:3000/infoPage/reset"});
                                            //ESTA LLAMADA DE REDIRECCIONAMIENTO NO CRUZA POR FALLO DE CORS
                                            //res.redirect("http://localhost:3000/infoPage");
                                        }//else if
                                    });
                                })
                            .catch(fail => {
                                connectionDB.end(); 
                                //Token creation failed --> Exit
                                console.log("Fallo al crear el hash para el token de cambio de contraseña",fail);
                                res.send({"ret" : false, "caption" : failMsg});
                            });
                        }//else
                    }//else if
                    else
                    {
                        connectionDB.end(); 
                        //Not found user in DB --> Reject
                        res.send({"ret" : false, "caption" : "El email introducido no se encuentra registrado!"});
                    }//else
                });
            } catch(err){
                connectionDB.end();
                console.log("Fallo en sentencia SQL",err);
                res.send({"ret" : false, "caption" : failMsg});
            }       
        })
        //DB connection KO --> exit
		.catch((fail) => {
            //The connection with DB failed --> Exit sending error information
            console.log("Fallo de conexión con la BD",fail);
            res.send({"ret" : false, "caption" : failMsg});
		});
    }//else
});

//RESET PASSWORD (GET)
serverObj.get("/resetPass/:Token", (req, res) => {
    //Generic failure message
    const failMsg = "Lo sentimos. En este momento no se puede hacer el cambio de contraseña. Inténtalo de nuevo más tarde.";
    const emailToken = req.params.Token;
    //Check out the received token inside users table
    //--CREATE A CONNECTION WITH DB--//
    connectorDB("MySQL", connectionData)
    .then((connectionDB) => {
        //Created connection with DB --> GO ON
        //--CHECK IF TOKEN EXISTS IN USERS TABLE--//
        try {
            connectionDB.query({
                sql : "SELECT USRID FROM usuarios WHERE PENDINGRESETPASS LIKE ?",
                values : [emailToken]},
                function (err, result) {
                    if (err)
                    {
                        //Query failed
                        throw err;
                    }//if
                    else if (result.length)
                    {
                        connectionDB.end();
                        //Found token in DB --> Redirect to password reset
                        res.cookie("usrchpassToken", emailToken)
                        .redirect("http://localhost:3000/newPass");
                    }//else if
                    else
                    {
                        connectionDB.end();
                        //The token cannot be found --> 
                        console.log("El token de cambio de contraseña no se ha encontrado en la BD");
                        res.send({"ret" : false, "caption" : failMsg});
                    }//else
                });
            } catch(err){
                connectionDB.end();
                console.log("Fallo en sentencia SQL",err);
                res.send({"ret" : false, "caption" : failMsg});
            }
    })
    //DB connection KO --> exit
    .catch((fail) => {
        //The connection with DB failed --> Exit sending error information
        console.log("Fallo de conexión con la BD",fail);
        res.send({"ret" : false, "caption" : failMsg});
    });
});

//UPDATE PASSWORD (POST)
serverObj.post("/updatePass", (req, res) => {
    //Generic failure message
    const failMsg = "Lo sentimos. En este momento no se puede hacer el cambio de contraseña. Inténtalo de nuevo más tarde.";
    //---VALIDATION OF NEW PASSWORD--//
    const validationResults = validateData(req.body);
    if (validationResults.ret !== true)
    {
        //Data validation fails --> Exit sending error information
        res.send(validationResults);
    }//if
    else
    {
        //Validation succeedes --> GO ON
        //--UPDATE THE PASSWORD FOR THE USER BASED ON TOKEN--//
        connectorDB("MySQL", connectionData)
		.then((connectionDB) => {
            try {
            //Created connection with DB --> GO ON
            //--HASH THE PASSWORD--//
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                //Password hashed OK --> Proceed to update it
                //--OPEN A TRANSACTION TO UPDATE IN DB--//
                connectionDB.beginTransaction(function(err) {
                    if (err)
                    {
                        //Transaction failed --> Exit and inform
                        throw err;
                    }//if
                    else
                    {
                        //--UPDATE THE TOKEN AND GET THE USER--//
                        connectionDB.query({
                            sql : "SELECT USRID FROM usuarios WHERE PENDINGRESETPASS LIKE ?",
                            values : [req.body.token]},
                            function (err, resultA) {
                                if (err)
                                {
                                    //Error in query --> rollback
                                    return connectionDB.rollback(function() {
                                        throw err;
                                    });
                                }//if
                                else if (resultA[0].USRID)
                                {
                                    connectionDB.query({
                                        sql : "UPDATE usuarios SET PENDINGRESETPASS = NULL WHERE USRID = ?",
                                        values : [resultA[0].USRID]}, 
                                        function (err, resultB) {
                                            if (err)
                                            {
                                                //Error in query --> rollback
                                                return connectionDB.rollback(function() {
                                                    throw err;
                                                });
                                            }//if
                                            else
                                            {
                                                //--UPDATE THE PASSWORD IN PROFILES TABLE--//
                                                connectionDB.query({
                                                    sql : `UPDATE perfiles SET PASS = ? WHERE EXT_USRID = ? AND PERFIL = 'registrado'`,
                                                    values : [hash, resultA[0].USRID]}, 
                                                    function (err, resultC) {
                                                        if (err)
                                                        {
                                                            //Error in query --> rollback
                                                            return connectionDB.rollback(function() {
                                                                throw err;
                                                            });
                                                        }//if
                                                        else
                                                        {
                                                            //--COMMIT TRANSACTION--//
                                                            connectionDB.commit(function(err) {
                                                                if (err)
                                                                {
                                                                    //Commit failed --> rollback
                                                                    return connectionDB.rollback(function() {
                                                                        throw err;
                                                                    });
                                                                }//if
                                                                else
                                                                {
                                                                    connectionDB.end();
                                                                    //Transaction committed
                                                                    //Password updated so inform
                                                                    res.send({"ret" : true, "caption" : "http://localhost:3000/login"});
                                                                }//else
                                                            });//commit
                                                        }//else
                                                    });
                                            }//else                                    
                                        });
                                }//else if
                                else
                                {
                                    //User not found
                                    connectionDB.end();
                                    console.log("Fallo al encontrar el usuario pendiente de cambio de contraseña",err);
                                    res.send({"ret" : false, "caption" : failMsg});
                                }//else
                            });
                    }//else
                });
            })
            .catch(fail => {
                connectionDB.end();
                //Password hash failed --> exit
                console.log("Fallo al encriptar la nueva contraseña",fail);
                res.send({"ret" : false, "caption" : failMsg});
            });
            } catch(err){
                connectionDB.end();
                console.log("Fallo en sentencia SQL",err);
                res.send({"ret" : false, "caption" : failMsg});
            }
        })
        //DB connection KO --> exit
		.catch((fail) => {
            //The connection with DB failed --> Exit sending error information
            console.log("Fallo de conexión con la BD",fail);
            res.send({"ret" : false, "caption" : failMsg});
		});
    }//else
});

/*
serverObj.get("/login/:Provider", async (req, res) => {
    const provider = req.params.Provider;
    console.log(provider);
    switch (provider)
    {
        case "Google":
            {
                if (googleOAuth2Client)
                {
                    const {code} = req.query;
                    console.log('código temporal ',code);
                    if (code)
                    {
                        const { tokens } = await googleOAuth2Client.getToken(code);
                        googleOAuth2Client.setCredentials(tokens);
                        if (tokens.id_token && tokens.access_token) {
                            // Fetch the user's profile with the access token and bearer
                            try {
                                console.log('previo a la llamada');
                                const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`, {
                                    headers : {
                                        'Authorization': `Bearer ${tokens.id_token}`
                                    }
                                });
                                console.log('posterior a la llamada');
                                const googleUser = await res.json();
                                console.log(googleUser);
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
                    console.log('no hay cliente oauth');
                    res.redirect("/");
                }//else
                break;
            }
        case "Facebook":
            {
                break;
            }
    }//switch
});*/
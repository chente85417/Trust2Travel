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
const express       = require("express");
const bodyParser    = require("body-parser");
const corsEnable    = require("cors");
const cookieParser  = require("cookie-parser");
const mysql         = require("mysql");
const fetch         = require("node-fetch");


//------------INITIALIZATION--------------//
//Creation of Express server object
const serverObj = express();

//Definition of server listening port
const listeningPort = 8888;

//Raise Express server on listening port
serverObj.listen(listeningPort, () => {console.log(`Express server listening on port ${listeningPort}`)});

//-------------MIDDLEWARES----------------//
const publicFiles = express.static("public");//Change for build for production
serverObj.use(publicFiles);
serverObj.use(bodyParser.urlencoded({"extended" : false}));
serverObj.use(bodyParser.json());
serverObj.use(corsEnable());
serverObj.use(cookieParser());

//-----------SERVER ROUTING---------------//
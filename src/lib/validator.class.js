//import {MessageBox} from "../js/messageBox.class.js";

export class Validator
{
    constructor(val, constraints)
    {
        this.data           = val;
        this.constraints    = constraints;
    }

	ValidateString(str, caption, strRegEx, empty = false) {
		let constraints = {
			"type" : "STRING",
			"regex" : strRegEx,
			"empty" : empty
		};
		//Checkout emptyness
        if (!constraints.empty)
        {
			//Data must not be empty
            if (str === "")
            {
                return {ret : false, caption : `Dato ${caption} vacío!`};
			}//if
        }//if
        else
        {
			return {ret : true, caption : ""};
		}//else

        if (constraints.regex !== "")
        {
			//Validate through incoming regex
            if (!constraints.regex.test(str))
            {
                return {ret : false, caption : `Dato ${caption} no válido!`};
			}//if
        }//if
        else
        {
			//Validate through predefined regex
		}//else
		return {ret : true, caption : ""};
	}

    ValidateEmail(strEmail, empty = false) {
        let constraints = {
            type : "EMAIL",
            regex : "",
            empty : empty
        };

        //Checkout emptyness
        if (!constraints.empty)
        {
            //Data must not be empty
            if (strEmail === "")
            {
                return {ret : false, caption : "Dirección de correo electrónico vacía!"};
            }//if
        }//if
        else
        {
            return {ret : true, caption : ""};
        }//else

        if (constraints.regex !== "")
        {
            //Validate through incoming regex
        }//if
        else
        {
            //Validate through predefined regex
            // eslint-disable-next-line no-useless-escape
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(strEmail))
            {
                return {ret : false, caption : "Dirección de correo electrónico no válida!"};
            }//if
        }//else
        return {ret : true, caption : ""};
    }

    ValidatePassword(strPass, strRegEx, empty = false) {
        let constraints = {
            type : "PASSWORD",
            regex : strRegEx,
            empty : empty
        };

        //Checkout emptyness
        if (!constraints.empty)
        {
            //Data must not be empty
            if (strPass === "")
            {
                return {ret : false, caption : "Contraseña vacía!"};
            }//if
        }//if
        else
        {
            return {ret : true, caption : ""};
        }//else

        if (constraints.regex !== "")
        {
            //Validate through incoming regex
            if (!constraints.regex.test(strPass))
            {
                return {ret : false, caption : "Contraseña no válida!"};
            }//if
        }//if
        else
        {
            //Validate through predefined regex
        }//else
        return {ret : true, caption : ""};
    }

    ValidateDate(strData, empty = false) {
        let constraints = {
            type : "DATE",
            regex : "",
            empty : empty,
            date : {
                upperLimit : "today",
                lowerLimit : "01/01/1900"
            },
        };

        //Checkout emptyness
        if (!constraints.empty)
        {
            //Data must not be empty
            if (strData === "")
            {
                return {ret : false, caption : "Fecha de nacimiento vacía!"};
            }//if
        }//if
        else
        {
            return {ret : true, caption : ""};
        }//else

        if (constraints.regex !== "")
        {
            //Validate through incoming regex
        }//if
        else
        {
            //Validate through predefined regex
            const re = /(19\d\d|20([0-4]\d|50))-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/;
            if (!re.test(strData))
            {
                return {ret : false, caption : "El formato ha de ser aaaa-mm-dd"};
            }//if
        }//else

        //Check out upper limit
        if (constraints.date.upperLimit === "today")
        {
            let inTheFuture = false;
            const today = new Date();
            let todayYear = today.getFullYear();
            let todayMonth = today.getMonth();
            let todayDate = today.getDate();
            const splitDate = strData.split("-");
            if (parseInt(splitDate[0]) > todayYear)
            {
                //Inserted birth year is higher than current so fails
                inTheFuture = true;
            }//if
            else
            {
                if (parseInt(splitDate[0]) === todayYear)
                {
                    //Inserted birth year is the same as current so further month checking is needed
                    if (parseInt(splitDate[1]) > (todayMonth + 1))
                    {
                        //Inserted birth month is higher than current on the same year so fails
                        inTheFuture = true;
                    }//if
                    else
                    {
                        if (parseInt(splitDate[1]) === (todayMonth + 1))
                        {
                            //Inserted birth month is the same as current so further day checkint is needed
                            if (parseInt(splitDate[2]) > todayDate)
                            {
                                //Inserted birth day is higher than current on the same year and month so fails
                                inTheFuture = true;
                            }//if
                        }//if
                    }//else
                }//if
            }//else
            if (inTheFuture)
            {   
                return {ret : false, caption : "La fecha introducida es del futuro!"};
            }//if
        }//if

        //Check out any additional condition
        if (constraints.callback !== undefined)
        {
            const callbackRet = constraints.callback(strData);
            if (!callbackRet.result)
            {
                return {ret : false, caption : ""};
            }//if
        }
        return {ret : true, caption : ""};
    }

    ValidateNIF(strNIF, empty = false) {
        let constraints = {
            type : "NIF/NIE",
            regex : "",
            empty : empty
        };

        //Checkout emptyness
        if (!constraints.empty)
        {
            //Data must not be empty
            if (strNIF === "")
            {
                return {ret : false, caption : "Documento de identificación vacío!"};
            }//if
        }//if
        else
        {
            return {ret : true, caption : ""};
        }//else

        if (constraints.regex !== "")
        {
            //Validate through incoming regex
        }//if
        else
        {
            //Validate through predefined regex
            const re = /(([XYZ\d])\d{7})([A-HJ-NP-TV-Z])/;
            
            if (!re.test(strNIF))
            {
                return {ret : false, caption : "Documento de identificación no válido!"};
            }//if

            //Formula validation
            let num = undefined;
            switch (strNIF[0])
            {
                case "X":
                    {
                        num = parseInt(strNIF.replace("X","0").substring(0,8));
                        break;
                    }
                case "Y":
                    {
                        num = parseInt(strNIF.replace("Y","1").substring(0,8));
                        break;
                    }
                case "Z":
                    {
                        num = parseInt(strNIF.replace("Z","2").substring(0,8));
                        break;
                    }
                default:
                    {
                        num = parseInt(strNIF.substring(0,8));
                        break;
                    }
            }//switch
            if ("TRWAGMYFPDXBNJZSQVHLCKE"[num % 23] !== strNIF[8])
            {
                return {ret : false, caption : "Documento de identificación erróneo!"};
            }//if
        }
        return {ret : true, caption : ""};
    }

    ValidatePhone(strPhone, strRegEx, empty = false)
    {
        let constraints = {
            type : "PHONE",
            regex : strRegEx,
            empty : empty
        };

        //Checkout emptyness
        if (!constraints.empty)
        {
            //Data must not be empty
            if (strPhone === "")
            {
                return {ret : false, caption : "Teléfono vacío!"};
            }//if
        }//if
        else
        {
            return {ret : true, caption : ""};
        }

        if (constraints.regex !== "")
        {
            //Validate through incoming regex
            if (!constraints.regex.test(strPhone))
            {
                return {ret : false, caption : "Número de teléfono no válido!"};
            }//if
        }//if
        else
        {
            //Validate through predefined regex
        }//else
        return {ret : true, caption : ""};
    }

    ValidateOption(strOption, arrayOptions)
    {
        if (arrayOptions.filter(option => option === strOption).length === 0)
        {
            return {ret : false, caption : "Opción de valor incorrecto!"};
        }//if
        return {ret : true, caption : ""};
    }
};
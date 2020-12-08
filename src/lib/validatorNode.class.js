class Validator{
	constructor(val = "", constraints = {}) {
		this.data = val;
		this.constraints = constraints;
	}

	ValidateString(str, caption, strRegEx, empty = false) {
		let constraints = {
			"type" : "STRING",
			"regex" : strRegEx,
			"empty" : empty
		};
		//Checkout emptyness
		if (!constraints.empty) {
			//Data must not be empty
			if (str === "") {
				return {"ret" : false, "msg": 	[{
					"caption" : `Dato ${caption} vacío!`,
					"class" : "highText"
				}]};
			}
		} else {
			return {"ret" : true, "msg": ""};
		}

		if (constraints.regex !== "") {
			//Validate through incoming regex
			if (!constraints.regex.test(str)) {
				return {"ret" : false, "msg":	[{
					"caption" : `Dato ${caption} no válido!`,
					"class" : "highText"
				}]};
			}
		} else {
			//Validate through predefined regex
		}
		return {"ret" : true, "msg": ""};
	}

	ValidateEmail(strEmail, empty = false) {
		let constraints = {
			"type" : "EMAIL",
			"regex" : "",
			"empty" : empty
		};

		//Checkout emptyness
		if (!constraints.empty) {
			//Data must not be empty
			if (strEmail === "") {
				return {"ret" : false, "msg": 	[{
					"caption" : "Dirección de correo electrónico vacía!",
					"class" : "highText"
				}]};
			}
		} else {
			return {"ret" : true, "msg": ""};
		}

		if (constraints.regex !== "") {
			//Validate through incoming regex
		} else {
			//Validate through predefined regex
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			if (!re.test(strEmail)) {
				return {"ret" : false, "msg":	[{
					"caption" : "Dirección de correo electrónico no válida!",
					"class" : "highText"
				}]};
			}
		}
		return {"ret" : true, "msg": ""};
	}

	ValidatePassword(strPass, strRegEx, empty = false) {
		let constraints = {
			"type" : "PASSWORD",
			"regex" : strRegEx,
			"empty" : empty
		};

		//Checkout emptyness
		if (!constraints.empty) {
			//Data must not be empty
			if (strPass === "") {
				return {"ret" : false, "msg": 	[{
					"caption" : "Contraseña vacía!",
					"class" : "highText"
				}]};
			}
		} else {
			return {"ret" : true, "msg": ""};
		}

		if (constraints.regex !== "") {
			//Validate through incoming regex
			if (!constraints.regex.test(strPass)) {
				return {"ret" : false, "msg":	[{
					"caption" : "Contraseña no válida!",
					"class" : "highText"
				}]};
			}
		} else {
			//Validate through predefined regex
		}
		return {"ret" : true, "msg": ""};
	}

	ValidateDate(strData, empty = false) {
		let constraints = {
			"type" : "DATE",
			"regex" : "",
			"empty" : empty,
			"date" : {
				"upperLimit" : "today",
				"lowerLimit" : "01/01/1900"
			},
		};

		//Checkout emptyness
		if (!constraints.empty) {
			//Data must not be empty
			if (strData === "") {
				return {"ret" : false, "msg": [{
					"caption" : "Fecha de nacimiento vacía!",
					"class" : "highText"
				}]};
			}
		} else {
			return {"ret" : true, "msg": ""};
		}

		if (constraints.regex !== "") {
			//Validate through incoming regex
		} else {
			//Validate through predefined regex
			const re = /(19\d\d|20([0-4]\d|50))-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/;

			if (!re.test(strData)) {
				return {"ret" : false, "msg": [{
					"caption" : "Fecha inválida! El formato ha de ser dd/mm/aaaa",
					"class" : "highText"
				}]};
			}
		}

		//Check out upper limit
		if (constraints.date.upperLimit === "today") {
			let inTheFuture = false;
			const today = new Date();
			let todayYear = today.getFullYear();
			let todayMonth = today.getMonth();
			let todayDate = today.getDate();
			const splitDate = strData.split("-");
			if (parseInt(splitDate[0]) > todayYear) {
				//Inserted birth year is higher than current so fails
				inTheFuture = true;
			} else if (parseInt(splitDate[0]) === todayYear) {
				//Inserted birth year is the same as current so further month checking is needed
				if (parseInt(splitDate[1]) > todayMonth + 1) {
					//Inserted birth month is higher than current on the same year so fails
					inTheFuture = true;
				} else if (parseInt(splitDate[1]) === todayMonth + 1) {
					//Inserted birth month is the same as current so further day checkint is needed
					if (parseInt(splitDate[2]) > todayDate) {
						//Inserted birth day is higher than current on the same year and month so fails
						inTheFuture = true;
					}
				}
			}
			if (inTheFuture) {
				return {"ret" : false, "msg": [{
					"caption" : "La fecha introducida es del futuro!",
					"class" : "highText"
				}]};
			}
		}

		//Check out any additional condition
		if (constraints.callback !== undefined) {
			const callbackRet = constraints.callback(strData);
			if (!callbackRet.result) {
				return {"ret" : false, "msg": callbackRet.msg};
			}
		}
		return {"ret" : true, "msg": ""};
	}

	ValidateNIF(strNIF, empty = false) {
		let constraints = {
			"type" : "NIF/NIE",
			"regex" : "",
			"empty" : empty
		};

		//Checkout emptyness
		if (!constraints.empty) {
			//Data must not be empty
			if (strNIF === "") {
				return {"ret" : false, "msg": [{
					"caption" : "Documento de identificación vacío!",
					"class" : "highText"
				}]};
			}
		} else {
			return {"ret" : true, "msg": ""};
		}

		if (constraints.regex !== "") {
			//Validate through incoming regex
		} else {
			//Validate through predefined regex
			const re = /(([XYZ\d])\d{7})([A-HJ-NP-TV-Z])/;

			if (!re.test(strNIF)) {
				return {"ret" : false, "msg": [{
					"caption" : "Documento de identificación no válido!",
					"class" : "highText"
				}]};
			}

			//Formula validation
			let num = undefined;
			switch (strNIF[0]) {
			case "X":
			{
				num = parseInt(strNIF.replace("X", "0").substring(0, 8));
				break;
			}
			case "Y":
			{
				num = parseInt(strNIF.replace("Y", "1").substring(0, 8));
				break;
			}
			case "Z":
			{
				num = parseInt(strNIF.replace("Z", "2").substring(0, 8));
				break;
			}
			default:
			{
				num = parseInt(strNIF.substring(0, 8));
				break;
			}
			}
			if ("TRWAGMYFPDXBNJZSQVHLCKE"[num % 23] !== strNIF[8]) {
				return {"ret" : false, "msg": [{
					"caption" : "Documento de identificación erróneo!",
					"class" : "highText"
				}]};
			}
		}
		return {"ret" : true, "msg": ""};
	}

	ValidatePhone(strPhone, strRegEx, empty = false) {
		let constraints = {
			"type" : "PHONE",
			"regex" : strRegEx,
			"empty" : empty
		};

		//Checkout emptyness
		if (!constraints.empty) {
			//Data must not be empty
			if (strPhone === "") {
				return {"ret" : false, "msg": [{
					"caption" : "Teléfono vacío!",
					"class" : "highText"
				}]};
			}
		}

		if (constraints.regex !== "") {
			//Validate through incoming regex
			if (!constraints.regex.test(strPhone)) {
				return {"ret" : false, "msg": [{
					"caption" : "Número de teléfono no válido!",
					"class" : "highText"
				}]};
			}
		} else {
			//Validate through predefined regex
		}
		return {"ret" : true, "msg": ""};
	}

	ValidateOption(strOption, arrayOptions)
    {
        if (arrayOptions.filter(option => option === strOption).length === 0)
        {
            return {"ret" : false, "msg" : [{
				"caption" : "Opción de valor incorrecto!",
				"class" : "highText"
			}]};
        }
        return {"ret" : true, "msg": ""};
    }
}

module.exports = Validator;
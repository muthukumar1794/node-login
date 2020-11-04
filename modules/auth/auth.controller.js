const service = require('./auth.service')
const moment = require('moment-timezone')
const utility = require('../../utils/utility')
const Joi = require('joi');
const JoiSchema = require('../joischema');
const joiSchema = new JoiSchema();
const _ = require('lodash')

module.exports = {

    getUser: async (req, res) => {
        try {

            const email = req.params.username;
            const password = req.params.password;
            if (!email) {
                utility.error(res, "Invalid Email");
            }

            if (!password) {
                utility.error(res, "Invalid Password");
            }

            const value = Joi.attempt({
                email: email,
                password: password
            }, joiSchema.loginSchema());
          console.log("joiiii",value)

            const userData = await service.getUserByEmail(value.email);

            if (userData && !(userData.length > 0)) {
                utility.error(res, "User does not excist, please check the username.");
                return;
            }

            const checkPassword = await utility.comparePassword(value.password, userData[0].password);
            if (!checkPassword) {
                utility.error(res, "Please check the password.");
                return;
            }

            if (userData[0].status != "active") {
                utility.error(res, "Please activate your account.");
                return;
            }


            let data = {
                _id: userData[0]._id,
                first_name: userData[0].first_name,
                last_name: userData[0].last_name,
                email: userData[0].email,
                phone_number: userData[0].phone_number,
                date_of_birth: moment(userData[0].date_of_birth).format("DD-MM-YYYY"),
                status: userData[0].status,
                user_type: userData[0].user_type
            }

            const token = utility.generateToken(data);
            data.token = token;

            utility.sucess(res, data)
        } catch (error) {
            console.log("Login error");
            console.error(error);
            utility.error(res, error)
        }
    },

    createUser: async (req, res) => {
        try {
            const userData = req.body;
            const value = Joi.attempt(userData, joiSchema.singInSchema());
            if (!value) {
                throw new Error('validatioon error')
            }
            userData.date_of_birth = moment(userData.date_of_birth, "DD-MM-YYYY");
            userData.password = await utility.encryptPassword(value.password);
            const save = await service.saveUser(userData);
            utility.sucess(res, "")
        } catch (error) {
            console.log("Create User Error");
            console.error(error);
            utility.error(res, error)
        }
    },

    sericeApi: async (req, res, next) => {
        try {
            const getType = req.params.type
            const inputType = getType.split('=')[1]
            const body = req.body.array
            let outputContent

            ////type---1/////////
            const sortArray = (num) => {
                if (!_.isNumber(num[0])) {
                    throw err
                }
                const odds = num.filter(p => {
                    if (p % 2 != 0) {
                        return p
                    }
                })
                const evens = num.filter(p => {
                    if (p % 2 == 0) {
                        return p
                    }

                })

                const evensArray = evens.sort(function (a, b) {
                    return a - b;
                });
                const oddsArray = odds.sort(function (a, b) {
                    return b - a;
                });
                const res = evensArray.map((p, i) => {
                    oddsArray.splice(((i * 2) + 1), 0, p);
                })

                return oddsArray
            }


            ////type---2////////
            const SpecialString = (specialString) => {
                let emptyArray = []

                const reverseString = (specialString) => {
                    const filterString = specialString.match(/[A-Za-z]/g);
                    emptyArray = filterString
                    emptyArray.sort((a, b) => (a > b ? -1 : 1))
                    return emptyArray
                }
                const reversedString = reverseString(specialString)
                let gettingIndex = []
                gettingIndex = [...specialString]
                const outputArray = [...specialString]
                reversedString.map((s, i) => {
                    let bool = false
                    return gettingIndex.map((a, j) => {

                        if (!bool && a.match(/[A-Za-z]/g)) {
                            bool = true
                            gettingIndex[j] = "#"
                            return outputArray[j] = s
                        }
                    })

                })
                const finalString = outputArray.join('')
                return finalString
            }

            ////type---3////////


            const missingNumbers = (array) => {
                if (!_.isNumber(array[0])) {
                    throw err
                }
                const count = array[array.length - 1];
                const missing = [];
                const smallestValue = array.sort((a, b) => a - b);

                for (i = smallestValue[0]; i <= count; i++) {
                    if (array.indexOf(i) == -1) {
                        missing.push(i);
                    }
                }
                return missing.toString()
            }

            switch (true) {

                case (Number(inputType) == 1 && _.isArray(body)):
                    outputContent = sortArray(body)
                    break;

                case (Number(inputType) == 2 && _.isString(body)):
                    outputContent = SpecialString(body)
                    break;

                case Number(inputType) == 3 && _.isArray(body):
                    outputContent = missingNumbers(body)
                    break;

                default:
                    outputContent = "Sorry, please try again with valid format for this type."

            }

            res.status(200).json({
                data: outputContent
            })
        } catch (err) {
            res.status(404).json({
                data: "something went wrong"
            })
        }
    }


}
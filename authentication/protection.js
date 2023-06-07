const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    } catch (error) {
        console.log(`error : ${error.message}`)
    }

}

const comparePassword = async (password,hashedPassword) => {
    try {
        const comparedPassword = bcrypt.compare(password, hashedPassword)
        return comparedPassword
    } catch (error) {
        console.log(`error : ${error.message}`)
    }

}

module.exports = { hashPassword, comparePassword }
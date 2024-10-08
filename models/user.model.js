const bcrypt = require('bcryptjs');
// kittu was here ❤️
// tu rk se lv krda h
const db = require('../data/database')
class User {
    constructor(email, password, fullname, street, postal, city) {
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.address = {
            street: street,
            postalCode: postal,
            city: city
        };
    }

    getUserWithSameEmail() {
        return db.getDb().collection('users').findOne({ email: this.email });
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if (existingUser) {
            return true;
        }
        return false;
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if (!existingUser) {
            return true;
        }
        return false;
    }
    async signup() {

        const hashedPassword = await bcrypt.hash(this.password, 12);
        // await db.connectToDatabase()
        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            name: this.name,
            address: this.address
        });

    }

    async hasMatchingPassword(hashedPassword) {
        const variable = await bcrypt.compare(this.password, hashedPassword);
        return variable;
        //comparing already existing password with password current user entered
    }

}

module.exports = { User }
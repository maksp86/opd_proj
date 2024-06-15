const bcrypt = require('bcrypt')
const logger = require("winston")

const UserRole = require("./model/userrole.model")
const User = require("./model/user.model")
const ServerInfo = require("./model/serverinfo.model")


function genPass(passLen) {
    const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return new Array(passLen).fill(0).map(x => (function (chars) {
        let umax = Math.pow(2, 32)
        r = new Uint32Array(1)
        max = umax - (umax % chars.length)
        do { crypto.getRandomValues(r); } while (r[0] > max);
        return chars[r[0] % chars.length];
    })(pwdChars)).join('');
}

async function databaseInit() {
    if (!await UserRole.findOne()) {
        const userRole = await (new UserRole({ name: "User", permisions: "444" })).save()
        const adminRole = await (new UserRole({ name: "Administrator", permisions: "666" })).save()

        const adminAccount = await User.findOne({ username: "admin" })
        if (adminAccount) {
            logger.info("Deleted old (dev) admin account")
            await adminAccount.deleteOne();
        }

        const password = genPass(20);
        const passHash = await bcrypt.hash(password, 10);

        await (new User({ username: "admin", role: adminRole._id, passwordHash: passHash })).save()

        logger.info("Credentials: admin/%s please change password immediately", password)
    }
    if (!await ServerInfo.findOne()) {
        const serverinfo = new ServerInfo({
            name: "Education platform",
            contactsText: "# Fill me",
            attachments: [],
            introduction: "Welcome text! Change me!"
        })
        await serverinfo.save()
    }
}

module.exports = databaseInit
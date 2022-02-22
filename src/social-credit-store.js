const Keyv = require('keyv');
const keyv = new Keyv('sqlite://./assets/credits.sqlite');

keyv.on('error', err => console.error('Keyv connection error:', err));

exports.addCredits = async function (userid, amount) {
    let current = await this.getCredits(userid);
    if(current)
        await this.setCredits(userid, current + amount);
    else
        await this.setCredits(userid, amount);
}

exports.getCredits = async function (userid) {
    return await keyv.get(userid);  
}

exports.setCredits = async function (userid, amount) {
    await keyv.set(userid, amount);
}
const oracledb = require('oracledb');

const dbConfig = {
    user: "Admin",
    password: "1234",
    connectString: "localhost:1521/xe" 
};

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

async function openConnection() {
    try {
        return await oracledb.getConnection(dbConfig);
    } catch (err) {
        console.error("Error conectando a Oracle:", err);
        throw err;
    }
}

module.exports = { openConnection };
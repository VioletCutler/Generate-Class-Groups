const pg = require('pg')
const client = pg.Client(`postgres://localhost:5432/classgroups`)
module.exports = {
    client
}

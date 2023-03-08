const { client } = require('./client')
const bcrypt = require('bcrypt')
const SALT_COUNT = 10

async function createUser({ username, password, isAdmin}){
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    try {
      const {rows: [user]} = await client.query(`
        INSERT INTO users(username, password, isAdmin) VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING 
        RETURNING id, username, isAdmin
      `, [username, hashedPassword, isAdmin]);
      return user;
    } catch (error) {
      throw error;
    }
  }



module.exports = {
    createUser
}
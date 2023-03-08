const { createUser } = require('./users')
const { newUsers } = require('./dummyData')
const { client } = require('./client')

async function dropTables(){
    try{
        console.log('starting to drop tables...')
        await client.query(`
            DROP TABLE IF EXISTS "users";
        `)
        console.log('...finished dropping tables')
    } catch(error){
        console.log(error)
    }
}

async function createTables(){
    try{
        console.log('starting to create tables...')
        await client.query(`
            CREATE TABLE "users"(
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL, 
                isAdmin BOOLEAN DEFAULT false 
            );
        `)
        console.log('...finished creating tables')
    } catch(error){
        console.log(error)
    }
}

async function buildDatabase(){
    try{
        client.connect()

        await dropTables()
        await createTables()
        console.log(newUsers)
        const users = await Promise.all(newUsers.map((newUser) => createUser(newUser)))
        console.log(users)

        client.end()
    } catch(error){
        console.log(error)
    }
}

buildDatabase()
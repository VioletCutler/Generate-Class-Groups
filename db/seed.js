const { client } = require('./index')

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
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
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
    } catch(error){
        console.log(error)
    }
}

buildDatabase()
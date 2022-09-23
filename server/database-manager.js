import dotenv from 'dotenv'
import * as pg from 'pg'

dotenv.config()

const { Pool } = pg.default
const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

pool.connect()

/* QUERIES */

async function getQueue(limit = 33) {
    const query = "SELECT song_id, song_name, artist_name, singer_name, ts FROM songs WHERE played = false AND deleted = false ORDER BY ts LIMIT $1"
    const values = [limit]

    try {
        const res = await pool.query(query, values)
        return res.rows
    } catch (err) {
        console.log('DB ERROR:', err)
    }
}

async function addSong(id, title, artist, singer, visible = true) {
    const query = 'INSERT INTO songs (request_id, song_name, artist_name, singer_name, visible, played, deleted)' +
        'VALUES ($1, $2, $3, $4, $5, false, false)'
    const values = [id, title, artist, singer, visible]

    try {
        const res = await pool.query(query, values)
        return res.rows
    } catch (err) {
        console.log('DB ERROR:', err)
    }
}




export {getQueue, addSong}

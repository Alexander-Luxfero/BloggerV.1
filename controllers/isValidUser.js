import sqlite3 from "sqlite3"
import {checkPassword, hashPassword} from './security.js'

const db = new sqlite3.Database('/Users/aleksandrkuzmin/Projects/EasyBloger/BlogWebSite/db/pit.db');

async function check(username) {
    if (username) {
        try {
            const user = db.get(`SELECT username FROM users WHERE username = ?`, username);
            if (user) {
                return true;
            } else {
                console.log("User not found");
                return false;
            }
        } catch (error) {
            throw new Error(`User ${username} is not exist in database.`);
        }
    }
    console.log(`Input is empty or invalid!`);
    return false;
}



export async function isValidUser(username, password) {
    // Проверяем, есть ли пользователь в базе данных
    if (check(username)) {
        try {
            // Извлечение хешированного пароля из базы данных
            const result = db.all(`SELECT hash_password FROM users WHERE username = ? `, username);
            //Delete on finish ---> console.log(`DB extraction ${result}`);
            if (result) {
                // Проверяем пароль
                const hash = result.toString();
                //Delete on finish ---> console.log(`DB extraction to hash: ${hash}`);
                return checkPassword(password, hash);
            } 
            return false;
        
        } catch (error) {
            console.error(`Error fetching user: ${error.message}`);
            return false;
        }
    } else {
        console.log("Username check failed");
        return false;
    }
}
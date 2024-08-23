import sqlite3 from "sqlite3";
import { isValidUser } from './isValidUser.js';
import {hashPassword} from './security.js';
import fs from 'fs';


const db = new sqlite3.Database('/Users/aleksandrkuzmin/Projects/EasyBloger/BlogWebSite/db/pit.db');


export const getLogin = (req,res) => {
    res.render("login.ejs", {title: 'Login'})
};

export const mainPage = (req, res) => {
    let isLoggedIn = req.session.signed;
    res.render("main.ejs", { isLoggedIn, title: 'EasyBlogger'} );
  }

export const postLogin = (req,res) => {
    const { username, password }  = req.body;
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    if (isValidUser(username, password)) {
        req.session.signed = true;
        req.session.username = username;
        db.get('SELECT id FROM users WHERE username = ?', username, (err, row) => {
            if (err) {
                console.error('Ошибка выполнения запроса:', err.message);
                return;
            }
            if (row) {
                req.session.userId = parseInt(row.id);
                res.status(200).redirect("/user");  
                //console.log(`User ID: ${req.session.userId}`);
            } else {
                console.log('Пользователь не найден.');
                res.status(401).redirect("/login");
            }
        });
    } else {
        res.status(401).redirect("/login");
    }
};

export const getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({message: "Logout faled!"});
        }
        res.status(200).redirect("/")
        req.session.signed = false;
    })
};

export const getSingup = (req,res) => {
    res.render("signup.ejs", title='Sing Up')
};

export const postSingup = (req,res) => {
    const {email, username, password } = req.body
    db.all("INSERT INTO users (username, email, fname, lname, hash_password) VALUES (?, ?, ?, ?, ?)", username, email, "Part of the ship", "Part of the crwe", hashPassword(password));
    res.redirect("/login")
};

//Processiong posts
function queryDatabase(userId) {
    return new Promise((res, rej) => {
        db.all('SELECT * FROM posts WHERE user_id = ?', userId, (err, rows) => {
            if (err) {
                return rej(err);
            }
            res(rows);
        });
    });
}

async function getUserPosts(userId) {
    try {
        const rows = await queryDatabase(userId);
        return rows;  // Здесь данные уже возвращаются как массив объектов, а не строка JSON
    } catch (error) {
        console.error('Ошибка:', error.message);
        throw error;
    }
}

export const getUser = async (req, res) => {
    const isLoggedIn = req.session.signed;
    const username = req.session.username;
    const userId = req.session.userId;

    try {
        // Ждём завершения асинхронной функции и получаем данные
        let userPosts = await getUserPosts(userId);

        if (isLoggedIn) {
            res.render("index.ejs",  { username, isLoggedIn, userPosts } );
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Ошибка при получении постов пользователя:', error.message);
        res.status(500).send('Ошибка сервера');
    }
};
import sqlite3 from "sqlite3";

const db = new sqlite3.Database('/Users/aleksandrkuzmin/Projects/EasyBloger/BlogWebSite/db/pit.db');

export const getCreatePost = (req, res) => {
    const isLoggedIn = req.session.signed;
    const username = req.session.username;
    res.status(200).render("create_post.ejs", {isLoggedIn, username} );
}

export const postCreatePost = (req, res) => {
    const username = req.session.username;
    const userId = req.session.userId;
    const { title, main_text } = req.body;  
    
    console.log(`User ${username} \n ID: ${userId} \n Title: ${title} \n Text of post: ${main_text}`);
    db.run("INSERT INTO posts (user_id, title, main_text) VALUES (?, ?, ?)", [userId, title, main_text], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Server Error.");
        }
        res.status(200).redirect("/user");
    });
}

export const getEditPost = (req, res) => {
    const isLoggedIn = req.session.signed;
    const username = req.session.username; 
    const userId = req.session.userId;
    const postId = req.params.id;

    db.get("SELECT * FROM posts WHERE id = ?", postId, (error, row) => {
        if (error) {
            return res.status(500).send('Server Error');
        }
        if (!row ) {
            console.log('Not found!');
            return res.status(404).redirect('/user');
        }
        if (row.user_id !== userId) {
            return res.status(403).send("You do not have permission to edit this post!").redirect('/user');
        }
        return res.status(200).render("editPost.ejs", {isLoggedIn, postId, userId, username, row} );
    });
    
};

export const postEditPost = (req, res) => {
    const userId = req.session.userId;
    const postId = req.params.id;
    const updtTitle =  req.body.title;
    const updtText = req.body.main_text;

    if (!updtTitle || !updtText) {
        return res.status(400).send("Title and text are required!")
    }
    //Inside usualy second check, in this way, if someone try to update he will get an eroe from sql 
    db.run("UPDATE posts SET title = ?, main_text = ? WHERE id = ? AND user_id = ?", [updtTitle, updtText, postId, userId], function(err) {
        if (err) {
            console.error(err)
            return res.status(500).send("Error while updating")
        }
        if (this.changes === 0) {
            return res.status(403).send("You do not have permission to edit this post!").redirect('/user');
        }
        return res.redirect("/user")
    })
}

export const postDeletePost = (req, res) => {
    const userId = req.session.userId;
    const postId = req.params.id;

    db.run("DELETE FROM posts WHERE id = ? AND user_id = ?", [ postId, userId], function(err) {
        if (err) {
            console.error(err)
            return res.status(500).send("Error while deleting")
        }
        if (this.changes === 0) {
            return res.status(403).send("You do not have permission to edit this post!").redirect('/user');
        }
        return res.redirect("/user")
    })
}
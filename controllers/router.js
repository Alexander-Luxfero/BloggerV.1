import express from "express";
export const router = express.Router();
import { getLogout, getUser,
        } from "./loginController.js";
import { getEditPost, getCreatePost,
        postEditPost, postCreatePost,
        postDeletePost
        } from "./postsRedactor.js";
import { checkAuthentication } from "../middleware/checkAutentication.js";

 
router.use(checkAuthentication);



router.get("/logout", getLogout)

router.get("/user", getUser);

//Block responsible for: creating, deliting, redactoring of the posts;

router.get("/create_post", getCreatePost);

router.post("/create_post", postCreatePost);

//Edit part
router.get("/edit/:id", getEditPost);

router.post("/update/:id" , postEditPost)

router.get("/delete/:id" , postDeletePost)



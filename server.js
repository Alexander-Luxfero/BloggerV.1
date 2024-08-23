import express from "express";
import expressSession from "express-session";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import { router } from "./controllers/router.js"; 
import { mainPage, getLogin, postLogin, getSingup, postSingup } from "./controllers/loginController.js";
const app = express();
const port = 3000;
app.use(express.static("public"));


//Inicialise session
let secret = 'secret-key';
app.use(cookieParser(secret));
app.use(expressSession({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  sugned: false,
  userId: 0,
  cookie: { maxAge: 24 * 60 * 60 * 1000}
}));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", mainPage);

router.get("/login", getLogin);

router.post("/login", postLogin);

router.get("/signup", getSingup);

router.post("/signup", postSingup);

app.use('/', router);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(`http://localhost:${port}`);
});
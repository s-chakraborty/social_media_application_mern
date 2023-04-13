import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import {createPost} from "./controllers/posts.js";
import {register}  from "./controllers/auth.js";
import verifyToken from "./middleware/auth.js";
import User from "./models/User.js";
import { users,posts } from "./data/index.js";
import Post from "./models/Post.js";



/*configuration*/

const __filename = fileURLToPath(import.meta.url); /* grab file url specifically when we use the modules*/
const __dirname = path.dirname(__filename);
dotenv.config(); /* so that we can use .env files */
const app = express(); /* invoke our express application */
app.use(express.json);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb" , extended: true}));
app.use(bodyParser.urlencoded({limit :"30mb" , extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); /*set the directory of where we keep our assets*/


/*FILE STORAGE */
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/assets");
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})


const upload = multer({storage});


/* Routes with files*/
app.post("/auth/register",upload.single("picture"),register);
app.post("./posts",verifyToken,upload.single("picture"),createPost);

/*routes */

app.use("./auth",authRoutes);
app.use("/users",userRoutes);
app.use("./posts", postRoutes);


/*MONGOOSE SETUP*/
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT,() => console.log(`Server port: ${PORT}`));
   /* User.insertMany(users);
    Post.insertMany(posts); */
}).catch((err) => console.log(`${err} did not connect `));

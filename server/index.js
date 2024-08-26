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
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import { register} from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import {createPost} from "./controllers/posts.js";

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"})); //security
app.use(morgan("common")); //helps with debuging, logging http request
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true})); //Expected upload file
app.use(cors()); //middleware, to accept request from other domain (3001/3000) (CROSS-ORIGIN REQUEST)
app.use("/assests", express.static(path.join(__dirname, 'public/assets')));

/*FILE STORAGE*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");//handle error
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage}); // middleware to upload file

/*ROUTE WITH FILES*/
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/post", postRoutes);


/*MONGO SETUP*/
const PORT = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGO_URL)
    // if connect is successful
    .then(() => {
        app.listen(PORT, () => console.log(`Server PORT: ${PORT}`));
    })
    // if connect unsuccessfully, catch error
    .catch((error) => console.log(`${error} did not connect`));
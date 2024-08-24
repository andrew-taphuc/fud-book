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
        cb(null, "public/assets");
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage});

/*MONGO SETUP*/
const PORT = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(POST, (0 => console.log(`Server PORT: ${PORT}`)))
    });
    .catch((error) => con)
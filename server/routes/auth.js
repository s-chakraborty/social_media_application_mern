import {register,login} from "../controllers/auth.js"; 
import upload from "../storage/fileStorage.js";
import express from "express";

const router = express.Router();

// * Routes With Files
// * routs + middleware + endpoints logical function call
// in the HTTP call this [[[picture]]] property is setting where image is allocated...

// ✅✅✅ Create Operation
router.post("/registration", upload.single("picture"), register);

// 🟩🟩🟩 Read Operation 
router.post("/login", login);

export default router;
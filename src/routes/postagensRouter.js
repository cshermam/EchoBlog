import { Router } from "express"

import { criar, listarPostagens, atualizarPostagem } from "../controllers/postagensControllers.js"

const router = Router();

router.post("/", criar)



export default router
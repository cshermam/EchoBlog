import { Router } from "express"

import { criar, listarPostagens, atualizarPostagem } from "../controllers/postagensControllers.js"

const router = Router();

router.post("/", criar)
router.get("/:postagem_id", listarPostagens)
// router.put("/:postagem_id", atualizarPostagem)


export default router
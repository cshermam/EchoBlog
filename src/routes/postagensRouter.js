import { Router } from "express"

import { criar, listarPostagensid, atualizarPostagem, listarTudo, excluirPostagem } from "../controllers/postagensControllers.js"

const router = Router();

router.post("/", criar)
router.get("/:postagem_id", listarPostagensid)
router.put("/:postagem_id", atualizarPostagem)
router.get("/", listarTudo)
router.delete("/:id", excluirPostagem)

export default router
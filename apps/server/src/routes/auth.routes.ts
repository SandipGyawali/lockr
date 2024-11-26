import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middleware/zod.validator";
import { _registerSchema } from "../common/validators/auth.schema";

const router: Router = Router();

router.post("/register", validate(_registerSchema), authController.register);

export { router as authRouter };

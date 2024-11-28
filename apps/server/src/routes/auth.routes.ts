import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middleware/zod.validator";
import {
  _loginSchema,
  _registerSchema,
} from "../common/validators/auth.schema";

const router: Router = Router();

router.post("/register", validate(_registerSchema), authController.register);
router.post("/login", validate(_loginSchema), authController.login);
router.get("/refresh", authController.refresh);

export { router as authRouter };

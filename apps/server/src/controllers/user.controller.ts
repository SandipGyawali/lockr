import { userService, UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public findById(): Promise<any> {}
}

const userController = new UserController(userService);
export { userController };

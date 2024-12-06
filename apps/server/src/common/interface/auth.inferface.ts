export interface RegisterInterface {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInterface {
  email: string;
  password: string;
  userAgent?: string;
}

export interface ResetPasswordInterface {
  password: string;
  _verificationCode: string;
}

export interface LogoutInterface {
  sessionId: string;
}

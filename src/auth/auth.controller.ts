import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Construct JWT payload with sub, username, and role
    const payload = { sub: user.id, username: user.fullName, role: user.role };
    const token = this.authService.generateToken(payload);
    return { token };
  }

  @Post('validate')
  validate(@Body() body: { token: string }) {
    const payload = this.authService.validateToken(body.token);
    if (payload) {
      return { valid: true, payload };
    } else {
      return { valid: false, error: 'Invalid token' };
    }
  }
} 
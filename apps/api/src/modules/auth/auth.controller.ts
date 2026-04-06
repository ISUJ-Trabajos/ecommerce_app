import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export class AuthController {
  static async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;

    const attempt = await AuthService.getLoginAttempt(email);
    if (attempt && attempt.blocked_until && new Date(attempt.blocked_until) > new Date()) {
      return reply.status(403).send({ success: false, error: 'Cuenta bloqueada 10 minutos por múltiples intentos fallidos.' });
    }

    const user = await AuthService.getUserByEmail(email);
    if (!user) {
      await AuthService.incrementLoginAttempt(email);
      return reply.status(401).send({ success: false, error: 'Credenciales inválidas' });
    }

    if (user.status !== 'ACTIVO') {
      return reply.status(403).send({ success: false, error: 'Usuario no activo' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      await AuthService.incrementLoginAttempt(email);
      return reply.status(401).send({ success: false, error: 'Credenciales inválidas' });
    }

    await AuthService.resetLoginAttempts(email);

    const accessToken = request.server.jwt.sign({ id: user.id, role: user.role, email: user.email }, { expiresIn: '1h' });
    const refreshToken = uuidv4();
    await AuthService.saveSession(user.id, refreshToken, request.ip);

    reply.send({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      }
    });
  }

  static async register(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as any;
    
    const exists = await AuthService.getUserByEmail(data.email);
    if (exists) {
      return reply.status(409).send({ success: false, error: 'El email ya está registrado' });
    }

    const newUser = await AuthService.registerUser(data);
    
    const accessToken = request.server.jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email }, { expiresIn: '1h' });
    const refreshToken = uuidv4();
    await AuthService.saveSession(newUser.id, refreshToken, request.ip);

    reply.status(201).send({
      success: true,
      data: { accessToken, refreshToken, user: { id: newUser.id, email: newUser.email, full_name: newUser.full_name, role: newUser.role } }
    });
  }

  static async refresh(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = request.body as any;
    if (!refreshToken) return reply.status(401).send({ success: false, error: 'Refresh token requerido' });

    const session = await AuthService.getSession(refreshToken);
    if (!session || new Date(session.expires_at) < new Date()) {
      return reply.status(403).send({ success: false, error: 'Sesión expirada o inválida' });
    }

    const user = await AuthService.getUserById(session.user_id);

    const accessToken = request.server.jwt.sign({ id: user.id, role: user.role, email: user.email }, { expiresIn: '1h' });
    reply.send({ success: true, data: { accessToken } });
  }

  static async logout(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = request.body as any;
    if (refreshToken) await AuthService.revokeSession(refreshToken);
    reply.send({ success: true, message: 'Sesión cerrada exitosamente' });
  }
}

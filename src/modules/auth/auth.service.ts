import { UserService } from '../users/user.service';
import { comparePassword } from '../../utils/crypto';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { LoginDto, RegisterDto } from './auth.types';
import { logger } from '../../utils/logger';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

export class AuthService {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async register(data: any) {
        const existingUser = await this.userService.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const user = await this.userService.createUser(data);
        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);
        return { user, accessToken, refreshToken };
    }

    async login(data: any) {
        const user = await this.userService.findByEmail(data.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Account Lockout Logic
        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
            throw new Error(`Account locked until ${user.lockoutUntil}`);
        }

        const isValid = await comparePassword(data.password, user.password);
        if (!isValid) {
            // Increment failed attempts
            const attempts = (user.failedLoginAttempts || 0) + 1;
            let lockoutUntil = null;
            if (attempts >= 5) {
                lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
            }
            await this.userService.updateUser(user.id, {
                failedLoginAttempts: attempts,
                lockoutUntil: lockoutUntil
            });
            throw new Error('Invalid credentials');
        }

        // Reset failed attempts on success
        if (user.failedLoginAttempts > 0) {
            await this.userService.updateUser(user.id, { failedLoginAttempts: 0, lockoutUntil: null });
        }

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);

        return { user, accessToken, refreshToken };
    }

    async refreshToken(token: string) {
        const decoded = verifyRefreshToken(token);
        if (!decoded || !decoded.userId) {
            throw new Error('Invalid refresh token');
        }
        const user = await this.userService.getUserProfile(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const accessToken = signAccessToken(user);
        return { accessToken };
    }

    // MFA Methods
    async generateMfaSecret(userId: string) {
        const secret = speakeasy.generateSecret({ name: 'SAMACS' });
        await this.userService.updateUser(userId, { mfaSecret: secret.base32 });

        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);
        return { secret: secret.base32, qrCode: qrCodeUrl };
    }

    async verifyMfaWait(userId: string, token: string) {
        const user = await this.userService.getUserProfile(userId);
        if (!user || !user.mfaSecret) throw new Error('MFA not set up');

        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token
        });

        if (verified) {
            await this.userService.updateUser(userId, { mfaEnabled: true });
            return true;
        }
        return false;
    }
}

import { AuditRepository } from './audit.repository';
import { encrypt, decrypt } from '../../utils/crypto';

export class AuditService {
    private auditRepository: AuditRepository;

    constructor() {
        this.auditRepository = new AuditRepository();
    }

    async logAction(action: string, resource: string, details: any, userId?: string, ipAddress?: string) {
        const detailsStr = JSON.stringify(details);
        // In a real scenario, we might encrypt the 'details' field before storing
        // For this demo, let's wrap the details in an encrypted object structure string or store as is if schema allows
        // Schema has 'details' as String.

        // Encrypting the payload
        const { encrypted, iv, authTag } = encrypt(detailsStr);
        const storedDetails = JSON.stringify({ encrypted, iv, authTag });

        return this.auditRepository.create({
            action,
            resource,
            details: storedDetails,
            user: userId ? { connect: { id: userId } } : undefined,
            ipAddress
        });
    }

    async getLogs() {
        const logs = await this.auditRepository.findAll();
        return logs.map(log => {
            try {
                const { encrypted, iv, authTag } = JSON.parse(log.details);
                const decryptedDetails = decrypt(encrypted, iv, authTag);
                return { ...log, details: JSON.parse(decryptedDetails) };
            } catch (e) {
                // Fallback if not encrypted or error
                return log;
            }
        });
    }
}

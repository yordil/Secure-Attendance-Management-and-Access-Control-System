import { Request, Response } from 'express';
import { AuditService } from './audit.service';

export class AuditController {
    private auditService: AuditService;

    constructor() {
        this.auditService = new AuditService();
    }

    list = async (req: Request, res: Response) => {
        try {
            const logs = await this.auditService.getLogs();
            res.json(logs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}

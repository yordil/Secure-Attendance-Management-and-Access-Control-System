import { exec } from 'child_process';
import { env } from '../src/config/env';
import * as path from 'path';

const backup = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;
    const backupPath = path.join(__dirname, '..', 'backups', filename);

    // Ensure backups dir exists
    const fs = require('fs');
    const dir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    console.log(`Starting backup to ${backupPath}...`);

    // Parse DATABASE_URL for pg_dump credentials if needed, or rely on env
    // For simplicity, assuming local pg_dump availability and env vars
    // DATABASE_URL format: postgres://user:pass@host:port/db

    // WARNING: securely passing password to pg_dump usually requires .pgpass or env var PGPASSWORD
    const dbUrl = env.DATABASE_URL;

    exec(`pg_dump "${dbUrl}" > "${backupPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Backup failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Backup stderr: ${stderr}`);
        }
        console.log(`Backup completed successfully: ${filename}`);
    });
};

backup();

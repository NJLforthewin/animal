import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

function readLegalFile(filename: string) {
    const filePath = path.join(__dirname, '../../legal', filename);
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        return '';
    }
}

router.get('/terms', (req, res) => {
    const content = readLegalFile('terms.md');
    res.type('text/markdown').send(content);
});

router.get('/terms-summary', (req, res) => {
    const content = readLegalFile('terms-summary.md');
    res.type('text/markdown').send(content);
});

router.get('/privacy', (req, res) => {
    const content = readLegalFile('privacy.md');
    res.type('text/markdown').send(content);
});

router.get('/privacy-summary', (req, res) => {
    const content = readLegalFile('privacy-summary.md');
    res.type('text/markdown').send(content);
});

export default router;

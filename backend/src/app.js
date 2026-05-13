import 'dotenv/config';
import express from 'express';
import { startBlockchainListener } from './blockchain/listener.js';
import webhookRoutes from './routes/webhooks.js';
import adminRoutes from './routes/admin.js';

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────

app.use('/webhook', webhookRoutes);
app.use('/admin',   adminRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }));

// ── Démarrage ─────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[Server] ✅ DiasporaConnect backend démarré sur le port ${PORT}`);
  startBlockchainListener();
});

import { Router } from 'express';
import { onCinetPayWebhook } from '../services/liquidityOrchestrator.js';

const router = Router();

// ── Webhook CinetPay ──────────────────────────────────────────────────────────
// POST /webhook/cinetpay

router.post('/cinetpay', async (req, res) => {
  const { transaction_id: cinetPayId, status, client_transaction_id: transferId } = req.body;

  console.log(`[Webhook/CP] cinetPayId=${cinetPayId} status=${status} transferId=${transferId}`);

  if (!cinetPayId || !status) {
    return res.status(400).json({ error: 'Payload invalide' });
  }

  res.status(200).json({ received: true });

  setImmediate(async () => {
    try {
      await onCinetPayWebhook({ cinetPayId, status, transferId });
    } catch (err) {
      console.error('[Webhook/CP] Erreur :', err.message);
    }
  });
});

export default router;

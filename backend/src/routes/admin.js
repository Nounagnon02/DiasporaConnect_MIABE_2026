import { Router } from 'express';
import { getFloatBalance, getExchangeRate } from '../services/cinetPayService.js';
import { getAllTransfers, getTransfer } from '../db/transfers.js';

const router = Router();

// ── GET /admin/float-balance ──────────────────────────────────────────────────

router.get('/float-balance', async (req, res) => {
  try {
    const balance   = await getFloatBalance();
    const threshold = parseInt(process.env.FLOAT_ALERT_THRESHOLD_FCFA || '500000');
    res.json({ ...balance, threshold, alert: balance.balanceFCFA < threshold });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /admin/rate — taux cUSD → FCFA en temps réel ─────────────────────────

router.get('/rate', async (req, res) => {
  try {
    const rate = await getExchangeRate();
    res.json(rate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /admin/transfers ──────────────────────────────────────────────────────

router.get('/transfers', (req, res) => {
  res.json(getAllTransfers());
});

// ── GET /admin/transfers/:id ──────────────────────────────────────────────────

router.get('/transfers/:id', (req, res) => {
  const transfer = getTransfer(req.params.id);
  if (!transfer) return res.status(404).json({ error: 'Transfert non trouvé' });
  res.json(transfer);
});

export default router;

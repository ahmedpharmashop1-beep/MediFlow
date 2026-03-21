const express = require('express');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// Minimal CNAM workflow endpoints (ready for extension)
router.post('/dossiers', isAuth, async (req, res) => {
  const { title = 'Demande CNAM', note = '' } = req.body;
  return res.status(201).send({
    msg: 'CNAM dossier created',
    dossier: {
      id: `CNAM-${Date.now()}`,
      patientId: req.user._id,
      title,
      note,
      status: 'en_attente',
      createdAt: new Date(),
    },
  });
});

router.get('/dossiers/:id/tracking', isAuth, async (req, res) => {
  return res.status(200).send({
    id: req.params.id,
    status: 'en_examen',
    steps: ['recu', 'en_examen', 'decision'],
  });
});

module.exports = router;


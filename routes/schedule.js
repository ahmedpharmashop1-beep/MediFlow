const express = require('express');
const router = express.Router();
const Doctor = require('../Model/Doctor');
const isAuth = require('../middlewares/isAuth');

// Obtenir les horaires d'un médecin
router.get('/doctors/:id/schedule', isAuth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ msg: 'Médecin non trouvé' });
    }

    res.json({
      schedule: {
        availableDays: doctor.availableDays || [],
        availableTimeSlots: doctor.availableTimeSlots || []
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Mettre à jour les horaires d'un médecin
router.put('/doctors/:id/schedule', isAuth, async (req, res) => {
  try {
    const { availableDays, availableTimeSlots } = req.body;
    
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ msg: 'Médecin non trouvé' });
    }

    // Vérifier que l'utilisateur est bien le médecin propriétaire
    if (doctor._id.toString() !== req.user._id && req.user.role !== 'cnam_admin') {
      return res.status(403).json({ msg: 'Non autorisé' });
    }

    // Valider les créneaux horaires
    for (const slot of availableTimeSlots) {
      if (!slot.start || !slot.end) {
        return res.status(400).json({ msg: 'Les créneaux doivent avoir une heure de début et de fin' });
      }
      
      // Vérifier le format HH:MM
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
        return res.status(400).json({ msg: 'Format d\'heure invalide (utilisez HH:MM)' });
      }
    }

    // Mettre à jour les horaires
    doctor.availableDays = availableDays;
    doctor.availableTimeSlots = availableTimeSlots;
    
    await doctor.save();

    res.json({
      msg: 'Horaires mis à jour avec succès',
      schedule: {
        availableDays: doctor.availableDays,
        availableTimeSlots: doctor.availableTimeSlots
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des horaires:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Obtenir les médecins disponibles pour une date/heure donnée
router.get('/doctors/available', async (req, res) => {
  try {
    const { date, time } = req.query;
    
    if (!date) {
      return res.status(400).json({ msg: 'Date requise' });
    }

    // Convertir la date en jour de la semaine
    const dayOfWeek = new Date(date).toLocaleLowerCase('fr-FR', { weekday: 'long' });
    const dayMap = {
      'lundi': 'monday',
      'mardi': 'tuesday', 
      'mercredi': 'wednesday',
      'jeudi': 'thursday',
      'vendredi': 'friday',
      'samedi': 'saturday',
      'dimanche': 'sunday'
    };
    
    const dayKey = dayMap[dayOfWeek] || dayOfWeek;

    // Trouver les médecins disponibles
    const availableDoctors = await Doctor.find({
      availableDays: dayKey,
      'availableTimeSlots.start': { $lte: time },
      'availableTimeSlots.end': { $gte: time }
    }).select('-password');

    res.json({
      availableDoctors,
      date,
      time,
      day: dayKey
    });
  } catch (error) {
    console.error('Erreur lors de la recherche des médecins disponibles:', error);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

module.exports = router;

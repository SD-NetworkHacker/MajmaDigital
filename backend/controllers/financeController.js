
const mongoose = require('mongoose');
const Contribution = require('../models/Contribution');
const Commission = require('../models/Commission');
const Member = require('../models/Member');

// @desc    Enregistrer une cotisation avec transaction atomique (ACID)
// @route   POST /api/finance/pay
// @access  Private (Admin/Finance)
const processPayment = async (req, res) => {
  const { memberId, type, amount, eventLabel, processedBy } = req.body;

  // Démarrage de la session MongoDB pour la transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Création de l'enregistrement de la contribution (Reçu)
    const [contribution] = await Contribution.create([{
      member: memberId,
      type,
      amount,
      eventLabel,
      status: 'paid',
      transactionId: `TX-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      processedBy
    }], { session });

    // 2. Mise à jour du solde de la Commission "Finance" (Compte Central)
    const commissionUpdate = await Commission.findOneAndUpdate(
      { name: 'FINANCE' },
      { 
        $inc: { balance: amount, totalRaised: amount },
        $set: { lastActivity: new Date() }
      },
      { session, new: true, upsert: true }
    );

    // 3. Mise à jour atomique du profil Membre (Stats financières)
    // Cela permet d'avoir le total versé par le membre sans recalculer tout l'historique à chaque fois
    await Member.findByIdAndUpdate(
      memberId,
      {
        $inc: { 'financialStats.totalContributed': amount },
        $set: { 'financialStats.lastContributionDate': new Date() }
      },
      { session, new: true }
    );

    // Si toutes les opérations réussissent, on valide la transaction
    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      data: contribution,
      newGlobalBalance: commissionUpdate.balance,
      message: 'Transaction validée : Reçu créé, Solde mis à jour, Profil membre actualisé.'
    });

  } catch (error) {
    // En cas d'erreur sur N'IMPORTE QUELLE étape, on annule TOUT (Rollback)
    await session.abortTransaction();
    
    console.error('Transaction Aborted:', error);
    res.status(500).json({
      success: false,
      error: 'Échec de la transaction. Aucune donnée n\'a été modifiée.'
    });
  } finally {
    // Fin de la session
    session.endSession();
  }
};

// @desc    Récupérer l'historique des contributions
// @route   GET /api/finance
// @access  Private
const getContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({})
      .populate('member', 'firstName lastName matricule') // On inclut les infos du membre
      .sort({ date: -1 }); // Plus récent en premier
      
    res.json({ data: contributions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
  getContributions
};

const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { LoanApplication } = require('../models');


router.use(auth);


router.get('/', requireRole(['Admin','Ops','Credit','Risk','Partner','Dealer']), async (req,res,next)=>{
try { const rows = await LoanApplication.findAll({ order:[['id','DESC']] }); res.json({ ok:true, data: rows }); } catch(e){ next(e); }
});


router.post('/', requireRole(['Admin','Ops','Dealer','Partner']), async (req,res,next)=>{
try { const row = await LoanApplication.create(req.body); res.json({ ok:true, data: row }); } catch(e){ next(e); }
});


router.get('/:id', requireRole(['Admin','Ops','Credit','Risk','Partner','Dealer']), async (req,res,next)=>{
try { const row = await LoanApplication.findByPk(req.params.id); if(!row) return res.status(404).json({ ok:false }); res.json({ ok:true, data: row }); } catch(e){ next(e); }
});


module.exports = router;
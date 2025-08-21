const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { Dealer } = require('../models');


router.use(auth);


router.get('/', requireRole(['Admin','Ops','Dealer','Partner']), async (req,res,next)=>{
try { const list = await Dealer.findAll({ order:[['id','DESC']] }); res.json({ ok:true, data:list }); } catch(e){ next(e); }
});


router.post('/', requireRole(['Admin','Ops']), async (req,res,next)=>{
try { const d = await Dealer.create(req.body); res.json({ ok:true, data:d }); } catch(e){ next(e); }
});


router.get('/:id', requireRole(['Admin','Ops','Dealer']), async (req,res,next)=>{
try { const d = await Dealer.findByPk(req.params.id); if(!d) return res.status(404).json({ok:false}); res.json({ ok:true, data:d }); } catch(e){ next(e); }
});


module.exports = router;
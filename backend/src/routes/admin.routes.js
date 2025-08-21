const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { User, Role } = require('../models');


router.use(auth, requireRole(['Admin']));


router.get('/users', async (req,res,next)=>{
try { const users = await User.findAll({ include: [Role] }); res.json({ ok:true, data: users }); } catch(e){ next(e); }
});


router.post('/users/:id/roles', async (req,res,next)=>{
try {
const user = await User.findByPk(req.params.id);
const roles = await Role.findAll({ where: { name: req.body.roles || [] }});
await user.setRoles(roles);
res.json({ ok:true });
} catch(e){ next(e); }
});


router.get('/roles', async (req,res,next)=>{
try { const roles = await Role.findAll(); res.json({ ok:true, data: roles }); } catch(e){ next(e); }
});


router.post('/roles/seed', async (req,res,next)=>{
try {
const base = ['Admin','SuperOps','Ops','Credit','Risk','Collections','Dealer','Partner','Auditor'];
await Promise.all(base.map(n => Role.findOrCreate({ where:{ name:n }, defaults:{ description:n } })));
res.json({ ok:true });
} catch(e){ next(e); }
});


module.exports = router;
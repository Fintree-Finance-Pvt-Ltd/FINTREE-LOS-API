const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { Document } = require('../models');


const uploadDir = process.env.UPLOAD_DIR || 'src/uploads';
const storage = multer.diskStorage({
destination: (req,file,cb)=>cb(null, uploadDir),
filename: (req,file,cb)=>{
const unique = Date.now()+"-"+Math.round(Math.random()*1e9);
cb(null, unique + path.extname(file.originalname));
}
});
const upload = multer({ storage });


router.use(auth);


router.post('/loan/:loanId', requireRole(['Admin','Ops','Dealer','Partner']), upload.array('files', 10), async (req,res,next)=>{
try {
const items = await Promise.all((req.files||[]).map(f => Document.create({
loan_application_id: req.params.loanId,
doc_type: req.body.doc_type || 'GENERIC',
file_key: f.filename,
original_name: f.originalname,
mime_type: f.mimetype,
size: f.size,
uploaded_by: req.user.sub
})));
res.json({ ok:true, data: items });
} catch(e){ next(e); }
});


module.exports = router;
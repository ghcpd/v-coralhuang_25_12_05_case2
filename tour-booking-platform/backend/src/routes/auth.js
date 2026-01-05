const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

router.post('/register', async (req, res) => {
	const {email, password, name} = req.body;
	if(!email || !password) return res.status(400).json({error: 'email and password required'});
	const hash = await bcrypt.hash(password, 10);
	try{
		const user = await prisma.user.create({data: {email, password: hash, name}});
		res.json({id: user.id, email: user.email});
	}catch(err){
		res.status(400).json({error: 'user exists or invalid data', details: err.message});
	}
});

router.post('/login', async (req, res) => {
	const {email, password} = req.body;
	if(!email || !password) return res.status(400).json({error: 'email and password required'});
	const user = await prisma.user.findUnique({where: {email}});
	if(!user) return res.status(401).json({error: 'invalid credentials'});
	const ok = await bcrypt.compare(password, user.password);
	if(!ok) return res.status(401).json({error: 'invalid credentials'});
	const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET || 'devsecret', {expiresIn: '7d'});
	res.json({token});
});

router.get('/ping', (req, res) => res.json({ok: true}));

module.exports = router;

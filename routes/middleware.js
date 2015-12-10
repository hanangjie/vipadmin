var express = require('express');
var router = express.Router();


router.use(function timeLog(req, res, next) {
	if(req.path=='/login'){
		next();	
		return;
	}
	/*console.log(req.session.cookie);*/
	next();	
 	//res.redirect('/login');
 	
});

module.exports = router;
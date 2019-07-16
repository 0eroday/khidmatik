const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const User = require('../../db-models/User');
const {check , validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../config/middleware/keys.json');


// @route    GET api/auth
// @desc     
// @access   Public

router.get('/',auth , async (req, res)=>{
    try{
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    }catch(err){
      res.status(500).send('Server Error');
      
    }
});


// @route    POST api/auth
// @desc     Authentication & user token
// @access   Public
router.post('/', 
  [
    check('email', 'please includ a valid email')
      .isEmail(),
    check('password','Password is required').exists()
  ],
  async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }  
    
    const {email, password} = req.body;
    try{
      let user = await User.findOne({email})
      if(!user){
        return res.status(400).json({errors: {msg: "Invalid information provided"}});
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){        
        return res.status(400).json({errors: {msg: "Invalid information provided"}});
      }

      const payload = {
        id: user.id
      }

      jwt.sign(
        payload,
        keys.jwtToken,
        {expiresIn: 80000},
        (err, token)=>{
          if(err) throw err;
          res.json({token});
        });
    }catch(err){
      res.status(500).send('Server error');
    }
  });

module.exports = router;  
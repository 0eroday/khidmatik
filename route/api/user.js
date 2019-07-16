const express = require('express');
const router = express.Router();
const {check , validationResult} = require('express-validator/check');
const User = require('../../db-models/User');
const bcrypt = require('bcryptjs');



// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', 
  [
    check('name', 'name is required')
      .not()
      .isEmpty(),
    check('email', 'please includ a valid email')
      .isEmail(),
    check('password','Please enter a password with 6 or more characters')
      .isLength({ min: 6 })
  ],
  async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }  
    
    const {name, email, password} = req.body;
    try{
      let user = await User.findOne({email})
      if(user){
        return res.status(400).json({errors: {msg: "User is already exists"}});
      }

      user = new User({
        name,
        email,
        password
      });

      const sult = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, sult);
      await user.save();

      res.send('user is on bro')
    }catch(err){
      console.log(err.message);
      res.status(500).send('Server error');
    }
  });


module.exports = router;  
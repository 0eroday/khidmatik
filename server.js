const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const DBconnection = require('./config/db-connection');
const path = require('path');

require('./config/middleware/middleware')(app, express);

DBconnection()
// app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/users', require('./route/api/user'));

app.listen(PORT,()=>{console.log("server now runing on port " +`${PORT}`);
})
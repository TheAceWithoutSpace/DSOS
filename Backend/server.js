const express = require('express');
const cors = require('cors');
const app = express();
const mongoose=require("mongoose");
const SSH2Shell =require("ssh2shell");
require('dotenv/config');
app.use(cors());
app.use(express.json());

const port =3000;
const ReqRouter=require('./routes/DataRequsts');
const Filles=require("./routes/FillesRoutes")
const UsersRouter=require('./routes/users');
const Bug =require('./routes/Bug');
const AggregateRoute = require('./routes/AggregateRoute');
const SvmRoute=require('./routes/SvmRoute');
const VolumeRoute=require('./routes/VolumeRoute');
const MonthDateRoute =require("./routes/MonthData");
const schedule=require('node-schedule');
const SSH=require('./Shell.config')

app.use('/',function (req, res, ) {
    SSH.GetShellData()
    res.send('Hello1')
  })
  schedule.scheduleJob('0 0 4 * * *', () => {
    SSH.GetShellData()
  })
//RequestsRoutes
app.use('/Request',ReqRouter);
//FileRoute
app.use('/File',Filles);
//BugsRoute
app.use('/Bug',Bug);
//UsersRoute
app.use('/users',UsersRouter);
//AggregateRoute
app.use('/Aggregate',AggregateRoute);
//SvmRoute
app.use('/SvmRoute',SvmRoute);
//VolumeRoute
app.use('/VolumeRoute',VolumeRoute);
//MonthReportRoute
app.use('/MonthDateRoute',MonthDateRoute)

app.listen(port,()=>console.log(process.env.serverRunningMsg+port));


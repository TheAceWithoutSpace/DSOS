const express = require('express');
const cors = require('cors');
const app = express();
const mongoose=require("mongoose");
const mongoURI="mongodb+srv://ben78901:69zu9b3k@cluster0.tl2pj.mongodb.net/<dbname>?retryWrites=true&w=majority";
//"mongodb://localhost:27017/DSOS";
app.use(cors());
app.use(express.json());

const mongoconnectmsg="Mongodb database connection established succsesfully";
const port =3000;
const serverRunningMsg='Server is running on port:'+port;
const ReqRouter=require('./routes/DataRequsts');
const Filles=require("./routes/FillesRoutes")
const UsersRouter=require('./routes/users');
const Bug =require('./routes/Bug');
const AGGREGATERoute = require('./routes/AGGREGATERoute');
const SvmRoute=require('./routes/SvmRoute');
const VolumeRoute=require('./routes/VolumeRoute');
const MonthDateRoute =require("./routes/MonthData")
// connecting to local db 
mongoose.connect(mongoURI, {useNewUrlParser:true,useCreateIndex:true});
const conn=mongoose.connection;
conn.once('open',()=>{
    console.log(mongoconnectmsg);
})
let ts=Date.now()
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
console.log(date+"/"+month+"/"+year)
//RequestsRoutes
app.use('/Request',ReqRouter);
//FileRoute
app.use('/File',Filles);
//BugsRoute
app.use('/Bug',Bug);
//UsersRoute
app.use('/users',UsersRouter);
//AGGREGATERoute
app.use('/AGGREGATE',AGGREGATERoute);
//SvmRoute
app.use('/SvmRoute',SvmRoute);
//VolumeRoute
app.use('/VolumeRoute',VolumeRoute);
//MonthReportRoute
app.use('/MonthDateRoute',MonthDateRoute)

app.listen(port,()=>console.log(serverRunningMsg));

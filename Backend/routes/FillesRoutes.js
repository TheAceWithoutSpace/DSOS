const router=require('express').Router();
const path=require('path');
const mongoose=require('mongoose');
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const crypto=require("crypto");

const mongoURI="mongodb+srv://ben78901:69zu9b3k@cluster0.tl2pj.mongodb.net/<dbname>?retryWrites=true&w=majority";
//connection to the db 
const conn=mongoose.createConnection(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
//@inside the connection create collection uplods(for the files)
let gfs;
conn.once('open',()=>{
    gfs=Grid(conn.db,mongoose.mongo);
    gfs.collection('uploads');
})
//File Schima 
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        //@createing a random 16 bytes name for the file
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload =multer({storage});
//Uploud file
router.route("/upload").post(upload.single('file'),(req,res,)=>{
    if(req.file===null)
        return res.status(400).jsno({msg:'no file uploaded'})
    res.json({file:req.file})
});
//get All Filles
router.route('/').get((req,res)=>{
    console.log('all files')
    gfs.files.find().toArray((err,files)=>{
        if(!files||files.length===0){
            return res.status(404).json({
                err:"no files"
            });
        }
        return res.json(files)
    });
});
//get a file by filename(filename is a uniq string)
router.route('/:filename').get((req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
    
  });
});
//Delete a File by a name(Uniq String)
router.route('/:FileName').delete((req,res)=>{
  gfs.files.findOne({ filename: req.params.FileName }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }else{
      gfs.getStore().remove(file); //remove record from grid
      gfs.getStore().sync()
      }
  })
})
module.exports=router;
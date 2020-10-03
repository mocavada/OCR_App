// Declare Imports
const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const worker = Tesseract.createWorker();


  
// Declare Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
   
});
const upload = multer({storage: storage}).single("avatar"); 

// View
app.set("view engine", "ejs");


// Routes
app.get("/", (req, res) => {
     res.render('index');
})

app.post("/upload", (req, res) => {
    upload(req, res, err => {
        fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
            if(err) return console.log('This is the error', err);
            Tesseract
            .recognize(data, 'eng', { 
                logger: m => console.log(m), 
                tessjs_create_pdf: '1'}).then(result => {
                    res.send(result.data.text);
                }).finally(() => 
                worker.terminate());
        });
    });
});


const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Yo Running in port ${PORT}`));






const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");
const mysql = require("mysql");
const app = express();

let db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "890400",
  database: "mail",
});
db.connect((err) => {
  if (err) {
    console.log(err);
  }
});
// View engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/compose", (req, res) => {
  res.render("contact");
});
app.get("/", (req, res) => {
  db.query(`SELECT * FROM user1 `, (err, result) => {
    if (err) throw err;
    else {
      res.render("home", { result });
    }
  });
});

app.post("/send", (req, res) => {
  const output = `
     
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "manojcs123456@gmail.com",
      pass: "qhqswwshnunixlky",
    },
  });
  var mailOptions = {
    from: "manojcs123456@gmail.com",
    to: req.body.email,
    subject: req.body.subject, // Subject line
    text: "hello", // plain text body
    html: output,
  };
  var from = "manojcs123456@gmail.com";
  let to = req.body.email;
  let subject = req.body.subject; // Subject line

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    sql = "INSERT INTO user1 (receiver,sender,Subject) VALUES(?,?,?)";
    db.query(sql, [to, from, subject], (err, result) => {
      if (err) {
        console.log(err);
      }
      res.render("contact");
    });
  });
});

app.post("/details", (req, res) => {
  const zip = req.body.zip;
  db.query(`SELECT * FROM user1 where id=? `, [zip], (err, result) => {
    if (err) throw err;
    else {
      let subject = result[0].Subject;
      let to = result[0].receiver;
      let time = result[0].Time;
      res.render("details", { subject, to ,time});
    }
  });
});
app.get("/number", (req, res) => {
  res.render("number");
});

app.listen(3000, () => console.log("Server started..."));

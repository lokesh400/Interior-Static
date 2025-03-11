const express = require("express");
const router =  express.Router();
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');
const NewsLetter = require('../models/NewsLetter');
const nodemailer = require("nodemailer")


//   function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.redirect('/user/login');
//   }


//   function isAdmin(req, res, next) {
//     if (req.isAuthenticated() && req.user.role === 'admin') {
//       return next();
//     }
//     res.render("./error/accessdenied.ejs");
//   }

router.post("/add/new/query", async (req, res) => {
    try {
        const { name, mobile, email, query } = req.body;
        const enquiry = new Enquiry({ name, mobile, email, query });
        await enquiry.save();
        const newsletter = new NewsLetter({ email });
        await newsletter.save();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "official.nostrumdreamspaces@gmail.com",
                pass: process.env.MAILPASS, // Make sure MAILPASS is set in your environment
            },
        });
        const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Enquiry Received</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                h2 { color: #333; text-align: center; }
                .details { background: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 10px; }
                .details p { font-size: 16px; color: #555; margin: 8px 0; }
                .footer { text-align: center; font-size: 14px; color: #888; margin-top: 20px; }
                .footer a { color: #007bff; text-decoration: none; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>New Enquiry Received</h2>
                <p>Hello Admin,</p>
                <p>You have received a new enquiry. Here are the details:</p>
                <div class="details">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Mobile:</strong> <a href="tel:${mobile}">${mobile}</a></p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Query:</strong> ${query}</p>
                </div>
                <p>Kindly respond to the enquiry as soon as possible.</p>
                <div class="footer">
                    <p>Thank you!<br><strong>Nostrum Dream Spaces</strong></p>
                    <p><a href="https://nostrumdreamspaces.com">Visit Website</a></p>
                </div>
            </div>
        </body>
        </html>
        `;
        const mailOptions = {
            from: "official.nostrumdreamspaces@gmail.com",
            to: "rahulchaudhary2001rc@gmail.com",
            subject: "New Enquiry Generated",
            html: emailTemplate, // Sending HTML content
        };
        await transporter.sendMail(mailOptions);
        console.log(`Enquiry email sent successfully to Admin.`);
        res.status(201).json({ message: "Query submitted successfully." });
    } catch (error) {
        console.error("Error adding query:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});



//   router.get("/admin", ensureAuthenticated, isAdmin, async (req, res) => {
//     try {
//       const Users = await User.find();
//       const Members = await User.find({ role: "admin" });
//       const Questions = await Question.find();
//       const Tests = await Test.find();
//       let totalPurchasedBatches = 0;
//       for (let i = 0; i < Users.length; i++) {
//         totalPurchasedBatches += Users[i].purchasedBatches.length;
//       }
//       const details = {
//         users: Users.length,               
//         questions: Questions.length,      
//         tests: Tests.length,               
//         members: Members,                  
//         totalPurchasedBatches: totalPurchasedBatches,
//       };
//       res.render("./admin/admin-index.ejs", { details });
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       res.status(500).send("Server Error");
//     }
//   });
  
  
// router.get("/student",ensureAuthenticated,async (req,res)=>{
//     req.flash('success_msg', 'Login Successfull');
//     const allBatches = await Batch.find({});
//     res.render("./student.ejs",{allBatches})
//   })
  
// router.get("/terms-and-conditions",(req,res)=>{
//     res.render("./users/terms-and-conditions.ejs")
//   })
  
// router.get("/privacy-policy",(req,res)=>{
//     res.render("./users/privacy-policy.ejs")
//   });
  
 
// // ADMIN ROUTE TO DELETE A TEST  
// router.delete('/admin/delete/test/:id', async (req, res) => {
//   const testId = req.params.id; // Get the test ID from the request parameters
//   try {
//     const result = await Test.findByIdAndDelete(testId);
//         if (!result) {
//             return res.status(404).json({ error: 'Test not found.' });
//         }
//       // Find all batches containing the test with the matching ID and remove that test from the tests array
//       const updateResult = await Batch.updateMany(
//           { "tests.id": testId }, // Find batches containing a test with the matching testId
//           { $pull: { tests: { id: testId } } } // Remove the test with the matching ID from the tests array
//       );
//       if (updateResult.modifiedCount > 0) {
//           return res.status(200).json({ message: 'Test deleted successfully from all batches!' });
//       } else {
//           return res.status(200).json({ message: 'Test deleted successfully, but no batches contained this test.' });
//       }
//   } catch (error) {
//       console.log('Error deleting test:', error);
//       return res.status(500).json({ error: error.message });
//   }
// });

//   // Admin Route - List all tests
// router.get('/admin/tests', async (req, res) => {
//     const tests = await Test.find({}); // Fetch all tests from the database
//     res.render('./testseries/admin-test', { tests });
//   });
  
// router.get('/admin/test/:id', async (req, res) => {
//     const test = await Test.findById(req.params.id);
//     res.render('./admin/print-test.ejs', { test });
//   });
  
// router.get("/user/complaint",(req,res)=>{
//     res.render("./complaints/student-window.ejs")
//   })
  
// //Admin route to see analysis of a test 
// router.get('/student/test/:testId/analysis', async (req, res) => {
//   try {
//     const Id = req.params.testId;
//     const StudentResult = await StudentTest.find({ testId:Id }).populate('studentId', 'name').populate('testId','title').sort({ score: -1 });
//     res.render('./admin/studentsreport.ejs', { StudentResult });
//   } catch (error) {
//     console.error("Error fetching student results:", error);
//     res.status(500).send("Server Error");
//   }
// });



module.exports = router;

const express = require("express");
const router =  express.Router();
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');
const NewsLetter = require('../models/NewsLetter');
const nodemailer = require("nodemailer")


  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/user/login');
  }


  function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    res.render("./error/accessdenied.ejs");
  }

router.get('/enquiries',ensureAuthenticated,isAdmin, async (req, res) => {
    try {
        const enquiries = await Enquiry.find();
        res.render('admin/allEnquiry', { enquiries, success_msg: req.flash('success_msg') });
    } catch (error) {
        console.error("Error fetching enquiries:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Delete an enquiry
router.delete('/admin/enquiries/:id',ensureAuthenticated,isAdmin, async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        req.flash('success_msg', "Enquiry deleted successfully");
        res.redirect('/enquiries')
    } catch (error) {
        console.error("Error deleting enquiry:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

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

module.exports = router;

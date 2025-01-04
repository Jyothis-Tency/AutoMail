import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvFilePath = path.join(__dirname, "companies.csv");

const emailData = [];

const sendEmail = async (email, HRName, companyName) => {
  const subject = `Interest in Flutter Developer Position at ${companyName}`;

  const HTML = `<div style="font-family: Arial, sans-serif; text-color: #000000;">
  <p>Dear ${HRName},</p>
  <p>
    I am writing to express my interest in the Flutter Developer position at ${companyName}. 
    With a strong background in Flutter development and a proven track record of building dynamic, 
    high-performance mobile applications, I am excited about the opportunity to contribute my skills 
    and expertise to your team.
  </p>
  <p>
    In my previous projects, I developed <strong>VibeHunt</strong>, a social media app with a Node.js backend 
    and BLoC state management, following the MVVM (Model-View-ViewModel) design pattern for efficient and scalable architecture. 
    The app features Google Sign-In for secure authentication, allows real-time chat using WebSocket, 
    and utilizes the HTTP package for seamless API integration.
  </p>
  <p>
    I am skilled in API integration, state management (BLoC, Provider, GetX), and working with databases like Firebase. 
    I look forward to the opportunity to bring my expertise to your company.
  </p>
  <p>
    Thank you for considering my application.
  </p>
  <p>
    <strong>LinkedIn:</strong> 
    <a href="https://www.linkedin.com/in/mohammed-azharudheen">Mohammed Azharudheen</a>
  </p>
  <p>
    Best regards,<br>
    Mohammed Azharudheen<br>
    <a href="mailto:azharudheenasru@gmail.com">azharudheenasru@gmail.com</a><br>
    9645546514
  </p>
</div>
`;

  const attachments = [
    {
      filename: "resume.pdf",
      path: path.join(__dirname, "resume.pdf"),
      contentType: "application/pdf",
    },
  ];

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AppEmail,
      pass: process.env.AppPassword,
    },
  });

  const mailOptions = {
    from: process.env.AppEmail,
    to: email,
    subject: subject,
    gcc: process.env.AppEmail,
    html: HTML,
    attachments: attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Success: Email sent to ${HRName} (${email}) at ${companyName}.`
    );
  } catch (error) {
    console.error(
      `Error: Failed to send email to ${HRName} (${email}) at ${companyName}. Reason: ${error.message}`
    );
  }
};

fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on("data", (row) => {
    emailData.push(row);
  })
  .on("end", () => {
    emailData.forEach((entry) => {
      const { companyName, email, HRName } = entry;
      if (companyName && email && HRName) {
        sendEmail(email, HRName, companyName);
      } else {
        console.error(`Error: Missing data in entry: ${JSON.stringify(entry)}`);
      }
    });
  });

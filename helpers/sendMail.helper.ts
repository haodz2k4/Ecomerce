import nodemailer from 'nodemailer';

export const sendMessage = (sendTo: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: 'deptroaihao253@gmail.com',
        to: sendTo,
        subject: subject,
        html: text
    };

    transporter.sendMail(mailOptions, (error: Error | null, info: nodemailer.SentMessageInfo) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const nodemailer = require('nodemailer');

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send contact form notification email
const sendContactEmail = async (contact) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Huzaifa Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `New Contact Form Submission - ${contact.projectType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00fff7; border-bottom: 2px solid #00fff7; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Project Type:</strong> ${contact.projectType}</p>
            <p><strong>Submitted:</strong> ${contact.formattedDate}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${contact.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #1976d2;">
              <strong>Quick Actions:</strong><br>
              • Reply directly to: <a href="mailto:${contact.email}">${contact.email}</a><br>
              • View in admin panel<br>
              • Mark as read/replied
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This email was sent from your portfolio contact form.</p>
            <p>IP: ${contact.ipAddress || 'Unknown'} | Time: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent successfully:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('❌ Failed to send contact email:', error);
    throw error;
  }
};

// Send reply email to contact
const sendReplyEmail = async (contact, replyMessage) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Huzaifa Ahmed" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: `Re: Your message about ${contact.projectType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00fff7; border-bottom: 2px solid #00fff7; padding-bottom: 10px;">
            Thank you for your message!
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Hi ${contact.name},</p>
            <p>Thank you for reaching out about your <strong>${contact.projectType}</strong> project. I've received your message and I'm excited to discuss your ideas!</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Your Original Message</h3>
            <p style="line-height: 1.6; color: #555; font-style: italic;">"${contact.message}"</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border: 1px solid #c8e6c9; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">My Response</h3>
            <p style="line-height: 1.6; color: #2e7d32;">${replyMessage}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #fff3e0; border-radius: 8px;">
            <p style="margin: 0; color: #f57c00;">
              <strong>Next Steps:</strong><br>
              • I'll review your project requirements in detail<br>
              • We can schedule a call to discuss further<br>
              • I'll provide a detailed proposal if needed
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <p style="color: #666;">Best regards,<br>
            <strong>Huzaifa Ahmed</strong><br>
            Software Engineer & Full-Stack Developer</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated response to your contact form submission.</p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reply email sent successfully:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('❌ Failed to send reply email:', error);
    throw error;
  }
};

// Send welcome email to new contacts
const sendWelcomeEmail = async (contact) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Huzaifa Ahmed" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00fff7; border-bottom: 2px solid #00fff7; padding-bottom: 10px;">
            Message Received!
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Hi ${contact.name},</p>
            <p>Thank you for reaching out about your <strong>${contact.projectType}</strong> project! I've received your message and I'm looking forward to discussing your ideas.</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
            <ul style="line-height: 1.8; color: #555;">
              <li>I'll review your project requirements within 24 hours</li>
              <li>We can schedule a consultation call to discuss details</li>
              <li>I'll provide a detailed proposal and timeline</li>
              <li>We'll work together to bring your vision to life!</li>
            </ul>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p style="margin: 0; color: #1976d2;">
              <strong>In the meantime:</strong><br>
              • Check out my latest projects on my portfolio<br>
              • Follow me on LinkedIn for industry insights<br>
              • Feel free to ask any questions you might have
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <p style="color: #666;">Best regards,<br>
            <strong>Huzaifa Ahmed</strong><br>
            Software Engineer & Full-Stack Developer</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated confirmation of your contact form submission.</p>
          </div>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw error;
  }
};

module.exports = {
  sendContactEmail,
  sendReplyEmail,
  sendWelcomeEmail
};

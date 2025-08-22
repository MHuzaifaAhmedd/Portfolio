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
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reply from Huzaifa Ahmed</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          
          <!-- Email Container -->
          <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
            
            <!-- Header with Gradient -->
            <div style="background: linear-gradient(135deg, #0a0f1f 0%, #1a2332 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #00fff7, #0099ff); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px; color: white; font-weight: bold;">H</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
                Huzaifa Ahmed
              </h1>
              <p style="color: #00fff7; margin: 10px 0 0; font-size: 16px; font-weight: 500;">
                Software Engineer & Full-Stack Developer
              </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Greeting Section -->
              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 15px; margin-bottom: 25px; border-left: 4px solid #00fff7;">
                <h2 style="color: #0a0f1f; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                  Hi ${contact.name}! 👋
                </h2>
                <p style="color: #495057; margin: 0; font-size: 16px; line-height: 1.6;">
                  Thank you for reaching out about your <strong style="color: #00fff7;">${contact.projectType}</strong> project! 
                  I've received your message and I'm excited to discuss your ideas.
                </p>
              </div>
              
              <!-- Original Message Section -->
              <div style="background: #ffffff; padding: 25px; border: 2px solid #e9ecef; border-radius: 15px; margin-bottom: 25px; position: relative;">
                <div style="position: absolute; top: -12px; left: 25px; background: #ffffff; padding: 0 15px;">
                  <span style="color: #6c757d; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    Your Original Message
                  </span>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #6c757d;">
                  <p style="color: #495057; margin: 0; font-size: 15px; line-height: 1.7; font-style: italic;">
                    "${contact.message}"
                  </p>
                </div>
              </div>
              
              <!-- Reply Section -->
              <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 15px; margin-bottom: 25px; border: 2px solid #4caf50; position: relative;">
                <div style="position: absolute; top: -12px; left: 25px; background: #4caf50; padding: 0 15px; border-radius: 20px;">
                  <span style="color: #ffffff; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                    My Response
                  </span>
                </div>
                <p style="color: #2e7d32; margin: 0; font-size: 16px; line-height: 1.7; font-weight: 500;">
                  ${replyMessage}
                </p>
              </div>
              
              <!-- Next Steps Section -->
              <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 25px; border-radius: 15px; margin-bottom: 25px; border: 2px solid #ff9800;">
                <h3 style="color: #e65100; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
                  🚀 Next Steps
                </h3>
                <ul style="color: #e65100; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li style="margin-bottom: 8px;">I'll review your project requirements in detail</li>
                  <li style="margin-bottom: 8px;">We can schedule a consultation call to discuss further</li>
                  <li style="margin-bottom: 8px;">I'll provide a detailed proposal and timeline</li>
                  <li style="margin-bottom: 0;">We'll work together to bring your vision to life!</li>
                </ul>
              </div>
              
              <!-- Contact Info Section -->
              <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 15px; margin-bottom: 25px; border: 2px solid #2196f3;">
                <h3 style="color: #1565c0; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
                  📞 Let's Connect
                </h3>
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                  <div style="flex: 1; min-width: 200px; margin-bottom: 15px;">
                    <p style="color: #1565c0; margin: 0; font-size: 14px; font-weight: 600;">Email</p>
                    <p style="color: #1976d2; margin: 5px 0 0 0; font-size: 15px;">
                      <a href="mailto:mhuzaifaahmedd@gmail.com" style="color: #1976d2; text-decoration: none; font-weight: 500;">
                        mhuzaifaahmedd@gmail.com
                      </a>
                    </p>
                  </div>
                  <div style="flex: 1; min-width: 200px; margin-bottom: 15px;">
                    <p style="color: #1565c0; margin: 0; font-size: 14px; font-weight: 600;">LinkedIn</p>
                    <p style="color: #1976d2; margin: 5px 0 0 0; font-size: 15px;">
                      <a href="https://www.linkedin.com/in/huzaifa-ahmed-38755b1b7" style="color: #1976d2; text-decoration: none; font-weight: 500;">
                        huzaifa-ahmed
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Signature -->
              <div style="text-align: center; padding: 30px 0; border-top: 2px solid #e9ecef;">
                <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 16px;">
                  Best regards,
                </p>
                <p style="color: #0a0f1f; margin: 0 0 5px 0; font-size: 20px; font-weight: 600;">
                  Huzaifa Ahmed
                </p>
                <p style="color: #00fff7; margin: 0; font-size: 14px; font-weight: 500;">
                  Software Engineer & Full-Stack Developer
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #6c757d; margin: 0; font-size: 12px; line-height: 1.5;">
                This is an automated response to your contact form submission.<br>
                Sent from your portfolio website at <a href="http://localhost:3000" style="color: #00fff7; text-decoration: none;">huzaifa.dev</a>
              </p>
            </div>
            
          </div>
          
        </body>
        </html>
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
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Received - Huzaifa Ahmed</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          
          <!-- Email Container -->
          <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
            
            <!-- Header with Gradient -->
            <div style="background: linear-gradient(135deg, #0a0f1f 0%, #1a2332 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #00fff7, #0099ff); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px; color: white; font-weight: bold;">✓</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
                Message Received!
              </h1>
              <p style="color: #00fff7; margin: 10px 0 0; font-size: 16px; font-weight: 500;">
                Thank you for reaching out
              </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Greeting Section -->
              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 15px; margin-bottom: 25px; border-left: 4px solid #00fff7;">
                <h2 style="color: #0a0f1f; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                  Hi ${contact.name}! 👋
                </h2>
                <p style="color: #495057; margin: 0; font-size: 16px; line-height: 1.6;">
                  Thank you for reaching out about your <strong style="color: #00fff7;">${contact.projectType}</strong> project! 
                  I've received your message and I'm looking forward to discussing your ideas.
                </p>
              </div>
              
              <!-- What Happens Next Section -->
              <div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 25px; border-radius: 15px; margin-bottom: 25px; border: 2px solid #4caf50;">
                <h3 style="color: #2e7d32; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
                  🚀 What Happens Next?
                </h3>
                <ul style="color: #2e7d32; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li style="margin-bottom: 8px;">I'll review your project requirements within 24 hours</li>
                  <li style="margin-bottom: 8px;">We can schedule a consultation call to discuss details</li>
                  <li style="margin-bottom: 8px;">I'll provide a detailed proposal and timeline</li>
                  <li style="margin-bottom: 0;">We'll work together to bring your vision to life!</li>
                </ul>
              </div>
              
              <!-- In The Meantime Section -->
              <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 25px; border-radius: 15px; margin-bottom: 25px; border: 2px solid #2196f3;">
                <h3 style="color: #1565c0; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
                  💡 In The Meantime
                </h3>
                <ul style="color: #1565c0; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li style="margin-bottom: 8px;">Check out my latest projects on my portfolio</li>
                  <li style="margin-bottom: 8px;">Follow me on LinkedIn for industry insights</li>
                  <li style="margin-bottom: 0;">Feel free to ask any questions you might have</li>
                </ul>
              </div>
              
              <!-- Contact Info Section -->
              <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 25px; border-radius: 15px; margin-bottom: 25px; border: 2px solid #ff9800;">
                <h3 style="color: #e65100; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
                  📞 Let's Connect
                </h3>
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                  <div style="flex: 1; min-width: 200px; margin-bottom: 15px;">
                    <p style="color: #e65100; margin: 0; font-size: 14px; font-weight: 600;">Email</p>
                    <p style="color: #f57c00; margin: 5px 0 0 0; font-size: 15px;">
                      <a href="mailto:mhuzaifaahmedd@gmail.com" style="color: #f57c00; text-decoration: none; font-weight: 500;">
                        mhuzaifaahmedd@gmail.com
                      </a>
                    </p>
                  </div>
                  <div style="flex: 1; min-width: 200px; margin-bottom: 15px;">
                    <p style="color: #e65100; margin: 0; font-size: 14px; font-weight: 600;">LinkedIn</p>
                    <p style="color: #f57c00; margin: 5px 0 0 0; font-size: 15px;">
                      <a href="https://www.linkedin.com/in/huzaifa-ahmed-38755b1b7" style="color: #f57c00; text-decoration: none; font-weight: 500;">
                        huzaifa-ahmed
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Signature -->
              <div style="text-align: center; padding: 30px 0; border-top: 2px solid #e9ecef;">
                <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 16px;">
                  Best regards,
                </p>
                <p style="color: #0a0f1f; margin: 0 0 5px 0; font-size: 20px; font-weight: 600;">
                  Huzaifa Ahmed
                </p>
                <p style="color: #00fff7; margin: 0; font-size: 14px; font-weight: 500;">
                  Software Engineer & Full-Stack Developer
                </p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #6c757d; margin: 0; font-size: 12px; line-height: 1.5;">
                This is an automated confirmation of your contact form submission.<br>
                Sent from your portfolio website at <a href="http://localhost:3000" style="color: #00fff7; text-decoration: none;">huzaifa.dev</a>
              </div>
              
            </div>
            
          </div>
          
        </body>
        </html>
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

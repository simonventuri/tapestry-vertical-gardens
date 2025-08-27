import nodemailer from 'nodemailer';
import { submitContact } from '../../lib/database.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, phone, message, projectType, location, budget } = req.body;

    // Validate all required fields
    if (!name || !email || !phone || !message || !projectType || !location || !budget) {
        return res.status(400).json({
            message: 'All fields are required',
            missing: {
                name: !name,
                email: !email,
                phone: !phone,
                message: !message,
                projectType: !projectType,
                location: !location,
                budget: !budget
            }
        });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    try {
        // Save to database first
        await submitContact({
            name,
            email,
            phone,
            message,
            project_type: projectType,
            location,
            budget_range: budget
        });

        // Only send email if email credentials are configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                // Create email transporter
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                    port: process.env.EMAIL_PORT || 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                // Email content
                const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #2d5016; margin-bottom: 20px; font-size: 24px;">New Contact Form Submission</h2>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                        <h3 style="color: #2d5016; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Contact Information</h3>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Name:</strong> ${name}</p>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2d5016;">${email}</a></p>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #2d5016;">${phone}</a></p>
                    </div>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                        <h3 style="color: #2d5016; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Project Details</h3>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Project Type:</strong> ${projectType}</p>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Location:</strong> ${location}</p>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Budget Range:</strong> ${budget}</p>
                    </div>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
                        <h3 style="color: #2d5016; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Message</h3>
                        <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0; color: #6c757d; font-size: 14px; text-align: center;">
                            Submitted from Tapestry Vertical Gardens website<br>
                            ${new Date().toLocaleString('en-GB', {
                    timeZone: 'Europe/London',
                    dateStyle: 'full',
                    timeStyle: 'short'
                })}
                        </p>
                    </div>
                </div>
            </div>
        `;

                const emailText = `
New Contact Form Submission

Contact Information:
Name: ${name}
Email: ${email}
Phone: ${phone}

Project Details:
Project Type: ${projectType}
Location: ${location}
Budget Range: ${budget}

Message:
${message}

Submitted: ${new Date().toLocaleString('en-GB', {
                    timeZone: 'Europe/London',
                    dateStyle: 'full',
                    timeStyle: 'short'
                })}
        `;

                // Send email
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                    to: 'info@tapestryverticalgardens.com',
                    cc: 'simonventuri@gmail.com',
                    subject: `New Enquiry from ${name} - ${projectType}`,
                    text: emailText,
                    html: emailHtml,
                    replyTo: email
                });
            } catch (emailError) {
                console.error('Email sending error:', emailError);
                // Don't fail the entire request if email fails
                // Contact is still saved to database
            }
        } else {
            console.log('Email credentials not configured - skipping email notification');
        }

        res.status(200).json({
            message: 'Contact form submitted successfully',
            success: true
        });

    } catch (error) {
        console.error('Contact form error:', error);

        // More specific error messages
        let errorMessage = 'Sorry, there was a problem processing your enquiry. Please try again.';

        if (error.message && error.message.includes('Redis')) {
            errorMessage = 'Database connection issue. Please try again in a moment.';
        } else if (error.message && error.message.includes('connect')) {
            errorMessage = 'Connection error. Please check your internet connection and try again.';
        }

        res.status(500).json({
            message: errorMessage,
            success: false
        });
    }
}

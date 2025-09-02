import nodemailer from 'nodemailer';
import { submitContact } from '../../lib/database.js';

// Simple rate limiting store (in production, use Redis or a proper store)
const rateLimitStore = new Map();

function rateLimit(ip, limit = 5, windowMs = 15 * 60 * 1000) { // 5 requests per 15 minutes
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, []);
    }

    const requests = rateLimitStore.get(ip).filter(time => time > windowStart);

    if (requests.length >= limit) {
        return false;
    }

    requests.push(now);
    rateLimitStore.set(ip, requests);
    return true;
}

function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Rate limiting
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!rateLimit(clientIp)) {
        return res.status(429).json({
            message: 'Too many requests. Please try again later.',
            retryAfter: 900 // 15 minutes
        });
    }

    const { name, email, phone, message, projectType, location, budget } = req.body;

    // Sanitize inputs
    const sanitizedData = {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        phone: sanitizeInput(phone),
        message: sanitizeInput(message),
        projectType: sanitizeInput(projectType),
        location: sanitizeInput(location),
        budget: sanitizeInput(budget)
    };

    // Validate all required fields
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.phone ||
        !sanitizedData.message || !sanitizedData.projectType || !sanitizedData.location || !sanitizedData.budget) {
        return res.status(400).json({
            message: 'All fields are required',
            missing: {
                name: !sanitizedData.name,
                email: !sanitizedData.email,
                phone: !sanitizedData.phone,
                message: !sanitizedData.message,
                projectType: !sanitizedData.projectType,
                location: !sanitizedData.location,
                budget: !sanitizedData.budget
            }
        });
    }

    // Validate field lengths
    if (sanitizedData.name.length > 100) {
        return res.status(400).json({ message: 'Name must be less than 100 characters' });
    }
    if (sanitizedData.message.length > 2000) {
        return res.status(400).json({ message: 'Message must be less than 2000 characters' });
    }

    // Validate email format
    if (!validateEmail(sanitizedData.email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate phone format
    if (!validatePhone(sanitizedData.phone)) {
        return res.status(400).json({ message: 'Please provide a valid phone number' });
    }

    try {
        // Save to database first
        await submitContact({
            name: sanitizedData.name,
            email: sanitizedData.email,
            phone: sanitizedData.phone,
            message: sanitizedData.message,
            project_type: sanitizedData.projectType,
            location: sanitizedData.location,
            budget_range: sanitizedData.budget
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
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Name:</strong> ${sanitizedData.name}</p>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Email:</strong> <a href="mailto:${sanitizedData.email}" style="color: #2d5016;">${sanitizedData.email}</a></p>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Phone:</strong> <a href="tel:${sanitizedData.phone}" style="color: #2d5016;">${sanitizedData.phone}</a></p>
                    </div>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                        <h3 style="color: #2d5016; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Project Details</h3>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Project Type:</strong> ${sanitizedData.projectType}</p>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Location:</strong> ${sanitizedData.location}</p>
                        <p style="margin: 8px 0; line-height: 1.5;"><strong>Budget Range:</strong> ${sanitizedData.budget}</p>
                    </div>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
                        <h3 style="color: #2d5016; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Message</h3>
                        <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${sanitizedData.message}</p>
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
Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone}

Project Details:
Project Type: ${sanitizedData.projectType}
Location: ${sanitizedData.location}
Budget Range: ${sanitizedData.budget}

Message:
${sanitizedData.message}

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
                    subject: `New Enquiry from ${sanitizedData.name} - ${sanitizedData.projectType}`,
                    text: emailText,
                    html: emailHtml,
                    replyTo: sanitizedData.email
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

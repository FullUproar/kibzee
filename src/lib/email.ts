import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

interface EmailOptions {
  to: string
  subject: string
  template: string
  data: any
}

export async function sendEmail({ to, subject, template, data }: EmailOptions) {
  try {
    const html = await getEmailTemplate(template, data)

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Kibzee" <noreply@kibzee.com>',
      to,
      subject,
      html,
    })

    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

async function getEmailTemplate(template: string, data: any): Promise<string> {
  const templates: Record<string, (data: any) => string> = {
    'welcome': (data) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7d8471; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #7d8471; color: white; text-decoration: none; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Kibzee!</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.name},</h2>
              <p>Welcome to Kibzee, your guide to local arts and culture in Michiana.</p>
              <p>To get started, please verify your email address:</p>
              <p style="text-align: center;">
                <a href="${data.verificationUrl}" class="button">Verify Email</a>
              </p>
              <p>Once verified, you can:</p>
              <ul>
                <li>Browse upcoming concerts, theater, and gallery openings</li>
                <li>Chat with our AI concierge for personalized recommendations</li>
                <li>Save events and get notified about what matters to you</li>
              </ul>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kibzee. Made with love in South Bend.</p>
            </div>
          </div>
        </body>
      </html>
    `,

    'event-reminder': (data) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d4a574; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .event-card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #7d8471; }
            .button { display: inline-block; padding: 12px 24px; background: #7d8471; color: white; text-decoration: none; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Event Reminder</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.name},</h2>
              <p>This is a friendly reminder about an event you saved!</p>
              <div class="event-card">
                <h3>${data.eventTitle}</h3>
                <p><strong>Date:</strong> ${data.eventDate}</p>
                <p><strong>Time:</strong> ${data.eventTime}</p>
                <p><strong>Venue:</strong> ${data.venueName}</p>
                <p><strong>Address:</strong> ${data.venueAddress}</p>
              </div>
              <p style="text-align: center;">
                <a href="${data.eventUrl}" class="button">View Event Details</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kibzee. Made with love in South Bend.</p>
            </div>
          </div>
        </body>
      </html>
    `,

    'new-event-match': (data) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7d8471; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .event-card { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #c97d60; }
            .curated-pick { background: #c97d60; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #7d8471; color: white; text-decoration: none; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Event You'll Love!</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.name},</h2>
              <p>Based on your preferences, we think you'll enjoy this event:</p>
              <div class="event-card">
                ${data.isCuratedPick ? '<span class="curated-pick">Curated Pick</span>' : ''}
                <h3>${data.eventTitle}</h3>
                <p>${data.eventDescription}</p>
                <p><strong>Date:</strong> ${data.eventDate}</p>
                <p><strong>Venue:</strong> ${data.venueName}</p>
                ${data.curatorNote ? `<p><em>"${data.curatorNote}" - ${data.curatorName}</em></p>` : ''}
              </div>
              <p style="text-align: center;">
                <a href="${data.eventUrl}" class="button">View Event</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kibzee. Made with love in South Bend.</p>
            </div>
          </div>
        </body>
      </html>
    `,

    'weekly-digest': (data) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7d8471; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .event-list { list-style: none; padding: 0; }
            .event-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
            .event-item h4 { margin: 0 0 5px 0; color: #333; }
            .event-item p { margin: 0; color: #666; font-size: 14px; }
            .category-tag { display: inline-block; padding: 2px 8px; background: #e0e4db; border-radius: 4px; font-size: 12px; color: #7d8471; }
            .button { display: inline-block; padding: 12px 24px; background: #7d8471; color: white; text-decoration: none; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>This Week in Michiana</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.name},</h2>
              <p>Here's what's happening this week:</p>
              <ul class="event-list">
                ${data.events.map((event: any) => `
                  <li class="event-item">
                    <span class="category-tag">${event.category}</span>
                    <h4>${event.title}</h4>
                    <p>${event.date} at ${event.venue}</p>
                  </li>
                `).join('')}
              </ul>
              <p style="text-align: center;">
                <a href="${data.eventsUrl}" class="button">See All Events</a>
              </p>
            </div>
            <div class="footer">
              <p>Don't want to receive these emails? <a href="${data.unsubscribeUrl}">Update preferences</a></p>
              <p>&copy; ${new Date().getFullYear()} Kibzee. Made with love in South Bend.</p>
            </div>
          </div>
        </body>
      </html>
    `,

    'curator-approved': (data) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #c97d60; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #7d8471; color: white; text-decoration: none; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're Now a Curator!</h1>
            </div>
            <div class="content">
              <h2>Congratulations ${data.name}!</h2>
              <p>Your curator application has been approved. Welcome to the Kibzee curator team!</p>
              <p>As a curator, you can:</p>
              <ul>
                <li>Submit events to the Kibzee calendar</li>
                <li>Add your personal recommendations</li>
                <li>Mark events as "Curated Picks"</li>
                <li>Help build Michiana's arts community</li>
              </ul>
              <p style="text-align: center;">
                <a href="${data.curatorDashboardUrl}" class="button">Start Curating</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kibzee. Made with love in South Bend.</p>
            </div>
          </div>
        </body>
      </html>
    `,

    'password-reset': (data) => `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7d8471; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #7d8471; color: white; text-decoration: none; border-radius: 4px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <h2>Hi ${data.name},</h2>
              <p>We received a request to reset your password. Click the button below to choose a new one:</p>
              <p style="text-align: center;">
                <a href="${data.resetUrl}" class="button">Reset Password</a>
              </p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kibzee. Made with love in South Bend.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  const templateFunction = templates[template]
  if (!templateFunction) {
    throw new Error(`Email template '${template}' not found`)
  }

  return templateFunction(data)
}

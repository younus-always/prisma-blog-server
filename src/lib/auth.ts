import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
      auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
      },
});

export const auth = betterAuth({
      database: prismaAdapter(prisma, {
            provider: "postgresql", // or "mysql", "postgresql", ...etc
      }),
      trustedOrigins: [process.env.APP_URL!],
      user: {
            additionalFields: {
                  role: {
                        type: "string",
                        defaultValue: "USER",
                        required: false
                  },
                  phone: {
                        type: "string",
                        required: false
                  },
                  status: {
                        type: "string",
                        defaultValue: "ACTIVE",
                        required: false
                  }
            }
      },
      emailAndPassword: {
            enabled: true,
            autoSignIn: true,
            requireEmailVerification: true
      },
      emailVerification: {
            sendOnSignUp: true,
            autoSignInAfterVerification: true,
            sendVerificationEmail: async ({ user, url, token }, request) => {
                  try {
                        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

                        const info = await transporter.sendMail({
                              from: '"Prisma Blog Team" <prismablog@gmail.com>',
                              to: user.email,
                              subject: "Verify your Prisma Blog email",
                              text: `Welcome to Prisma Blog!

Please verify your email address by visiting this link:
${verificationUrl}

This verification link will expire soon.

If you did not create an account, you can safely ignore this email.`,
                              html: `
      <!DOCTYPE html>
      <html lang="en">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verify your email</title>
            </head>

            <body
            style="
            margin: 0;
            padding: 0;
            background-color: #f4f7fb;
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
            "
            >
            <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="background-color: #f4f7fb; padding: 40px 15px;"
            >
            <tr>
                  <td align="center">

                  <!-- Main Container -->
                  <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                        max-width: 600px;
                        background-color: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                  "
                  >

                  <!-- Header -->
                  <tr>
                        <td
                        align="center"
                        style="
                        background-color: #2563eb;
                        padding: 30px 20px;
                        "
                        >
                        <h1
                        style="
                              margin: 0;
                              color: #ffffff;
                              font-size: 28px;
                              font-weight: 700;
                        "
                        >
                        Prisma Blog
                        </h1>

                        <p
                        style="
                              margin: 8px 0 0;
                              color: #dbeafe;
                              font-size: 14px;
                        "
                        >
                        Welcome to the community
                        </p>
                        </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                        <td style="padding: 40px 35px;">

                        <h2
                        style="
                              margin: 0 0 20px;
                              color: #111827;
                              font-size: 24px;
                        "
                        >
                        Verify your email address
                        </h2>

                        <p
                        style="
                              margin: 0 0 14px;
                              font-size: 14px;
                              color: #292d31
                        "
                        >
                        Hello ${user.name}
                        </p>

                        <p
                        style="
                              margin: 0 0 16px;
                              font-size: 16px;
                              line-height: 1.7;
                              color: #4b5563;
                        "
                        >
                        Thanks for creating an account with
                        <strong>Prisma Blog</strong>.
                        Please verify your email address to activate your
                        account and get started.
                        </p>

                        <!-- Button -->
                        <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="margin: 30px auto;"
                        >
                        <tr>
                              <td
                              align="center"
                              style="
                              border-radius: 8px;
                              background-color: #2563eb;
                              "
                              >
                              <a
                              href="${verificationUrl}"
                              target="_blank"
                              style="
                                    display: inline-block;
                                    padding: 14px 28px;
                                    font-size: 16px;
                                    font-weight: 600;
                                    color: #ffffff;
                                    text-decoration: none;
                                    border-radius: 8px;
                              "
                              >
                              Verify My Email
                              </a>
                              </td>
                        </tr>
                        </table>

                        <p
                        style="
                              margin: 0 0 12px;
                              font-size: 14px;
                              line-height: 1.6;
                              color: #6b7280;
                        "
                        >
                        If the button above doesn't work, copy and paste the
                        following link into your browser:
                        </p>

                        <p
                        style="
                              margin: 0 0 25px;
                              padding: 12px;
                              background-color: #f3f4f6;
                              border-radius: 6px;
                              word-break: break-all;
                              font-size: 13px;
                              line-height: 1.5;
                              color: #2563eb;
                        "
                        >
                        ${verificationUrl}
                        </p>

                        <div
                        style="
                              border-top: 1px solid #e5e7eb;
                              margin: 25px 0;
                        "
                        ></div>

                        <p
                        style="
                              margin: 0;
                              font-size: 13px;
                              line-height: 1.6;
                              color: #6b7280;
                        "
                        >
                        For your security, this verification link will expire
                        after a limited time.
                        </p>

                        <p
                        style="
                              margin: 15px 0 0;
                              font-size: 13px;
                              line-height: 1.6;
                              color: #6b7280;
                        "
                        >
                        If you did not create a Prisma Blog account, you can
                        safely ignore this email.
                        </p>
                        </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                        <td
                        align="center"
                        style="
                        background-color: #f9fafb;
                        padding: 24px 20px;
                        border-top: 1px solid #e5e7eb;
                        "
                        >
                        <p
                        style="
                              margin: 0;
                              font-size: 12px;
                              color: #9ca3af;
                        "
                        >
                        © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
                        </p>

                        <p
                        style="
                              margin: 8px 0 0;
                              font-size: 12px;
                              color: #9ca3af;
                        "
                        >
                        This is an automated email. Please do not reply.
                        </p>
                        </td>
                  </tr>

                  </table>
                  </td>
            </tr>
            </table>
            </body>
      </html>
      `,
                        });

                        console.log("Message sent: %s", info.messageId);
                  } catch (err) {
                        console.log(`Verification failed: ${err}`);
                        throw err;
                  }
            },
      },
      socialProviders: {
            google: {
                  prompt: "select_account consent",
                  accessType: "offline",
                  clientId: process.env.GOOGLE_CLIENT_ID as string,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            },
      },
});
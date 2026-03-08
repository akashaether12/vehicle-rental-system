const nodemailer = require("nodemailer");
const config = require("../config/env");

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (config.smtpHost && config.smtpUser && config.smtpPass) {
    transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
    return transporter;
  }

  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: "unix",
    buffer: true,
  });
  return transporter;
};

const sendBookingConfirmationEmail = async ({ user, booking, vehicle, payment }) => {
  const mailer = getTransporter();
  const subject = `Booking Confirmed - ${vehicle.brand} ${vehicle.model}`;
  const text = [
    `Hi ${user.firstName},`,
    "",
    `Your booking is confirmed.`,
    `Vehicle: ${vehicle.brand} ${vehicle.model}`,
    `Dates: ${booking.startDate.toISOString().slice(0, 10)} to ${booking.endDate.toISOString().slice(0, 10)}`,
    `Total: INR ${booking.totalPrice}`,
    `Payment Ref: ${payment.transactionId}`,
    "",
    "Thank you for choosing us.",
  ].join("\n");

  const info = await mailer.sendMail({
    from: config.smtpFrom,
    to: user.email,
    subject,
    text,
  });

  if (info.message) {
    console.log("Simulated booking confirmation email:");
    console.log(info.message.toString());
  }
};

const sendBookingCancellationEmail = async ({ user, booking, vehicle }) => {
  const mailer = getTransporter();
  const subject = `Booking Canceled - ${vehicle.brand} ${vehicle.model}`;
  const text = [
    `Hi ${user.firstName},`,
    "",
    `Your booking has been canceled.`,
    `Vehicle: ${vehicle.brand} ${vehicle.model}`,
    `Dates: ${booking.startDate.toISOString().slice(0, 10)} to ${booking.endDate.toISOString().slice(0, 10)}`,
    "",
    "If this was a mistake, please create a new booking.",
  ].join("\n");

  const info = await mailer.sendMail({
    from: config.smtpFrom,
    to: user.email,
    subject,
    text,
  });

  if (info.message) {
    console.log("Simulated booking cancellation email:");
    console.log(info.message.toString());
  }
};

module.exports = { sendBookingConfirmationEmail, sendBookingCancellationEmail };

import { sendMail } from "@/lib/email/send";

const SITE_NAME = "Light for Immigrants";

export async function notifyInquiryReceived(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
}) {
  const name = `${data.firstName} ${data.lastName}`.trim();
  const lines = [
    `New contact inquiry on ${SITE_NAME}`,
    "",
    `Name: ${name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    `Topic: ${data.topic}`,
    "",
    "Message:",
    data.message,
  ].filter(Boolean);

  return sendMail({
    subject: `[Contact] ${data.topic} — ${name}`,
    text: lines.join("\n"),
    replyTo: data.email,
  });
}

export async function notifyBookingReceived(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  serviceName?: string;
  preferredDate?: string;
  preferredTime?: string;
  attendees?: number;
  notes?: string;
}) {
  const name = `${data.firstName} ${data.lastName}`.trim();
  const lines = [
    `New booking request on ${SITE_NAME}`,
    "",
    `Name: ${name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.serviceName ? `Service: ${data.serviceName}` : null,
    data.preferredDate ? `Preferred date: ${data.preferredDate}` : null,
    data.preferredTime ? `Preferred time: ${data.preferredTime}` : null,
    data.attendees ? `Attendees: ${data.attendees}` : null,
    data.notes ? `\nNotes:\n${data.notes}` : null,
  ].filter(Boolean);

  return sendMail({
    subject: `[Booking] ${data.serviceName ?? "General request"} — ${name}`,
    text: lines.join("\n"),
    replyTo: data.email,
  });
}

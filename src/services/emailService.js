// src/services/emailService.js
import axios from 'axios';

const EMAIL_API_URL = 'https://localhost/sendEmailHttp';

export async function sendEmail({ to, subject, text, html }) {
  return axios.post(EMAIL_API_URL, { to, subject, text, html });
}

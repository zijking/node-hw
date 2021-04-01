const Mailgen = require('mailgen');
const sgMail = require('@sendgrid/mail');

const config = require('../config/email.json');

require('dotenv').config();

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = config.dev;
        break;
      case 'stage':
        this.link = config.stage;
        break;
      case 'production':
        this.link = config.prod;
        break;
      default:
        this.link = config.dev;
        break;
    }
  }
  #createTemplate(verifyToken, name = 'Користувач') {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'neopolitan',
      product: {
        name: 'System ZijKing',
        link: this.link,
      },
    });
    const template = {
      body: {
        name,
        intro: 'Вітання в нашому сервісі :)',
        action: {
          instructions: 'Щоб закінчити реєстрацію клікніть на кнопку',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Дайте підтвердження совго e-mail',
            link: `${this.link}/api/auth/verify/${verifyToken}`,
          },
        },
        outro:
          'Потрібна допомога? Напишіть нам у відповідь, ми завжди готові вам допомогти :)',
      },
    };
    return mailGenerator.generate(template);
  }
  async sendEmail(verifyToken, email, name) {
    const emailBody = this.#createTemplate(verifyToken, name);
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'no-reply@system-zijking.com', // Use the email address or domain you verified above
      subject: 'Підтвердіть реєстрацію',
      html: emailBody,
    };
    //ES6
    await this.#sender.send(msg);
  }
}

module.exports = EmailService;

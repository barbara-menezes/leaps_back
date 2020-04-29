// import nodemailer from 'nodemailer';
// import {
//   resolve
// } from 'path';
// import exphbs from 'express-handlebars';
// import nodemailerhbs from 'nodemailer-express-handlebars';
// import mailConfig from './mail';

import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const {
      host,
      port,
      secure,
      auth
    } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    }).then(message => {
      console.log(message);
    }).catch(err => {
      console.log(err);
    });
  }
}

export default new Mail();

// class Mail {
//   constructor() {
//     const {
//       host,
//       port,
//       secure,
//       auth
//     } = mailConfig;

//     this.transporter = nodemailer.createTransport({
//       host,
//       port,
//       secure,
//       auth: auth.user ? auth : null,
//       tls: {
//         rejectUnauthorized: false
//       },
//       ssl: {
//         rejectUnauthorized: false
//       },
//     });

//     this.configureTemplates();
//   }

//   configureTemplates() {
//     const viewPath = resolve(__dirname, '..', 'app', 'views');


//     this.transporter.use(
//       'compile',
//       nodemailerhbs({
//         viewEngine: exphbs.create({
//           layoutsDir: resolve('./src/app/views/auth/'),
//           partialsDir: resolve('./src/app/views/auth/'),
//           defaultLayout: undefined,
//           extname: '.html',
//         }),
//         viewPath,
//         extName: '.html',
//       })
//     );
//   }

//   sendMail(message) {
//     return this.transporter.sendMail({
//       ...message,
//     });
//   }

// }

// export default new Mail();
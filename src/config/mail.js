require('dotenv').config();
export default {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: '',
    pass: '',
  },
  default: {
    from: 'Equipe LEAPS <email@gmail.com>',
  },
};
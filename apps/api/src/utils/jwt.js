import jwt from 'jsonwebtoken';

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'secret_fallback_do_not_use_in_prod', {
    expiresIn: '7d',
  });
};

export { generateToken };

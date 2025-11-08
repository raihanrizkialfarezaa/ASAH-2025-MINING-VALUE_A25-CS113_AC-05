import bcrypt from 'bcrypt';
import config from '../config/env.js';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.bcrypt.rounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

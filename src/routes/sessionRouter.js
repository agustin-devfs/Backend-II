import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// Ruta para el login y generación del JWT
router.post('/login', (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(401).json({ status: 'error', message: info.message || 'Login fallido' });
      }
      // Iniciar sesión sin usar session ya que usamos JWT
      req.login(user, { session: false }, (error) => {
        if (error) return next(error);
        const payload = { id: user._id, email: user.email, role: user.role };
        const token = jwt.sign(payload, 'tu_secret_jwt', { expiresIn: '1h' });
        return res.json({ status: 'success', message: 'Login exitoso', token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// Ruta protegida para obtener el usuario autenticado
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ status: 'success', payload: req.user });
});

export default router;

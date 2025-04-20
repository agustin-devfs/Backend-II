import { Router } from 'express';
import userModel from '../models/userModel.js';

const router = Router();

// Consultar todos los usuarios
router.get('/', async (req, res) => {
    try {
        const result = await userModel.find();
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

// Crear un usuario
router.post('/', async (req, res) => {
    const { first_name, last_name, age, email, password, cart, role } = req.body;
    try {
        const newUser = await userModel.create({ first_name, last_name, age, email, password, cart, role });
        res.status(201).send({ status: 'success', payload: newUser });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

// Actualizar un usuario
router.put('/:uid', async (req, res) => {
    const uid = req.params.uid;
    const { first_name, last_name, age, email, password, cart, role } = req.body;

    try {
        const user = await userModel.findById(uid);
        if (!user) return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });

        // Actualizar sólo los campos que vengan del body
        user.first_name = first_name ?? user.first_name;
        user.last_name  = last_name ?? user.last_name;
        user.age        = age ?? user.age;
        user.email      = email ?? user.email;
        user.password   = password ?? user.password;
        user.cart       = cart ?? user.cart;
        user.role       = role ?? user.role;

        await user.save();

        res.status(200).send({ status: 'success', payload: user });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

// Eliminar un usuario
router.delete('/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
        const result = await userModel.deleteOne({ _id: uid });
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', message: error.message });
    }
});

export default router;

const express = require('express');
const Room = require('../models/Room');
const Device = require('../models/Device');
const auth = require('../middlewares/auth');

const router = express.Router();

// get all
router.get('/', auth(['customer', 'admin']), async (req, res) => {
    try {
        const result = await Room.find().sort({
            field: 'asc',
            _id: -1
        });
        return res.json({code: 200, rooms: result});
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: err.message
        });
    }
});

// get device in room
router.get('/:id', getDeviceInRoom, (req, res) => {
    res.status(200).json({code: 200, device: req.device});
});

//Updating one
// router.patch('/:id', getDevice, async (req, res) => {
//     if (req.body.status != null) {
//         req.device.status = req.body.status;
//     }

//     try {
//         const updatedDevice = await req.device.save();
//         res.json(updatedDevice);
//     } catch (err) {
//         res.status(400).json({
//             message: err.message
//         });
//     }
// });

//Middleware to findById Room
async function getDeviceInRoom(req, res, next) {
    let device;
    try {
        device = await Device.find({
            room_id: req.params.id
        });

        if (device == null) {
            return res.status(404).json({
                code: 404,
                message: 'Cannot find device'
            });
        }
    } catch (err) {
        return res.status(500).json({
            code: 500,
            message: err.message
        });
    }
    req.device = device;
    next();
}

module.exports = router;
const jwt = require("jsonwebtoken")
const { expressjwt } = require('express-jwt');

exports.login = async (req, res) => {
    try {
        // ข้อมูล username, password
        const { username, password } = req.body

        if (password === process.env.PASSWORD) {
            //longin
            // create token
            const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1d" })
            return res.json({ token, username })
        } else {
            return res.status(400).json({ error: 'รหัสผ่านไม่ถูกต้อง' })
        }

    } catch (error) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

// ตรวจสอบ token
exports.requireLogin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
});

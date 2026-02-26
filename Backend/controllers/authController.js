const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/schema/admin.js");
const User = require("../model/schema/user.js");
const sendEmail = require("../utils/email");

exports.signup = async (req, res) => {
    const { name, email, password, role, departmentId } = req.body;

    if (!name || !email || !password || !role || !departmentId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!["student", "professor"].includes(role)) {
        return res.status(400).json({ message: "Role must be student or professor" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            department: departmentId,
            approved: false
        });

        return res.status(201).json({
            message: "Account created successfully. Please wait for admin approval before logging in."
        });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Server error during signup" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // 1) Check admin table
        let user = await Admin.findOne({ email });
        let role = "admin";

        // 2) If not admin, check User table
        if (!user) {
            user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid email or password" });
            }
            role = user.role;

            // 3) Check if user is approved
            if (!user.approved) {
                return res.status(403).json({ message: "Your account is pending admin approval" });
            }
        }

        // Password validation
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // JWT
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name || "Admin",
                role: user.role || "admin",
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({
            message: "Login successful",
            role,
            name: user.name || "Admin"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error during login" });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.json({ message: "Logout successful" });
};

exports.verifyToken = (req, res) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({
            authenticated: true,
            role: decoded.role,
            name: decoded.name
        });
    } catch (err) {
        return res.status(401).json({ authenticated: false });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // For security, don't reveal if email doesn't exist. 
            // Better to say "If an account exists, a reset link was sent"
            return res.status(200).json({
                message: "If an account exists with this email, a reset link has been sent."
            });
        }

        // 1) Generate the random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // 2) Hash it and save to DB
        user.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

        await user.save();

        // 3) Send it to user's email
        // For a local dev environment, we use the frontend URL
        const resetURL = `${process.env.CLIENT_ORIGIN}/reset-password/${resetToken}`;
        const message = `Forgot your password? Click the link below to reset it:\n\n${resetURL}\n\nThis link is valid for 1 hour. If you didn't forget your password, please ignore this email.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'UniPortal Password Reset',
                message
            });

            res.status(200).json({
                message: 'Reset link sent to email!'
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            return res.status(500).json({ message: 'Error sending email. Please try again later.' });
        }
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // 1) Hash the incoming token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // 2) Find user with the token and expiry check
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        }).select("+password"); // Need to select old password if we want to compare, but here we just replace

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or has expired" });
        }

        // 3) Set new password
        user.password = await bcrypt.hash(password, 10);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({
            message: "Password reset successful. You can now log in with your new password."
        });
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

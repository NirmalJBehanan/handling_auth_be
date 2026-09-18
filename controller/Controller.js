import { User } from "../schema/userRegister.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { sendForgetMail } from "../services/mail.service.js";

export const register = async (req, res) => {
    try {
        console.log("Controller reached");
        console.log(req.body);

        const { name, email, password } = req.body;

        const checkEmail = await User.findOne({ email })
        if (checkEmail) {
            return res.status(400).json({
                status: false,
                data: req.body,
                message: "already exist account"
            });
        }
        const hashpassword = await bcrypt.hash(password, 10);

        const table = await User.create({
            name,
            email,
            password: hashpassword
        });

        res.status(200).json({
            status: true,
            data: table
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: false,
            message: "Registration failed",
            error: error.message
        });
    }
};

// login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                status: false,
                data: req.body,
                message: "incorrect email or password"
            });
        }

        const verifyPassword = await bcrypt.compare(password, user.password)
        if (!verifyPassword) {
            return res.status(400).json({
                status: false,
                data: req.body,
                message: "incorrect email or password"
            });
        }
        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        res.status(200).json({
            status: true,
            message: "login successfull",
            token
        });


    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: false,
            message: "login failed",
            error: error.message
        });
    }

}

export const forgetpassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User not found"
            });
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10m"
            }
        );

        sendForgetMail(user.email, token);

        return res.status(200).json({
            status: true,
            message: "Password reset link sent to your email"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

//verify token withot middleware

// export const verifyTokens = async (req, res) => {
//     const token = req.headers.authorization.split(" ")[1];
//     console.log(token);
//     try {
//         if (!token) {
//             return res.status(400).json({
//                 message: "token is missing"
//             })
//         }

//         const decode = jwt.verify(token, process.env.JWT_SECRET)
//         console.log(decode);
//         const user = await User.findById(decode._id)
//         if (!user) {
//             return res.status(400).json({
//                 message: "user is not found"
//             })
//         }
//         return res.status(200).json({
//             message: "token verified successfully"
//         })
//     } catch (error) {
//         res.status(500).json({
//             error: error.message
//         })
//     }

// }



//  verification using midddleware
export const verifyTokens = async (req, res) => {
    return res.status(200).json({
        message: "token verified successfully"
    })
}

// resetpassword without middleware
// export const resetpassword = async (req, res) => {
//     const { password } = req.body
//     const token = req.headers.authorization.split(" ")[1];
//     console.log(password);
//     try {
//         if (!token) {
//             return res.status(400).json({
//                 message: "token is missing"
//             })
//         }
//         const decode = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await User.findById(decode._id)
//         if (!user) {
//             return res.status(400).json({
//                 message: "user is not found"
//             })
//         }
//         const hashpassword = await bcrypt.hash(password, 10);
//         user.password = hashpassword;
//         await user.save();

//         return res.status(200).json({
//             message: "password successfully changed"
//         })



//     } catch (error) {
//         res.status(500).json({
//             error: error.message
//         })
//     }
// }


// resetpassword with middleware
export const resetpassword = async (req, res) => {
    try {
        const { password } = req.body
        const hashpassword = await bcrypt.hash(password, 10);
        req.user.password = hashpassword;
        await req.user.save();

        return res.status(200).json({
            message: "password successfully changed"
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

export const profile = async (req, res) => {

    try {
        const { name, email } = req.user
        return res.status(200).json({
            data:{name,email}
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
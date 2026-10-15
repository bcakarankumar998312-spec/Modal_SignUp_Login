import bcrypt from "bcrypt";
import User from "./models/User.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
const app = express();
const port = process.env.PORT || 3000;


dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(()=> {
        console.log("MongoDB Atlas connected successfully!");
    })
    .catch((error) =>{
        console.log("MongoDB connection error:", error.message);
    });
    
//Allow requests from your frontend
app.use(cors({
  origin: 'https://modalsignuplogin-frontend.vercel.app',
  credentials: true
}));

//Allow Express to read JSON request bodies
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }
}));

//Test route
app.get("/", (req, res)=>{
    res.send("This is modal/popup trial web App");
});

//Signup route
app.post("/signup", async (req,res)=> {
    try{
    
    const {name, email, password} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    await newUser.save();
    
    res.status(201).json({
        success: true,
        message: "Signup data recieved successfully!"
    });
} catch (error){
    console.error("Signup error:", error.message);

    res.status(500).json({
        success: false,
        message: "Unable to create account."
    });
}
});


//Login route
app.post("/login", async (req, res) => {
    try{
        const{email, password} = req.body;

        //Find the user by email
        const user = await User.findOne({email});

        //Check whether the user exists
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        //Compare the entered password with the stored hash
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        //Reject an incorrect password
        if(!isPasswordCorrect){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        //Login credentials are correct
        req.session.userId = user._id;
       
        if(error){
            console.error("Session save error:", error.message);
            return res.status(500).json({
                success: false,
                message: "Unable to save login session."
            });
        }

        res.status(200).json({
            success:true,
            message: "Login successfully",
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch(error){
        console.error("Login error: ", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

app.get("/me", async(req,res)=>{
    res.set("Cache-Control", "no-store");
    try {
        if(!req.session.userId){
            return res.status(401).json({
                success: false, 
                message: "Not logged in."
            });
        }

        const user = await User.findById(req.session.userId);

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error){
        console.error("Session check error:",error.message);

        res.status(500).json({
            success: false,
            message: "Something went wrong."
        });
    }
});

//Express Logout Route

app.post("/logout", (req, res)=> {
    req.session.destroy((error) =>{
        if(error){
            console.error("Logout error:",error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to log out."
            });
        }

        res.clearCookie("connect.sid", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful!"
        })
    })
})


app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
});


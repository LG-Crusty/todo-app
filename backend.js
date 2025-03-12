import express from 'express';
const app = express()
app.use(express.json())

import mongoose from 'mongoose';
(async () => {
    const connected = await mongoose.connect("mongodb://127.0.0.1:27017/todoapp")
    if (connected) {
        console.log("db is connected")

    }
})();

import { UserModel, TodoModel } from "./dbase.js";

import jwt from 'jsonwebtoken'
const JWT_SECRET = "29#RandomUserOne39@"

import { z } from "zod";
import bcrypt from "bcrypt";



import cors from 'cors';
app.use(cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}
));

app.use(cors());

// app.get();

function validation(req, res, next) {

    // const username = req.body.username
    // const password = req.body.password
    // const email = req.body.email

    const auth = z.object({
        username: z.string().max(50, { message: "must be less then 50 charcters" }),
        password: z.string().min(4, { message: "min password length 4 character" }).max(25, { message: "max password length is 25 characters" }),
        email: z.string().email().includes("@")
    }
    )
    const impAuth = auth.safeParse(req.body)
    if (!impAuth.success) {
        res.json({
            message: "Invalid Credentials",
            error: impAuth.error
        })
    } else {
        next()
    }
}



app.post("/signup", validation, async function (req, res) {
    try {
        const username = req.body.username
        const email = req.body.email
        const recievedPassword = req.body.password
        //   hash the password first and then send
        const securedPassword = await bcrypt.hash(recievedPassword, 8)

        // append this data to the database
        await UserModel.create({
            "username": username,
            "email": email,
            "password": securedPassword
        }
        );

        res.json({
            done: "you are successfully signed up"

        })

    } catch (error) {
        res.status(500).json({
            message: "invalid credentials"
        })
    }


});

app.post("/login", async (req, res) => {

    try {
        const username = req.body.username;
        const password = req.body.password;

        const neededUser = await UserModel.findOne(
            {
                username: username
            }
        )
        //  verify password using bcrypt/other compare 
        let passwordMatch = bcrypt.compare(password, neededUser.password)
        if (passwordMatch) {
            // create jwt token and send it
            const token = jwt.sign(neededUser._id.toString(),
                JWT_SECRET
            )

            res.status(200).json({
                done: "you are sucessfully login",
                token

            })
        }

    } catch (error) {
        res.status(403).json(
            {
                message: "invalid password"
            }, { error }
        )
    }


}
)

function tokenChecker(req, res, next) {

    //  console.log("Request Headers:", req.headers)

    const OreqToken = req.headers["authorization"]
    // console.log("Authorization Header:", req.headers["authorization"]);

    if (!OreqToken) {
        res.json({
            message: "Invalid token"
        })

    }
    const reqToken = OreqToken.split(" ")[1];

    const checked = jwt.verify(reqToken, JWT_SECRET)
    if (checked) {
        req.user = checked;
        next();
    }
    else {
        res.json({
            message: "wrong token"
        })
    }
}

app.use(tokenChecker);

app.post("/todo_me",

    async (req, res) => {
        const buddy = req.user
        const toDo = req.body.todo
        // console.log(toDo)

        await TodoModel.create(
            {
                task: toDo,
                done: true,
                userId: buddy._id
            }
        )
        const dbtodo = await TodoModel.find(
            {
                userId: buddy._id,
                task: toDo
            }
        )
        if (dbtodo) {
            // console.log(dbtodo[0].task)

            res.json({
                done: "task is created",
                todo: dbtodo[0].task
            }
            )
        }

    })


app.put("/update", async (req, res) => {
    const buddy = req.user
    const task = req.body.task


    //   get the task and delete it from database
    const removedTask = await TodoModel.findOneAndDelete({
        userid: buddy._id,
        task: task

    })
    if (removedTask) {
        res.json(
            {
                message: "task is updated ",
                task: task

            }

        )
    } else {
        res.json(
            {
                message: "task not found"
            }
        )
    }
});


app.delete("/delete", async (req, res) => {
    const buddy = req.user
    const task = req.body.task;

    const removed = await TodoModel.findOneAndDelete({
        userid: buddy._id,
        task: task
    }
    )
       if (removed) {
        res.json({
            message: "successfully deleted "
        })
       }
});

app.listen(3000,
    console.log("app is listening on the port 3000"))


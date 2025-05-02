import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/mynewdatabase")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB", error));

/*----- Define User Schema -----*/

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const user = mongoose.model("user", userSchema);

/*----- GET - Read all users -----*/

app.get("/users", async (req, res) => {
  try {
    const users = await user.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/*----- POST - Create a new user -----*/

app.post("/users", async (req, res) => {
  try {
    const newUser = new user(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

/*----- PUT - Update a user -----*/

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedUser = await user.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

/*----- DELETE - Remove user by ID -----*/

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await user.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json({ message: "user deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.listen(3000, () =>
  console.log("Server is running at http://localhost:3000")
);

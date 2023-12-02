const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const app = express();
const port = 3000;
const cors = require("cors"); // Importez le module cors
app.use(express.json());
const authenticate = require("./middelware/authenticate"); // Correct the filename

const User = require("./models/User"); // Correct the variable name to User

const Product = require("./models/Products"); // Correct the variable name to User
const Panier = require("./models/Panier"); // Correct the variable name to User
const Bank = require("./models/bank"); // Correct the variable name to User

const Trainer = require("./models/trainers"); // Correct the variable name to User

app.use(cors()); // Activez le middleware cors

app.post("/bank", async (req, res) => {
  try {
    const newBank = await Bank.create(req.body); // Correct the variable name to User
    res.status(200).json(newBank);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get("/bank", async (req, res) => {
  try {
    const getBank = await Bank.find({});
    res.status(200).json(getBank);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//trainer api

app.post("/trainer", async (req, res) => {
  try {
    // Create a new trainer based on the incoming data from the request body
    const { name, speciality, description } = req.body;
    const newTrainer = new Trainer({ name, speciality, description });

    // Save the new trainer to the database
    const savedTrainer = await newTrainer.save();

    // Respond with the saved trainer data
    res.json(savedTrainer);
  } catch (error) {
    // Handle any errors that occur during the creation or saving of the trainer
    res.status(500).json({ message: error.message });
  }
});

app.get("/trainer", async (req, res) => {
  try {
    const getTrainer = await Trainer.find({});
    res.status(200).json(getTrainer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Modifier la route PUT pour mettre à jour le solde de la carte dans la banque
app.put("/bank/:cardNumber", async (req, res) => {
  try {
    const cardNumber = req.params.cardNumber;
    const newSolde = req.body.solde;

    const bankCard = await Bank.findOneAndUpdate(
      { cardNumber: cardNumber },
      { $set: { solde: newSolde } },
      { new: true }
    );

    if (!bankCard) {
      return res.status(404).json({ message: "Carte bancaire non trouvée" });
    }

    res.status(200).json(bankCard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

//crud user
app.get("/user", async (req, res) => {
  try {
    const getUser = await User.find({});
    res.status(200).json(getUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// update user insertion image
const fs = require("fs");
const multer = require("multer");

const storage = multer.memoryStorage(); // Stocke les fichiers en mémoire
const upload = multer({ storage: storage });

app.post("/user/:id/upload", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { buffer, mimetype: contentType } = req.file;

    // Save the image and content type to the user document
    const updateUser = await User.findByIdAndUpdate(
      id,
      { image: buffer.toString("base64"), contentType },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// ...existing code

//app.post("/user/:id/upload", async (req, res) => {
//  try {
//    const { id } = req.params;
//    const { image, contentType } = req.body;

// Read the image file
//   const imageData = fs.readFileSync(image);

// Save the image and content type to the user document
//  const updateUser = await User.findByIdAndUpdate(
//    id,
//    { image: imageData.toString("base64"), contentType },
//     { new: true }
//  );

//  res.status(200).json(updateUser);
// } catch (error) {
//   console.log(error);
//   res.status(500).json({ message: error.message });
// }
//});

//get with valid token
//get with valid token
app.get("/user/me", authenticate, async (req, res, next) => {
  res.send(req.user); // Use req.user to access the user data
});

app.get("/panel", async (req, res) => {
  try {
    const panier = await Panier.find({}); // Fetch cart details from the database
    res.status(200).json(panier); // Send the cart details in the response
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getUser = await User.findById(id);
    res.status(200).json(getUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const putUser = await User.findByIdAndUpdate(id, req.body);
    if (!putUser) {
      return res.status(404).json({ message: `cannot find id + ${id}` });
    }
    const updateUser = await User.findById(id);
    res.status(200).json(putUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/user", async (req, res) => {
  try {
    const newUser = await User.create(req.body); // Correct the variable name to User
    const authToken = await newUser.generateAuthAndSaveToken();
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
//product module

app.put("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const putProduct = await Product.findByIdAndUpdate(id, req.body);
    if (!putProduct) {
      return res.status(404).json({ message: `cannot find id + ${id}` });
    }
    const updateProduct = await Product.findById(id);
    res.status(200).json(putProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/product", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body); // Correct the variable name to User
    res.status(200).json(newProduct);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/product", async (req, res) => {
  try {
    const getProduct = await Product.find({}).populate("users");
    res.status(200).json(getProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/product/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId); // Utilisation de Mongoose pour trouver un produit par son ID

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product); // Renvoyer le produit trouvé
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//panier

app.post("/panel", async (req, res) => {
  try {
    const newPanier = await Panier.create(req.body); // Correct the variable name to User
    res.status(200).json(newPanier);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get("/panel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const panier = await Panier.findById(id);

    if (!panier) {
      return res
        .status(404)
        .json({ message: `Panier with ID ${id} not found` });
    }

    res.status(200).json(panier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/panel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body; // Données à mettre à jour

    const updatedPanier = await Panier.findByIdAndUpdate(id, updatedData, {
      new: true, // Pour obtenir le panier mis à jour après la modification
    });

    if (!updatedPanier) {
      return res
        .status(404)
        .json({ message: `Panier with ID ${id} not found` });
    }

    res.status(200).json(updatedPanier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/panel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPanel = await Panier.findByIdAndDelete(id);

    if (!deletedPanel) {
      return res.status(404).json({ message: `Panel with ID ${id} not found` });
    }

    res.status(200).json({ message: "Panel deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/panel", async (req, res) => {
  try {
    const getpanel = await Panier.find({});
    res.status(200).json(getpanel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUser(email, password);
    //  const authToken = await user.generateAuthAndSaveToken();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

mongoose
  .connect(
    "mongodb+srv://lahbibbilel:lahbibbilel@back-node.kmuw3yj.mongodb.net/Node-api?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    console.log("connected to mongoDb");
  })
  .catch((error) => {
    console.log("error");
  });

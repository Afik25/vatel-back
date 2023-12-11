const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const countries = require("../middlewares/countries.json");
const Inscription = require("../api/v1/controllers/Inscription");
const Login = require("../api/v1/controllers/Login");
const User = require("../api/v1/controllers/User");
const Permission = require("../api/v1/controllers/Permission");
const Role = require("../api/v1/controllers/Role");
const Document = require("../api/v1/controllers/Document");
const Contract = require("../api/v1/controllers/Contract");
const Signer = require("../api/v1/controllers/Signer");
//
// root configure
router.get("/root", Inscription.rootConfigure);
//
router.get("/countries", function (req, res) {
  res.status(200).json({ countries });
});
//
// Register
router.post("/register", Inscription.create);
router.post("/complete", verifyJWT, Inscription.complete);
router.post("/activation", verifyJWT, Inscription.activateCompletion);
//
// login
//
router.post("/login", Login.login);
router.get("/refresh", Login.refreshToken);
router.get("/logout", verifyJWT, Login.logout);
//
// role
router.get("/roles", verifyJWT, Role.get);
//
// // Permission
// router.get("/permissions", Permission.getPermission);
//
// User
router.post("/user", User.create).get("/user", User.get);
router
  .get("/user/key/:key", User.getByKey)
  .put("/user/key/:id", User.update)
  .delete("/user/key/:id", User.delete);
//
// Document
router
  .post("/document", Document.upload, Document.create)
  .get("/document", Document.get);
//
//
// Contract
router
  .post("/contract", Contract.upload, Contract.create)
  .get("/contract", Contract.get);
//
// Signer
router.post("/signer", Signer.create).get("/signer", Signer.get);
//

module.exports = router;

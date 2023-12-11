const Permission = require("../models/Permission");
const Role = require("../models/Role");
const User = require("../models/User");
const { Op } = require("sequelize");

const { generatePassword } = require("../../../utils/utils");

module.exports = {
  async create(req, res) {
    try {
      const {
        prename,
        name,
        gender,
        telephone,
        mail,
        birth,
        birth_location,
        role_id,
        username,
      } = req.body;

      const thumbnails = req?.file?.filename || "";

      const phone = telephone || null;
      if (phone) {
        const check_phone = await User.findOne({
          where: {
            telephone: {
              [Op.like]: `%${telephone.toString()}%`,
            },
          },
        });
        if (check_phone) {
          return res
            .status(400)
            .json({ status: 0, message: "The phone number is already used!" });
        }
      }

      const email = mail || null;
      if (email) {
        const check_mail = await User.findOne({ where: { mail: mail } });
        if (check_mail) {
          return res
            .status(400)
            .json({ status: 0, message: "The mail is already used!" });
        }
      }

      const check_username = await User.findOne({
        where: { username: username },
      });
      if (check_username) {
        return res.status(400).json({
          status: 0,
          message: `The username ${username} is already used!`,
        });
      }
      const password = generatePassword(6);
      const user = await User.create({
        prename,
        name,
        gender,
        telephone,
        mail,
        birth,
        birth_location,
        role_id,
        username,
        password,
        thumbnails,
        path_to: "/user",
        is_completed: false,
      });

      if (user) {
        return res.status(200).json({
          status: 1,
          password,
          message: `The registration of ${
            prename.charAt(0).toUpperCase() + prename.slice(1).toLowerCase()
          } ${name.toUpperCase()} has been successfully done.`,
          user,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `The registration of ${
          prename.charAt(0).toUpperCase() + prename.slice(1).toLowerCase()
        } ${name.toUpperCase()} failed.`,
        user,
      });
    } catch (error) {
      console.log({ "catch error create User : ": error });
    }
  },
  async get(req, res) {
    try {
      const users = await User.findAll();
      if (users == "" || users == null) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No information available.",
        });
      }

      return res.status(200).json({ status: 1, length: users.length, users });
    } catch (error) {
      console.log({ "catch error get Users ": error });
    }
  },
  async getByKey(req, res) {
    try {
      const { key } = req.params;

      const user = await User.findAll({ where: { id: key } });
      if (!user) {
        return res.status.json({
          status: 0,
          length: 0,
          message: `No information available.`,
        });
      }

      return res.status(200).json({ status: 1, length: user.length, user });
    } catch (error) {
      console.log({ "catch error get User by key ": error });
    }
  },
  async update(req, res) {
    try {
      const {
        prename,
        name,
        gender,
        telephone,
        mail,
        birth,
        birth_location,
        role,
        username,
        password,
      } = req.body;
      const { id } = req.params;

      const thumbnails = req?.file?.filename || "";

      const phone = telephone || null;
      if (phone) {
        const check_phone = await User.findOne({
          where: { telephone: telephone },
        });
        if (check_phone) {
          return res.status(400).json({
            status: 0,
            message: "The phone number is already used!",
          });
        }
      }

      const email = mail || null;
      if (email) {
        const check_mail = await User.findOne({ where: { mail: mail } });
        if (check_mail) {
          return res
            .status(400)
            .json({ status: 0, message: "The mail is already used!" });
        }
      }

      const check_username = await User.findOne({
        where: { username: username },
      });
      if (check_username) {
        return res.status(400).json({
          status: 0,
          message: `The username ${username} is already used!`,
        });
      }

      const user = await User.update(
        {
          prename,
          name,
          gender,
          telephone,
          mail,
          birth,
          birth_location,
          role,
          username,
          password,
          thumbnails,
        },
        { where: { id: id } }
      );

      if (user) {
        return res.status(200).json({
          status: 1,
          message: `The update of ${
            prename.charAt(0).toUpperCase() + prename.slice(1).toLowerCase()
          } ${name.toUpperCase()} has been successfully done.`,
          user,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `The update of ${
          prename.charAt(0).toUpperCase() + prename.slice(1).toLowerCase()
        } ${name.toUpperCase()} failed.`,
        user,
      });
    } catch (error) {
      console.log({ "catch error update User ": error });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      await User.destroy({ where: { id: id } });
      return res
        .status(200)
        .json({ status: 1, message: "The user has been deleted." });
    } catch (error) {
      console.log({ "catch error delete User ": error });
    }
  },
};

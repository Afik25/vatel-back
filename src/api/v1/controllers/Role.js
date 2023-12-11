const Role = require("../models/Role");
const { Op } = require("sequelize");

module.exports = {
  async create(req, res) {
    try {
      const { title } = req.body;

      const check_title = await Role.findOne({
        where: { title: title.toLowerCase() },
      });
      if (check_title) {
        return res
          .status(400)
          .json({ status: 0, message: "The role exists already!" });
      }

      const role = await Role.create({
        title: title.toLowerCase(),
        sys_role: "user",
      });

      if (role) {
        return res.status(200).json({
          status: 1,
          message: `The role  ${title.toUpperCase()} created.`,
          role,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `The role ${title.toUpperCase()} creation's process is failed.`,
      });
    } catch (error) {
      console.log({ "catch error create role : ": error });
    }
  },
  async get(req, res) {
    try {
      const roles = await Role.findAll();
      if (roles == "" || roles == null) {
        return res.status(200).json({
          status: 0,
          length: 0,
          message: "No information available about roles.",
        });
      }
      return res.status(200).json({ status: 1, length: roles.length, roles });
    } catch (error) {
      console.log({ "catch error get roles ": error });
    }
  },
  async getByKey(req, res) {
    try {
      const { key } = req.params;

      const role = await Role.findAll({ where: { id: key } });
      if (!role) {
        return res.status.json({
          status: 0,
          length: 0,
          message: `No information available.`,
        });
      }

      return res.status(200).json({ status: 1, length: role.length, role });
    } catch (error) {
      console.log({ "catch error get role by key ": error });
    }
  },
  async update(req, res) {
    try {
      const { title } = req.body;
      const { id } = req.params;

      const check_title = await Role.findOne({
        where: {
          title: {
            [Op.like]: `%${check_title.toString()}%`,
          },
        },
      });
      if (check_title) {
        return res
          .status(400)
          .json({ status: 0, message: "The role exists already!" });
      }

      const role = await Role.update({ title }, { where: { id: id } });

      if (role) {
        return res.status(200).json({
          status: 1,
          password,
          message: `The role  ${title.toUpperCase()} created.`,
          role,
        });
      }
      return res.status(400).json({
        status: 0,
        message: `The role ${title.toUpperCase()} creation's process is failed.`,
      });
    } catch (error) {
      console.log({ "catch error update role ": error });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      await Role.destroy({ where: { id: id } });
      return res
        .status(200)
        .json({ status: 1, message: "The role has been deleted." });
    } catch (error) {
      console.log({ "catch error delete role ": error });
    }
  },
};

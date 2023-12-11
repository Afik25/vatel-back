const User = require("../models/User");
const Role = require("../models/Role");
const Login = require("../models/Login");
const Permission = require("../models/Permission");
//
const { Op } = require("sequelize");

module.exports = {
  async getPermission(req, res) {
    try {
      const { user_id } = req.query;
      //
      const permissions = await Permission.findAll({
        where: { user_id: user_id },
      });
      //
      arr_projects = [];
      arr_modules = [];
      //
      const user_permissions = {
        projects: [],
      };

      return res.status(200).json({ user_permissions });
    } catch (error) {
      console.log({ "catch error on user get permissions ": error });
    }
  },
};

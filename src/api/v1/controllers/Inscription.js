const Inscription = require("../models/Inscription");
const Role = require("..//models/Role");
const User = require("../models/User");
//
const { generateOTP } = require("../../../utils/utils");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { v4: uuid } = require("uuid");

module.exports = {
  async create(req, res) {
    try {
      const { prename, name, username, password, sys_role } = req.body;
      //
      const checkUsername = await User.findOne({
        where: { username: username },
      });
      if (checkUsername) {
        return res.status(400).json({
          status: 0,
          message: "The username is already used!",
        });
      }

      const user = await User.create({
        role_id: 2,
        prename,
        name,
        username,
        password,
        is_completed: false,
        sys_role,
      });

      if (user) {
        return res.status(200).json({
          status: 1,
          message: `Registration for ${
            prename.toUpperCase() + " " + name.toUpperCase()
          } done.`,
          user,
        });
      }

      return res.status(400).json({
        status: 0,
        message: `Registration for ${
          prename.toUpperCase() + " " + name.toUpperCase()
        } failed.`,
      });
    } catch (error) {
      console.log({ "catch error create inscription(registration) ": error });
    }
  },
  async complete(req, res) {
    try {
      const {
        dates,
        location,
        latitude,
        longitude,
        device,
        ip_address,
        operating_system,
        navigator,
      } = req.body;
      const {
        id,
        prename,
        name,
        gender,
        telephone,
        mail,
        birth,
        birth_location,
        username,
        old_password,
        new_password,
      } = req.body;

      const user = await User.findOne({
        where: {
          id: id,
        },
      });

      const check_username = await User.findOne({
        where: { username: username },
      });
      if (check_username) {
        return res.status(400).json({
          status: 0,
          message: "The username is already used!",
        });
      }

      if (!bcrypt.compareSync(old_password, user.password)) {
        return res.status(400).json({
          status: 0,
          message: "The old password is wrong.",
        });
      }

      const usern =
        username == null || username == "" ? user.username : username;

      await User.update(
        {
          prename,
          name,
          gender,
          telephone,
          mail,
          birth,
          birth_location,
          username: usern,
          password: new_password,
          status: 1,
        },
        { where: { id: id }, individualHooks: true }
      );

      const code = generateOTP(6);
      const inscription = await Inscription.create({
        user_id: id,
        dates,
        code,
        location,
        latitude,
        longitude,
        device,
        ip_address,
        operating_system,
        navigator,
      });

      if (inscription) {
        return res.status(200).json({
          status: 1,
          message: `The completion process step 1 done.`,
          code,
        });
      }

      return res.status(400).json({
        status: 0,
        message: "Completion process failed.",
      });
    } catch (error) {
      console.log({ "catch error completion process ": error });
    }
  },
  async activateCompletion(req, res) {
    try {
      const { id, dates, confirmation_code, is_completed } = req.body;

      const findInscription = await Inscription.findOne({
        where: { code: confirmation_code },
      });
      const inscrDates = findInscription.dates;
      const inscrStatus = findInscription.status;

      if (inscrStatus == 1) {
        return res.status(400).json({
          status: 0,
          message: "The confirmation code is not reconized!",
        });
      }

      var d1 = moment(dates);
      var d2 = moment(inscrDates);
      var duration = moment.duration(d1.diff(d2));
      var minutes = duration.asMinutes();

      if (minutes > 10) {
        return res.status(400).json({
          status: 0,
          message: "The confirmation code is experired!",
        });
      }

      const user = await User.update({ is_completed }, { where: { id: id } });

      if (user) {
        const inscrip = await Inscription.update(
          { status: 1 },
          { where: { id: findInscription.id } }
        );

        if (inscrip) {
          return res.status(200).json({
            status: 1,
            message: "Account confirmed and activated successfully.",
            user,
          });
        }
      }

      return res.status(400).json({
        status: 0,
        message: "Account confirmation failed.",
      });
    } catch (error) {
      console.log({ "catch error confirmation account ": error });
    }
  },
  async rootConfigure(req, res) {
    try {
      const check_username = await User.findOne({
        where: { username: "admin" },
      });
      if (check_username) {
        return res.status(400).json({
          status: 0,
          message: "The initial configuration process is already done!",
        });
      }
      //

      const _role = await Role.create({
        title: "General Administrator",
      });

      await Role.create({
        title: "Student",
      });

      const user = await User.create({
        role_id: _role.id,
        prename: "admin",
        name: "admin",
        username: "admin",
        password: "admin",
        is_completed: false,
        sys_role: "admin",
      });

      if (user) {
        return res.status(200).json({
          status: 1,
          message: `Initial configuration process successfully.`,
          user,
        });
      }

      return res.status(400).json({
        status: 0,
        message: `Initial configuration process failed.`,
      });
    } catch (error) {
      console.log({ "catch error on initial configuration process ": error });
    }
  },
};

const Admin = require("./../../models/admin.model.js");
const User = require("./../../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const moment = require("moment");
const Mailer = require("./../../helpers/MailHelper");
const Activity = require("../../models/activity.model.js");
const mailer = new Mailer();
const fs = require("fs");
const path = require("path");

//login page
exports.login = (req, res) => {
  res.render("login.ejs", { appName: global.appname, error: req.query.error });
  return;
};

// Find a single User with a id
exports.loginSubmit = async (req, res) => {
  Admin.login(req.body.email, async (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.redirect(
          "/login?error=" + trans.lang("message.admin.invalid_credentials")
        );
      } else {
        res.redirect(
          "/login?error=" + trans.lang("message.something_went_wrong")
        );
      }
    } else {
      let passwordMatched = await bcrypt.compare(
        req.body.password,
        data.password
      );
      if (data && passwordMatched) {
        // Create token
        const token = jwt.sign(
          {
            id: data.id,
            email: data.email,
            name: data.name,
            type: data.type,
          },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        const permissions = data.permissions.split(",");
        req.session.user = { ...data, permissions, token };

        res.redirect("/dashboard");
        return;
      } else {
        res.redirect(
          "/login?error=" + trans.lang("message.admin.invalid_credentials")
        );
        return;
      }
    }
  });
};

//logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/login");
  });
};

//dashboard
exports.dashboard = (req, res) => {
  Admin.getDashboard((err, data) => {
    if (err)
      res.redirect(
        "/login?error=" + trans.lang("message.something_went_wrong")
      );
    else {
      res.render("dashboard.ejs", {
        appName: global.appname,
        user: req.session.user,
        error: req.query.error,
        users: data.users,
        admins: data.admins,
      });
    }
  });
};

//users
exports.users = (req, res) => {
  User.getAll((err, data) => {
    let selected = req.query.id;
    let updateUser = data.find((item) => item.id === parseInt(selected));
    if (updateUser?.id)
      updateUser = {
        ...updateUser,
        dob: moment(updateUser.dob).format("YYYY-MM-DD"),
      };
    res.render("users.ejs", {
      appName: global.appname,
      user: req.session.user,
      error: req.query.error,
      page: req.query.page,
      users: data,
      updateUser,
    });
    return;
  });
};

//admins
exports.admins = (req, res) => {
  Admin.getAll((err, data) => {
    if (err) {
      res.redirect(
        "/login?error=" + trans.lang("message.something_went_wrong")
      );
      return;
    } else {
      let selected = req.query.id;

      const admin = data.find((item) => item.id === parseInt(selected));
      // console.log("data", data);
      res.render("admins.ejs", {
        appName: global.appname,
        user: req.session.user,
        error: req.query.error,
        page: req.query.page,
        admins: data,
        admin: { ...admin, permissions: admin?.permissions.split(",") },
      });
      return;
    }
  });
};

exports.activity = (req, res) => {
  Activity.getAll((err, data) => {
    const email = req.query.email;
    if (err) {
      res.redirect(
        "/login?error=" + trans.lang("message.something_went_wrong")
      );
      return;
    } else {
      res.render("activity.ejs", {
        appName: global.appname,
        user: req.session.user,
        error: req.query.error,
        page: req.query.page,
        activities: data,
        email: email,
      });
      return;
    }
  });
};
// Create and Save a new Tutorial
exports.adminSubmit = async (req, res) => {
  console.log('req.body', req.body)
  if (req.body.name && req.body.email) {
    Admin.findByEmail(req.body.email, async (err, data1) => {
      if (err) {
        if (err.kind !== "not_found") {
          res.redirect(
            "/admins?page=form&id=" +
              req.body.id +
              "&error=" +
              trans.lang("message.something_went_wrong")
          );
          return;
        }
      } else {
        if (data1.id != req.body.id) {
          res.redirect(
            "/admins?page=form&id=" +
              req.body.id +
              "&error=" +
              trans.lang("message.email_already_exists")
          );
          return;
        }
      }
      // Save Admin in the database
      let adminPermissions = req.body.permissions.join();
      // if (req.body.password !== '') {
      // record.password = await bcrypt.hash(req.body.password, 10);

      let encPassword = req.body.password
        ? await bcrypt.hash(req.body.password, 10)
        : data1.password;

      // } else {
      //   delete record.password;
      // }

      const newRecord = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: encPassword,
        permissions: adminPermissions,
      });
      if (req.body.id) {
        // Sort both arrays for comparison
        Admin.updateById(req.body.id, newRecord, async (err, data) => {
          if (err) {
            res.redirect(
              "/admins?page=form&id=" +
                req.body.id +
                "&error=" +
                trans.lang("message.something_went_wrong")
            );
            return;
          } else {
            //add activity
            let activity;
            if (req.body.id == req.session.user?.id) {
              activity = `Admin with email ${req.session.user?.email} has updated his info`;
            } else {
              activity = `Admin with email ${req.session.user?.email} has updated info of other admin with email ${req.body.email}`;
            }
            let newActivity = {
              adminId: req.session.user?.id,
              activity: activity,
              email: req.body.email,
            };
            Activity.create(new Activity(newActivity), async (err, data) => {
              if (err) {
                res.redirect(
                  "/admins?page=form&id=" +
                    req.body.id +
                    "&error=" +
                    trans.lang("message.something_went_wrong")
                );
                return;
              }
            });
            res.redirect("/admins");
            return;
          }
        });
      } else {
        Admin.create(newRecord, async (err, newAdmin) => {
          if (err) {
            res.redirect(
              "/admins?page=form&id=" +
                req.body.id +
                "&error=" +
                trans.lang("message.something_went_wrong")
            );
            return;
          } else {
            //add activity
            let activity = `${req.session.user?.name} created ${req.body.name} admin`;
            let newActivity = {
              adminId: req.session.user?.id,
              activity: activity,
              email: req.session.user?.email,
            };
            Activity.create(new Activity(newActivity), async (err, data) => {
              if (err) {
                // res.redirect('/admins?page=form&id=' + req.body.id + '&error=' + trans.lang('message.something_went_wrong'));
                // return;
              }
            });
            res.redirect("/admins");
            return;
          }
        });
      }
    });
  } else {
    res.redirect(
      "/admins?page=form&id=" +
        req.body.id +
        "&error=" +
        trans.lang("message.required")
    );
    return;
  }
};

exports.updateUser = async (req, res) => {
  if (req.body.name && req.body.email && req.body.zipcode && req.body.dob) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex pattern
    console.log(
      "test email",
      req.body.email,
      emailPattern.test(req.body.email)
    );
    if (emailPattern.test(req.body.email)) {
      User.findById(req.body.id, async (err, data) => {
        if (err) {
          if (err.kind !== "not_found") {
            res.redirect(
              "/users?page=form&id=" +
                req.body.id +
                "&error=" +
                trans.lang("message.something_went_wrong")
            );
            return;
          }
        } else {
          if (data.id != req.body.id) {
            res.redirect(
              "/users?page=form&id=" +
                req.body.id +
                "&error=" +
                trans.lang("message.email_already_exists")
            );
            return;
          }
        }

        // Update user in the database
        let record = req.body;
        let activity = "";
        const dob1 = moment(data.dob).format("YYYY-MM-DD");
        if (data.email != record.email) {
          if (
            data.name != record.name ||
            data.zipcode != record.zipcode ||
            dob1 != record.dob
          ) {
            activity = `Admin with email ${req.session.user?.email} has updated info and email of user ${data.email} to new email ${record.email}`;
          } else {
            activity = `Admin with email ${req.session.user?.email} has updated email of user ${data.email} to new email ${record.email}`;
          }
        } else {
          activity = `Admin with email ${req.session.user?.email} has updated info of user with email ${data.email}`;
        }

        if (req.body.id) {
          User.updateById(req.body.id, new User(record), async (err, data) => {
            if (err) {
              res.redirect(
                "/users?page=form&id=" +
                  req.body.id +
                  "&error=" +
                  trans.lang("message.something_went_wrong")
              );
              return;
            } else {
              //add activity

              let newActivity = {
                adminId: req.session.user?.id,
                activity: activity,
                email: req.session.user?.email,
              };
              Activity.create(new Activity(newActivity), async (err, data) => {
                if (err) {
                  res.redirect(
                    "/users?page=form&id=" +
                      req.body.id +
                      "&error=" +
                      trans.lang("message.something_went_wrong")
                  );
                  return;
                }
              });

              res.redirect("/users");
              return;
            }
          });
        }
      });
    } else {
      res.redirect(
        "/users?page=form&id=" +
          req.body.id +
          "&error=" +
          trans.lang("message.emailRequired")
      );
      return;
    }
  } else {
    res.redirect(
      "/users?page=form&id=" +
        req.body.id +
        "&error=" +
        trans.lang("message.required")
    );
    return;
  }
};

exports.deleteUser = async (req, res) => {
  User.findById(req.params.id, async (err, data1) => {
    if (err) {
      if (err.kind !== "not_found") {
        res.redirect(
          "/users?id=" +
            req.params.id +
            "&error=" +
            trans.lang("message.something_went_wrong")
        );
        return;
      }
    }
    // update delete status in the database
    let obj = { status: 0, deletedAt: new Date() };
    if (req.params.id) {
      User.updateById(req.params.id, new User(obj), async (err, data) => {
        if (err) {
          res.redirect(
            "/users?id=" +
              req.params.id +
              "&error=" +
              trans.lang("message.something_went_wrong")
          );
          return;
        } else {
          //add activity
          let activity = `Admin with email ${req.session.user?.email} has deleted the account of user with email ${data1.email}`;
          let newActivity = {
            adminId: req.session.user?.id,
            activity: activity,
            email: req.session.user?.email,
          };
          Activity.create(new Activity(newActivity), async (err, data) => {
            if (err) {
              res.redirect(
                "/users?page=form&id=" +
                  req.params.id +
                  "&error=" +
                  trans.lang("message.something_went_wrong")
              );
              return;
            }
          });
          res.redirect("/users");
          return;
        }
      });
    }
  });
};

exports.jsonEditor = async (req, res) => {
  Admin.getAll((err, data) => {
    if (err) {
      res.redirect(
        "/login?error=" + trans.lang("message.something_went_wrong")
      );
      return;
    } else {
      // Read the JSON file
      let selected = req.query.id;
      const jsonFile = data.find((item) => item.id === parseInt(selected));

      const filepath = __json_path + "/public/commands/FlikProdb.json";
      fs.readFile(filepath, "utf-8", (err, data) => {
        if (err) {
          console.error("Error reading the JSON file:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        const jsonData = JSON.parse(data);
        res.render("jsonEditor.ejs", {
          jsonData: jsonData,
          appName: global.appname,
          user: req.session.user,
          error: req.query.error || null,
          page: req.query.page || null,
          jsonFile: jsonFile,
          // fileUpdateMessage: req.query.file_update || null
        });
      });
      return;
    }
  });
};

exports.saveJson = async (req, res) => {
  try {
    const updatedJsonData = req.body.jsonData; // Get the updated JSON data from the request body
    const parsedData = JSON.parse(updatedJsonData);
    const filepath = __json_path + "/public/commands/FlikProdb.json";

    // Write the updated JSON data back to the file
    fs.writeFile(filepath, JSON.stringify(parsedData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to JSON file:", err);
        res.status(500).send("Internal Server Error");
        return;
      } else {
        //add activity
        let activity = `Admin with email ${req.session.user?.email} has updated json commands`;
        let newActivity = {
          adminId: req.session.user?.id,
          activity: activity,
          email: req.session.user?.email,
        };
        Activity.create(new Activity(newActivity), async (err, data) => {
          if (err) {
            // res.redirect('/admins?page=form&id=' + req.body.id + '&error=' + trans.lang('message.something_went_wrong'));
            // return;
          }
        });
        res.redirect("/activity");
        return;
      }
    });
  } catch (error) {
    console.error("Error parsing JSON data:", error);
    res.status(400).send("Invalid JSON format");
  }
};

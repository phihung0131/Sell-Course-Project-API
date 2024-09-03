const allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

const studentBoard = (req, res) => {
  res.status(200).send("Student Content.");
};

const adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

const teacherBoard = (req, res) => {
  res.status(200).send("Teacher Content.");
};

const userController = {
  allAccess,
  studentBoard,
  adminBoard,
  teacherBoard,
};

module.exports = userController;

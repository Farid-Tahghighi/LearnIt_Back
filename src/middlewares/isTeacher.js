function checkTeacher(req, res, next) {
  if (req.user.type != "Teacher") return res.status(403).send("Access denied.");
  next();
}

export default checkTeacher;

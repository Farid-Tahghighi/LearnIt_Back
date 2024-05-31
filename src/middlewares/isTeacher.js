function checkTeacher(req, res, next) {
  console.log(req.user.type);
  if (req.user.type != "Moderator" && req.user.type != "Teacher")
    return res.status(403).send("Access denied.");
  next();
}

export default checkTeacher;

function checkMod(req, res, next) {
  if (req.user.type != "Moderator")
    return res.status(403).send("Access denied.");
  next();
}

export default checkMod;

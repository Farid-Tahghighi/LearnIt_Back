export default function (err, req, res, next) {
  // Logging the error
  res.status(500).send("Internal Error.");
}

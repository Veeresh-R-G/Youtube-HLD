const helloWorld = (req, res) => {
  res.status(200).send("Hello World");
};

module.exports = {
  helloWorld,
};

const homeFn = async (req, res) => {
  try {
    // const userId = req.userId;
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ msg: "user need to log in" });
  }
};

module.exports = { homeFn };

const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Room = require("../models/Room.model");
const Review = require("../models/Review.model");

/* GET home page */
router.get("/list", (req, res, next) => {
  Room.find()
    .populate("owner")
    .then((roomsFromDB) => {
      const copyOfRooms = roomsFromDB.map((room) => ({
        _id: room._id,
        name: room.name,
        description: room.description,
        imageUrl: room.imageUrl,
        owner: room.owner.username,
        isOwner: req.session.user._id.toString() === room.owner._id.toString(),
      }));
      res.render("room/list", copyOfRooms);
    });
});

router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("room/create");
});

router.post("/create", isLoggedIn, (req, res, next) => {
  Room.create({ ...req.body, owner: req.session.user._id }).then(
    (createdRoom) => {
      console.log("createdRoom 12:", createdRoom);
      res.redirect("/room/list");
    }
  );
});

router.get("/:id/edit", isLoggedIn, (req, res, next) => {
  Room.findById(req.params.id).then((roomFromDB) => {
    if (req.session.user._id.toString() === roomFromDB.owner.toString()) {
      res.render("room/edit", roomFromDB);
    } else {
      res.redirect("/room/list");
    }
  });
});

router.post("/:id/delete", isLoggedIn, (req, res, next) => {
  Room.findByIdAndDelete(req.params.id).then(() => {
    res.redirect("/room/list");
  });
});

router.get("/:id/details", (req, res, next) => {
  Room.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "user" },
    })
    .then((roomFromDB) => {
      console.log({ room: roomFromDB.reviews });
      res.render("room/details", {
        roomFromDB,
        isAuth: req.session?.user._id,
        isOwner:
          req.session?.user?._id.toString() === roomFromDB.owner._id.toString(),
      });
    });
});

module.exports = router;

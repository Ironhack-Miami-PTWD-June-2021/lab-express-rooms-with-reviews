const router = require("express").Router();
const Review = require("../models/Review.model");
const Room = require("../models/Room.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/:id/create", isLoggedIn, (req, res, next) => {
  Review.create({ ...req.body, user: req.session.user._id }).then(
    (reviewFromDB) => {
      Room.findByIdAndUpdate(req.params.id, {
        $push: { reviews: reviewFromDB._id },
      }).then(() => {
        res.redirect(`/room/${req.params.id}/details`);
      });
    }
  );
});

module.exports = router;

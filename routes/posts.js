const router = require("express").Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const Bloglike = mongoose.model("Bloglike");
const multer = require("multer");
const ObjectId = require("mongodb").ObjectID;
var result = require("./response");
/** Storage Engine */
const storage = multer.diskStorage({
  destination: function(req, file, fn) {
    fn(null, "./public/files");
  },
  filename: function(req, file, fn) {
    fn(null, new Date().getTime().toString() + "-" + file.originalname);
  }
});
const fileFilter = function(req, file, callback) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
const upload = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
/*Image Upload code complete*/

router.get("/", async (req, res) => {
  await Post.find({}, function(posts, err) {
    if (err) {
      res.send(err);
    } else {
      res.send(posts);
    }
  });
});

router.post("/", upload.single("blogImage"), async (req, res) => {
  if (!req.body.title) {
    res.send(result.response(422, "", "Title is empty"));
  } else if (!req.body.content) {
    res.send(result.response(422, "", "Content is empty"));
  } else {
    const post = new Post();
    post.title = req.body.title;
    post.content = req.body.content;
    if (req.file) {
      post.path = req.file.path;
    }
    await post.save(function(err, post) {
      if (err) {
        res.send(
          result.response(
            500,
            err,
            "OOPS, Something went wrong !, Please try again"
          )
        );
      } else {
        res.send(result.response(200, post, "Blog Added !"));
      }
    });
  }
});

router.get("/:postId", async (req, res) => {
  await Post.find({ _id: req.params.postId }, function(post, err) {
    if (err) {
      res.send(err);
    } else {
      res.send(post);
    }
  });
});

router.put("/:postId", upload.single("blogImage"), async (req, res) => {
  var path = "";
  if (req.file) {
    path = req.file.path ? req.file.path : "";
  }
  if (!req.body.title) {
    res.send(result.response(422, "", "Title is empty"));
  } else if (!req.body.content) {
    res.send(result.response(422, "", "Content is empty"));
  } else {
    await Post.update(
      { _id: req.params.postId },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          path: path
        }
      },
      function(err, post) {
        if (err) {
          res.send(
            result.response(
              500,
              err,
              "OOPS, Something went wrong !, Please try again"
            )
          );
        } else {
          res.send(result.response(200, post, "Blog Added !"));
        }
      }
    );
  }
});

router.delete("/:postId", async (req, res) => {
  /**Deleteing Data from post */
  if (!req.params.postId) {
    res.send(result.response(422, "", "Id params is empty"));
  } else {
    await Post.findByIdAndRemove(
      {
        _id: req.params.postId
      },
      function(err, post) {
        if (err) {
          res.send(
            result.response(
              500,
              err,
              "OOPS, Something went wrong !, Please try again"
            )
          );
        } else {
          res.send(result.response(200, post, "Blog Deleted !"));
        }
      }
    );
    /**Removing Data from comment */
    await Comment.remove(
      {
        post: ObjectId("" + req.params.postId + "")
      },
      function(err, comment) {
        if (err) {
          res.send(err);
        } else {
        }
      }
    );
  }
});

/*Create a comment for the post*/
router.post("/:postId/comment", async (req, res) => {
  /* Find a Post */

  const post = await Post.findOne({ _id: req.params.postId });
  /* Create a Post */
  const comment = new Comment();
  comment.content = req.body.content;
  comment.post = post._id;
  await comment.save();
  /* Associate Post with comment */
  post.comments.push(comment._id);
  await post.save();
  res.send(comment);
});

/*Read a comment for the post*/
router.get("/:postId/comment", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId }).populate(
    "comments"
  );
  res.send(post);
});

/**Edit a comment */
router.put("/comment/:commentId", async (req, res) => {
  const comment = await Comment.findOneAndUpdate(
    {
      _id: req.params.commentId
    },
    req.body,
    { new: true, runValidators: true }
  );
  res.send(comment);
});

router.delete("/comment/:commentId", async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.commentId });
  const postId = comment.post;
  await Post.update(
    { _id: postId },
    { $pull: { comments: req.params.commentId } },
    { multi: true },
    function(err, data) {
      console.log(err, data);
    }
  );
  await Comment.findByIdAndRemove(req.params.commentId);
  res.send({ message: "Comment Successfully Deleted" });
});

/**
 * Blog like code start
 */
router.post("/:postId/like", async (req, res) => {
  const like = new Bloglike();
  like.like = 1;
  like.post = req.params.postId;
  await like.save(async function(error) {
    if (error) {
      res.send(error);
    } else {
      const like = await Bloglike.find({
        post: req.params.postId
      }).count();
      const response = {
        postid: req.params.postId,
        totallike: like
      };
      res.send(response);
    }
  });
});
module.exports = router;

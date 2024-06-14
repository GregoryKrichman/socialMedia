import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export const uploadMiddleware = upload.single("file");

export const getStories = (req, res) => {
  const userId = req.query.userId;
  const q = "SELECT * FROM stories WHERE userId=?";
  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const file = req.file;
    if (!file) return res.status(400).json("No file uploaded!");

    const q = "INSERT INTO stories(`img`, `userId`, `createdAt`) VALUES (?)";
    const values = [
      file.filename,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Story has been created.");
    });
  });
};

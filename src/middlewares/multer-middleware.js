import multer from "multer";

// export const multerMiddleHost = ({ extensions = allowedExtensions.images }) => {
// diskStorage
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

export default upload;

// fileFilters
// const fileFilters = (req, file, cb) => {
//   if (extensions.includes(file.mimetype.splite("/")[1])) {
//     return cb(null, true);
//   }
//   cb(new Error("Image format is not allowed!", false));
// };
// const file = multer({fileFilters, storage});
//   return file;
// };

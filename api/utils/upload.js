import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up storage for Multer (store temporarily in the 'uploads/' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Specify the uploads directory
  },
  filename: (req, file, cb) => {
    // Use the current timestamp and original file name to create a unique filename
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;

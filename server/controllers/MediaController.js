import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class MediaController {
  static async getImages(req, res) {
    res.sendFile(
      path.join(__dirname, "/../storage/public/images/course/", req.params.name)
    );
  }
}

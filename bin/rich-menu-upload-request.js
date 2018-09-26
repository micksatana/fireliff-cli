"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichMenuUploadRequest = void 0;

var fs = _interopRequireWildcard(require("fs"));

var _richMenuRequest = require("./rich-menu-request");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class RichMenuUploadRequest extends _richMenuRequest.RichMenuRequest {
  constructor(options) {
    super({ ...options,
      ...{
        contentType: 'image/jpeg'
      }
    });
  }

  send(richMenuId, imagePath) {
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(imagePath);
      fs.stat(imagePath, (err, stats) => {
        if (err) {
          return reject(err);
        }

        this.axios.defaults.headers.common['content-length'] = stats.size;
        return resolve(this.axios.post(`https://api.line.me/v2/bot/richmenu/${richMenuId}/content`, readStream));
      });
    });
  }

}

exports.RichMenuUploadRequest = RichMenuUploadRequest;
//# sourceMappingURL=rich-menu-upload-request.js.map
import API from "../amplify/API";
import { initializeUpload } from "../graphql/queries";
import isTextBlob from "./isTextBlob";

export default async (blob, taskId, onProgress) => {
  const mimeType = blob.type
    ? blob.type
    : await isTextBlob(blob)
      ? "text/plain"
      : "application/octet-stream";
  const urlQueryOpts = { contentType: mimeType, taskId };
  const res = await API.execute(initializeUpload, urlQueryOpts);
  const { presignedUrl } = res.data.initializeUpload;
  const request = new XMLHttpRequest();
  request.open("PUT", presignedUrl);
  request.setRequestHeader("Content-Type", mimeType);
  request.setRequestHeader(
    "Content-Disposition",
    `attachment; filename="${blob.name}"`
  );

  request.upload.addEventListener("progress", function (e) {
    onProgress && onProgress((e.loaded / e.total) * 100);
  });

  const promise = new Promise((resolve, reject) => {
    request.addEventListener("load", function () {
      resolve(request.status);
    });
  });

  request.send(blob);

  return await promise;
};

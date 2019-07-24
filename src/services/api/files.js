import { postFile, remove } from "../request";

export function uploadFile(file) {
  return postFile("/files", file);
}

export function deleteFile(fileList) {
  return remove("/files", fileList);
}

import { postFile, _delete } from "../request";

export function uploadFile(file) {
  return postFile("/files", file);
}

export function deleteFile(file_path) {
  return _delete(`/files/${encodeURIComponent(file_path)}`);
}

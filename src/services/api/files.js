import { postFile, _delete } from "../request";

export function uploadFile(file) {
  return postFile("/files", file);
}

export function deleteFiles(files) {
  return _delete("/files", files);
  // return _delete(`/files/${encodeURIComponent(file_path)}`);
}

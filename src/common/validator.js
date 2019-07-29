export default {
  PASSWORD: (rule, value, callback) => {
    if (/[^\d\w]/.test(value)) {
      callback(new Error("密码只能包含字母和数字"));
    } else {
      callback();
    }
  }
};

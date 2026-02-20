export function loginApi({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.includes("@") && password.length >= 6) {
        resolve({ email, token: Date.now() });
      } else {
        reject("Invalid credentials");
      }
    }, 600);
  });
}

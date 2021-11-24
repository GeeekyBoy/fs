import crypto from "crypto-browserify";

export default async (email, size = 200) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const hash = crypto.createHash("md5").update(normalizedEmail).digest("hex");
    const url = `https://www.gravatar.com/avatar/${hash}?s=${size}`;
    const response = await fetch(url);
    if (response.headers.get("content-disposition") !== 'inline; filename="none.jpg"') {
      const blob = await response.blob();
      const imageURL = await new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      return imageURL;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

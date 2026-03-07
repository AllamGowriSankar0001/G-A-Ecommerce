const cloudinary = require("cloudinary").v2;

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARYNAME,
    api_key: process.env.CLOUDINARYAPIKEY,
    api_secret: process.env.CLOUDINARYAPISECRETKEY,
  });

  const result = await cloudinary.api.ping();
  console.log("Cloudinary connected:", result.status);
};

module.exports = connectCloudinary;

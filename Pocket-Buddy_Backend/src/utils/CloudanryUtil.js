const cloudinary = require("cloudinary").v2;


const uploadFileToCloudinary = async (file) => {

    //conif
        cloudinary.config({
        cloud_name:"dwyppx42y",
        api_key:"441815888328139",
        api_secret:"s28uTn8eDvkehv82p6ypYYaV-uE"
    })


 

    const cloundinaryResponse = await cloudinary.uploader.upload(file.path)
    return cloundinaryResponse


};
module.exports = {
    uploadFileToCloudinary
}
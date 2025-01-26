import CryptoJS from "crypto-js";


export const Decrypt =async ({key , SECRET_KEY = process.env.SIGNATURE})=>{
    return CryptoJS.AES.decrypt(key,SECRET_KEY).toString();
}
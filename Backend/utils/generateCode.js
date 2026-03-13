
export const generateVerifyCode = () =>{
    return Math.floor(Math.random()*900000+100000).toString();

};

export const getExpiryDate = () =>{
    return new Date(Date.now() + 6*60*1000)
}
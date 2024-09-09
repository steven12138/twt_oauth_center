export const check_password = (password) => {
  const pattern = /(?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[!@#$%^&*()_+|~\-=`{}[\]:";'<>?,./])/
  return pattern.test(password)
}

export const check_phone = (phone)=>{
  // check china phone number
  const pattern = /^1[3456789]\d{9}$/
  return pattern.test(phone)
}

export const check_email  = (email)=>{
  const pattern = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  return pattern.test(email)
}



export const check_password = (password)=>{
  const pattern=/(?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[!@#$%^&*()_+|~\-=`{}\[\]:";'<>?,./])/;
  return password.search(pattern) !== -1
}
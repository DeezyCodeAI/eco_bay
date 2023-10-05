import axios from 'axios';
import ResetPasswordpage from '../../../../components/resetpassword/page';
import jwt from "jsonwebtoken";


export default async function Resetpage({params}) {
  const resetToken = process.env.RESET_TOKEN_SECRET;
  const tokenData = params.token;

  let data = await axios.get("https://api.ipregistry.co/?key=eqe515rrg8bl21pz")
  .then((res) => {
    return res.data.location.country;
  })
  .catch((err) => {
    console.log(err);
  });
  
  let country = data
  
  return (
    <>
      <ResetPasswordpage country={country}/>
    </>
  )
}




import Forgotpage from "../../../components/forgorpassword/page";
import axios from "axios";

export default async function forgotPassword() {
  let data = await axios.get("https://api.ipregistry.co/?key=eqe515rrg8bl21pz")
  .then((res) => {
    return res.data.location.country;
  })
  .catch((err) => {
    console.log(err);
  });
  
  let country = data
  return (
    <div>
      <Forgotpage country={country}/>
    </div>
  )
}

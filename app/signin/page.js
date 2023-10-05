import axios from "axios";
import SignInpage from "../../components/signin/page";


export default async function SignIn() {
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
      <SignInpage country={country}/>
    </div>
  )
}

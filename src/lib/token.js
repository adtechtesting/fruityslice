 import axios from "axios"



 const BACKEND_URL = process.env.VITE_BACKEND || "http://localhost:3001";


 export function getSliceReward(score,playerAddress){
    
    if(score => 1000 ) {
        return 50000
    }

    if (score <20) return 0 ;
    if (score < 40) return 500;
  if (score < 60) return 1000;
  if (score < 80) return 1500;
  if (score < 100) return 2000;
  if (score < 120) return 3000;
  return 6000;
 }


 export async function transferTokens(playerAddress,score){
   try {
    const jwtoken=localStorage.getItem("gameToken")
    if(!jwtoken) {
      throw new Error("no auth")
    }


    console.log("infi token interface",{playerAddress,score})

       const repsonse = await axios.post(
            `${BACKEND_URL}/api/tranfer-tokens`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer solanafruitninja",
              },
            }
          );


         const data= await response.data()
          console.log("server resopnse",data)


          if(!response.ok){
            if(!response.status ===401) {
              localStorage.removeItem("jwt-token");
              throw new Error("Auth expired ")
            }
            throw new Error(data.error || data.details || " Failed to transfer tokens")
          }

          return data.signature;

   } catch (error) {
    console.error("error tranfering" ,error)
    throw new Error("failed to")
   }  
 }
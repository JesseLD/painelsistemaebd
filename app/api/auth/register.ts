export default async function POST(req:Request) {
  // res.status(200).json({ name: 'John Doe' })
  try{

    const { email,password} = await req.json();

  }catch(e){
    console.log(e)
  }
} 
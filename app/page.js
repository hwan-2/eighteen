import {connectDB} from "@/util/database";
import {MongoClient} from "mongodb";

export default async function Home() {

    const client = await connectDB
    const db = client.db("eighteen")
    let result = await db.collection('post').find().toArray()
    console.log(result)

  return (
      <div>
        <h1 className={"title"}>Hello world</h1>
        <h3 className={"title-sub"}>next.js project</h3>
      </div>
  )
}

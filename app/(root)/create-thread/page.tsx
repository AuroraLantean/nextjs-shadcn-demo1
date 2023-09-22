import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

async function Page() {

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
    </>
  )
}

export default Page;
import { redirect } from "next/navigation";

//import ThreadCard from "@/components/cards/ThreadCard";
//import Pagination from "@/components/shared/Pagination";

import { fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import ThreadCard from "@/components/cards/ThreadCard";

//      <UserButton afterSignOutUrl="/" />
async function Home() {

  const result = await fetchPosts(1, 30);
  /*const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );*/
  console.log("fetched posts:", result);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {result.posts.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={'user.id'}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}
export default Home;
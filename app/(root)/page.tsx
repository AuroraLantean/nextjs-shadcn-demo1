import { redirect } from "next/navigation";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { Separator } from "@/components/ui/separator";
import { CarouselDraggable } from "@/components/carousel/CarouselDraggable";
import ItemInputForm from "@/components/forms/ItemInputForm";

import StateOutput from "@/components/stateOutput";
import StateInput from "@/components/forms/StateInput";
import CouponDiv from "@/components/couponDiv";
import TableRows from "@/components/tableRows";
import DbInputForm from "@/components/forms/DbInputForm";
import TanstackOut from "@/components/TanstackOut";
import TanstackIn from "@/components/TanstackIn";

export default async function HomePage() {
  console.log("HomePage")
  //const result = await fetchPosts(1, 30);
  /*const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );*/
  //console.log("fetched posts:", result);

  return (
    <>
      <h1 className="head-text text-left">HomePage</h1>
      <CarouselDraggable />
      <Separator className="my-2" />
      <div className="flex flex-wrap">
        <TanstackIn />
        <TanstackOut />
        <DbInputForm />
        <ItemInputForm />
        <StateOutput />
        <StateInput />
        <CouponDiv />
        <TableRows />
      </div>
    </>
  )
}
//      <StateOutput />
//      <UserButton afterSignOutUrl="/" />
/**<HorizontalScrollCarousel />
      <div className="border-2">
        <div className="h-full px-4 py-6 lg:px-8">

          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Dragon Collection
            </h2>
            <p className="text-sm text-muted-foreground">
              Top picks for you. Updated daily.
            </p>
          </div>

          <Separator className="my-4" />
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {dragons.map((dragon) => (
                  <NftCard
                    key={dragon.name}
                    item={dragon}
                    className="w-[250px]"
                    aspectRatio="portrait"
                    width={250}
                    height={330}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>

    <div className="grid lg:grid-cols-5">
    <div className="col-span-3 lg:col-span-4 lg:border-l">

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
 */

"use client"
import { sidebarLinks } from "@/constants/site_data"
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"
//import { SignOutButton, SignedIn } from "@clerk/nextjs";

function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
          //link.route.length > 1 => the route is not "/"
          // the home route "/" is determined by pathname == link.route
          //text-light-1
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && 'bg-primary'}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className=" max-lg:hidden">{link.label}</p>
            </Link>
          )
        }
        )}
      </div>
    </section>
  )

}

export default LeftSidebar;
/**
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('sign-in')}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>

 */
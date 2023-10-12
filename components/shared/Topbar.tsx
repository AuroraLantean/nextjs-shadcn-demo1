import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";
//import { SignOutButton, SignedIn, OrganizationSwitcher } from "@clerk/nextjs";
//import { dark } from "@clerk/themes";
//text-light-1
function Topbar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold  max-md:hidden">NextJs Shadcn</p>
      </Link>

      <div>
        <ThemeToggle className='' />

        <div className="flex items-center gap-1">
          <div className="block md:hidden">
            SignOut Button
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Topbar;
/**
  toggle: absolute top-0 right-0
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
              </div>
            </SignOutButton>
          </SignedIn>

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4"
            }
          }}
        />

 */
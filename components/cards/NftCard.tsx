import Image from "next/image"
import { cn } from "@/lib/utils"
import { DragonT } from "@/constants/site_data"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  item: DragonT
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

export function NftCard({
  item,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: Props) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <Image
          src={item.imgURL}
          alt={item.name}
          width={width}
          height={height}
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
          )}
        />
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{item.name}</h3>
        <p className="text-xs text-muted-foreground">{item.artist}</p>
      </div>
    </div>
  )
}

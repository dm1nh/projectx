import { cn } from "@/lib/utils"

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("w-full px-4 xl:mx-auto xl:w-[1280px]", className)}
      {...props}
    />
  )
}

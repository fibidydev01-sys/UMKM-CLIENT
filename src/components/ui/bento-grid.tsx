import { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ==========================================
// BENTO GRID COMPONENT
// Flexible grid with customizable rows/cols
// ==========================================

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ==========================================
// BENTO CARD - Standard (with CTA button)
// ==========================================

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className?: string
  background?: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta?: string
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta = "Buka",
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "dark:bg-background transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:[border:1px_solid_rgba(255,255,255,.1)]",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="p-4">
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-10">
        <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
        <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          {name}
        </h3>
        <p className="max-w-lg text-neutral-400">{description}</p>
      </div>

      <div
        className={cn(
          "pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden"
        )}
      >
        <Button
          variant="link"
          asChild
          size="sm"
          className="pointer-events-auto p-0"
        >
          <a href={href}>
            {cta}
            <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
          </a>
        </Button>
      </div>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex"
      )}
    >
      <Button
        variant="link"
        asChild
        size="sm"
        className="pointer-events-auto p-0"
      >
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ms-2 h-4 w-4 rtl:rotate-180" />
        </a>
      </Button>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
)

// ==========================================
// BENTO ACTION CARD - For Dashboard Quick Actions
// Simpler design with gradient background
// ==========================================

interface BentoActionCardProps {
  name: string
  description: string
  href: string
  Icon: React.ElementType
  iconColor?: string
  gradient?: string
  className?: string
}

const BentoActionCard = ({
  name,
  description,
  href,
  Icon,
  iconColor = "text-primary",
  gradient = "from-primary/20 via-primary/5",
  className,
}: BentoActionCardProps) => (
  <Link
    href={href}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-xl",
      // Base styles
      "bg-card border transition-all duration-300",
      // Hover effects
      "hover:shadow-lg hover:border-primary/50 hover:scale-[1.02]",
      // Padding responsive
      "p-3 sm:p-4 md:p-5 lg:p-6",
      className
    )}
  >
    {/* Gradient Background */}
    <div
      className={cn(
        "absolute inset-0 bg-gradient-to-br to-transparent opacity-60 group-hover:opacity-80 transition-opacity",
        gradient
      )}
    />

    {/* Icon */}
    <div className="relative z-10">
      <Icon
        className={cn(
          "h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-11 lg:w-11 xl:h-12 xl:w-12",
          "transition-transform duration-300 group-hover:scale-110",
          iconColor
        )}
      />
    </div>

    {/* Text Content */}
    <div className="relative z-10 mt-auto">
      <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl leading-tight">
        {name}
      </h3>
      <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2 mt-0.5 md:mt-1">
        {description}
      </p>
    </div>

    {/* Hover overlay */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.02] group-hover:dark:bg-white/[.02]" />
  </Link>
)

export { BentoCard, BentoGrid, BentoActionCard }
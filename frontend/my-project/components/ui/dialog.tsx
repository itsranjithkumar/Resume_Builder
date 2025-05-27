import * as React from "react"
import * as RadixDialog from "@radix-ui/react-dialog"

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger
export const DialogPortal = RadixDialog.Portal
export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={
      "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" +
      (className ? " " + className : "")
    }
    {...props}
  />
))
DialogOverlay.displayName = RadixDialog.Overlay.displayName

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <RadixDialog.Content
      ref={ref}
      className={
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg" +
        (className ? " " + className : "")
      }
      {...props}
    >
      {children}
    </RadixDialog.Content>
  </DialogPortal>
))
DialogContent.displayName = RadixDialog.Content.displayName

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={"flex flex-col space-y-1.5 text-center sm:text-left" + (className ? " " + className : "") } {...props} />
)
DialogHeader.displayName = "DialogHeader"

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2" + (className ? " " + className : "") } {...props} />
)
DialogFooter.displayName = "DialogFooter"

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={"text-lg font-semibold leading-none tracking-tight" + (className ? " " + className : "")}
    {...props}
  />
))
DialogTitle.displayName = RadixDialog.Title.displayName

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={"text-sm text-gray-500" + (className ? " " + className : "")}
    {...props}
  />
))
DialogDescription.displayName = RadixDialog.Description.displayName

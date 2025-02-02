import { PropsWithChildren, ReactNode, MouseEvent, MouseEventHandler } from "react"

export type ButtonStyle = "minimal" | "light" | "normal"

export interface ButtonProps extends PropsWithChildren {
  link?: string | { href: string;[key: string]: any }
  isLoading?: boolean
  content?: ReactNode
  icon?: ReactNode
  iconPosition?: "left" | "right"
  suppressHydrationWarning?: boolean
  iconClass?: string
  svgIcon?: ReactNode
  className?: string
  color?: string
  styled?: ButtonStyle
  pill?: boolean
  isActive?: boolean
  joined?: boolean // Group
  vertical?: boolean // Group
  outline?: boolean
  textOnHover?: string | { text: string;[key: string]: any }
  dropdown?: { [key: string]: any }
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  noUnderline?: boolean
  display?: "flex" | "inline-flex" | "block" | "inline-block"
  position?: "relative" | "fixed" | "static" | "absolute"
  justify?: "center" | "between" | "around" | "start" | "end"
  margin?: string
  useCursorPointer?: boolean
  disabled?: boolean
  disabledTooltip?: ReactNode
  buttons?: null
  onClick?: (ev: MouseEvent<HTMLButtonElement>) => any
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>
}

type ButtonGroupBaseProps = Omit<ButtonProps, "onClick" | "content" | "className" | "buttons"> & PropsWithChildren
export interface ButtonGroupProps extends ButtonGroupBaseProps {
  buttons: (ButtonProps & { popover?: ReactNode; popoverProps?: Partial<Omit<PopoverProps, "button">> })[]
  joined?: boolean
  className?: {
    group?: string
    button?: string
  }
  vertical?: boolean
  align?: "left" | "right" | "center"
  action?: ButtonProps | undefined
}

export interface PopoverButton extends ButtonProps {
  closePopover: boolean
  onClick?: (ev: any) => boolean
}

export interface PopoverProps extends PropsWithChildren {
  trigger: ButtonProps
  className?: {
    trigger?: string
    wrapper?: string
    panel?: string
    buttons?: string
  }
  hover?: boolean
  closeButton?: boolean | PopoverButton
  buttons?: PopoverButton[]
  buttonGroup?: Partial<ButtonGroupProps>
  placement?: "left" | "right" | "bottom" | "top"
  disabled?: boolean
  arrow?: boolean
  onOpen?: () => void
  onClose?: () => void
}

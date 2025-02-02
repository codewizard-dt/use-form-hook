import React, { ForwardedRef, forwardRef, MouseEventHandler, ReactNode } from "react"
import { ButtonProps } from "../types/ButtonTypes"

export type ButtonStyle = "minimal" | "light"

export const Button = forwardRef(
  (
    {
      onClick,
      link,
      icon,
      iconPosition = "left",
      iconClass,
      svgIcon,
      className = "",
      content,
      isActive,
      color = "primary",
      styled,
      display = "inline-flex",
      position = "relative",
      textOnHover,
      isLoading,
      dropdown,
      margin,
      joined,
      vertical,
      noUnderline,
      outline = false,
      pill,
      disabled,
      useCursorPointer,
      children,
      onMouseEnter,
      onMouseLeave,
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement | null>
  ) => {
    const iconOnly = (icon !== undefined || svgIcon !== undefined) && content === undefined && children === undefined

    const getIcon = (): ReactNode => {
      if (svgIcon) return svgIcon
      return icon || null

    }

    if (typeof link === "string") {
      link = { href: link }
    }


    const handleClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
      if (isLoading || disabled) return
      if (onClick) onClick(ev)
    }


    const buttonContent = (
      <>
        {(icon || svgIcon) && iconPosition === "left" && getIcon()}
        {content}
        {children}
        {(icon || svgIcon) && iconPosition === "right" && getIcon()}
      </>
    )

    if (link) {
      return (
        <a {...link}>
          <button onClick={handleClick} className={className} disabled={disabled || isLoading} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={ref}>
            {buttonContent}
          </button>
        </a>
      )
    }

    return (
      <button onClick={handleClick} className={className} disabled={disabled || isLoading} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={ref}>
        {buttonContent}
      </button>
    )
  }
)

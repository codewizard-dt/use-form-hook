/**
 * NOTE: this import must be from ../ui/Button_2 and NOT just ../ui
 * Otherwise this component will break due to import order
 */

import React, { PropsWithChildren, ReactNode } from "react"
import { ButtonProps } from "../types/ButtonTypes"
import { Button } from "./Button"

type MessageType = "error" | "success" | "grey" | "warning"

// export const Message = () => {
//   return <></>
// }

export interface MessageProps extends PropsWithChildren {
  id?: string
  type?: MessageType
  content?: ReactNode
  fadeOut?: boolean
  icon?: ReactNode
  iconPlacement?: "left" | "right"
  button?: ButtonProps
  useFade?: boolean
  className?: {
    wrapper?: string
    content?: string
    removeIcon?: string
  }
  onClick?: () => void
  remove?: () => void
}

export const Message = ({ type, icon, iconPlacement = "left", content, button, fadeOut, useFade = true, className = {}, remove, children, onClick }: MessageProps) => {
  return (
    <div
      onClick={onClick}
      className={className.wrapper}
      role="alert"
    >
      {iconPlacement === "left" && icon || null}
      <div
        className={className.content || "flex flex-col gap-1"}
      >
        {content}
        {children}
        {button && (
          <div>
            <Button color="grey" {...button} />
          </div>
        )}
      </div>
      {iconPlacement === "right" && icon || null}
      {remove && (
        <button
          onClick={remove}
          className={className.removeIcon || "cursor-pointer relative inline-block h-5 shrink-0"}
          aria-label="Close message"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  )
}

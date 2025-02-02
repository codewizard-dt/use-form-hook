import React from "react"
import { ButtonGroupProps } from "../types/ButtonTypes"
import { Button } from "./Button"

export const ButtonGroup = ({ buttons, joined, className = {}, vertical, action, children, align = "left", ...sharedProps }: ButtonGroupProps) => {

  return (
    <div className={className.group}>
      {children}
      {buttons &&
        buttons.map(({ className: _className, popover, popoverProps, ...button }, i) =>

          <Button key={i} className={_className || className.button} joined={joined} vertical={vertical} {...sharedProps} {...button} />

        )}
    </div>
  )
}

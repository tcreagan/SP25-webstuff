//gpt 
//review
//guides for alignment to other widgets
//figure out where isCloseEnough function is supposed to come from
export function checkHorizontalAlignment(widget1: WidgetPosition, widget2: WidgetPosition): boolean {
  return isCloseEnough(widget1.left, widget2.left) || isCloseEnough(widget1.right, widget2.right) || isCloseEnough((widget1.left + widget1.right) / 2, (widget2.left + widget2.right) / 2);
}

export function checkVerticalAlignment(widget1: WidgetPosition, widget2: WidgetPosition): boolean {
  return isCloseEnough(widget1.top, widget2.top) || isCloseEnough(widget1.bottom, widget2.bottom) || isCloseEnough((widget1.top + widget1.bottom) / 2, (widget2.top + widget2.bottom) / 2);
}


export const onKeyUp = (ev) => {
  if(ev.key === 'Enter') {

    const tabElements = Array.from(ev.currentTarget.parentNode.parentNode
      // Get all elements that can be focusable
      .querySelectorAll('a, button, input, textarea, select, details, [tabindex]'))

      // remove any that have a tabIndex of -1
      .filter(element => element.tabIndex > -1)

      // split elements into two arrays, explicit tabIndexs and implicit ones
      .reduce((prev, next) => {
        return next.tabIndex > 0
          ? [[...prev[0], next].sort((a, b) => a.tabIndex > b.tabIndex ? -1 : 1), prev[1]]
          : [prev[0], [...prev[1], next]];
      }, [[], []])

      // flatten the two-dimensional array
      .flatMap(element => element);

    // find the current index in the tab list of the currently focused element
    const currentIndex = tabElements.findIndex(e => e === ev.target);
    // get the next element in the list ("%" will loop the index around to 0)
    const nextIndex = (currentIndex + 1) % tabElements.length;
    tabElements[nextIndex].focus();
    tabElements[nextIndex].select();
    ev.defaultMuiPrevented = true;
  }
};

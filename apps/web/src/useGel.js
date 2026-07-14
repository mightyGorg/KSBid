import { useEffect, useRef } from "react";

/**
 * Initialise a GEL interactive component after the element mounts.
 *
 * Usage:
 *   const ref = useGel("Accordion");
 *   return <div ref={ref}>...</div>;
 *
 * Available components: Accordion, ActionDialog, Card, Carousel, Comments,
 *   DataTable, Filter, InfoPanel, Masthead, Pocket, Search, SiteMenu,
 *   Switch, Tabs, Validation, Video
 */
export function useGel(componentName) {
  const ref = useRef(null);

  useEffect(() => {
    const gel = window.gel;
    if (!gel) return;
    const component = gel[componentName];
    if (!component) {
      console.warn(`window.gel.${componentName} not found`);
      return;
    }
    if (typeof component.init === "function" && ref.current) {
      component.init(ref.current);
    }
  }, [componentName]);

  return ref;
}

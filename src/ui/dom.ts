type Child = Node | string;

export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  ...children: Child[]
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  children.forEach((child) =>
    node.append(typeof child === 'string' ? document.createTextNode(child) : child)
  );
  return node;
};

export const setAttrs = <E extends HTMLElement>(
  node: E,
  attrs: Record<string, string | number | boolean>
): E => {
  Object.entries(attrs).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      if (value) node.setAttribute(key, '');
      else node.removeAttribute(key);
    } else {
      node.setAttribute(key, String(value));
    }
  });
  return node;
};

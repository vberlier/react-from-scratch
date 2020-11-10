const createElement = (type, attrs, ...children) => ({
  type,
  props: { ...attrs, children },
});

export default { createElement };

let current;

const createInstance = (component, props) => ({
  hooks: [],
  mount(parent) {
    this.parent = parent;
    this.update();
  },
  update() {
    const previous = current;
    current = this;

    this.index = 0;

    try {
      const vdom = component(props);
      const [node] = render(vdom, this.parent);

      if (this.node) {
        this.parent.replaceChild(node, this.node);
      }

      this.node = node;
    } finally {
      current = previous;
    }
  },
});

const createHook = (fn) => (...args) => {
  let hook = current.hooks[current.index++];

  if (!hook) {
    hook = fn.apply(current, args);
    current.hooks.push(hook);
  }

  return hook;
};

export const useState = createHook(function (initial) {
  const state = [
    initial,
    (value) => {
      state[0] = value;
      this.update();
    },
  ];
  return state;
});

export const render = (vdom, parent) => {
  if (Array.isArray(vdom)) {
    return vdom.flatMap((item) => render(item, parent));
  }

  if (typeof vdom === 'object') {
    if (typeof vdom.type === 'function') {
      const instance = createInstance(vdom.type, vdom.props);
      instance.mount(parent);
      return [instance.node];
    }

    const { children, ...attrs } = vdom.props;
    const node = document.createElement(vdom.type);

    for (const [attr, value] of Object.entries(attrs)) {
      if (attr.startsWith('on') && typeof value === 'function') {
        const event = attr.substring(2).toLowerCase();
        node.addEventListener(event, value);
      } else {
        node.setAttribute(attr, value);
      }
    }

    render(children, node);
    parent.appendChild(node);

    return [node];
  }

  if (vdom === false || vdom === null || vdom === undefined) {
    return [];
  }

  const node = document.createTextNode(vdom.toString());
  parent.appendChild(node);
  return [node];
};

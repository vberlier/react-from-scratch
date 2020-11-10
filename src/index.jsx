import React, { useState, render } from './react';

const ShoppingList = ({ items }) => {
  return (
    <ul>
      {items.map((item) => (
        <li>
          <Counter />
          {item}
        </li>
      ))}
    </ul>
  );
};

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <span>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </span>
  );
};

const vdom = (
  <div>
    <ShoppingList items={['pizza', 'cake']} />
    <button onClick={() => alert('toto')}>Click me!</button>
  </div>
);

render(vdom, document.getElementById('app'));

console.log(vdom);

🔹 1. Using React.FC<Props>
import React from "react";

type HomeProps = {
  title: string;
  count?: number; // optional prop
};

const Home: React.FC<HomeProps> = ({ title, count }) => {
  return (
    <div>
      <h1>{title}</h1>
      {count && <p>You have {count} new messages.</p>}
    </div>
  );
};

export default Home;


✅ Notes:

HomeProps defines the props.

React.FC<HomeProps> automatically includes children, so you could also do:

<Home title="Dashboard">Some nested content</Home>


even if you didn’t add children in HomeProps.

🔹 2. Using explicit return type (JSX.Element)
import React from "react";

type HomeProps = {
  title: string;
  count?: number;
};

const Home = ({ title, count }: HomeProps): JSX.Element => {
  return (
    <div>
      <h1>{title}</h1>
      {count && <p>You have {count} new messages.</p>}
    </div>
  );
};

export default Home;


✅ Notes:

Here, children is not included by default — if you want it, you must add it to HomeProps.

This style is preferred by some teams for stricter typing (no “hidden” children).

🔹 Which should you use?

React.FC style → shorter, convenient if you often want children.

Explicit JSX.Element style → stricter, no surprise children prop, more explicit control.

Both are equally valid in React + TypeScript.
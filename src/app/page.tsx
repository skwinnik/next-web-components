import { HelloWorld } from "@/src/components/hello-world";

export default function Home() {
  return (
    <div>
      <p className="paragraph">
        This page is rendered by Next.js and the button below is rendered as a
        React Component.
      </p>

      <br />
      <div className="flex">
        <div className="col-left">
          <HelloWorld />
        </div>
        <div className="col-right">
          <pre className="code">{`
export default function Home() {
  return (
      ...
      <HelloWorld />
      ...
   );
}
`}</pre>
        </div>
      </div>
      <p className="paragraph">
        <a href="/hello-world.html">
          Now, let&#39;s see how this component can be used as a Web Component.
        </a>
      </p>
    </div>
  );
}

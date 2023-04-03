"use client";
import { useState } from "react";
import style from "./index.module.css";

export function HelloWorld() {
  const [count, setCount] = useState(0);
  const messages = ["Hello", "Hi", "Hey", "Hola", "Bonjour", "Ciao", "Aloha"];
  return (
    <div className={style.root}>
      <button
        className={style.actionBtn}
        type="button"
        onClick={() => setCount(count + 1)}
      >
        Say Hi
      </button>
      <br />
      <br />
      {messages.slice(0, count).map((message, index) => (
        <p className={style.hello} key={index}>
          {message}
        </p>
      ))}
      <br />
      {count > messages.length && (
        <picture>
          <img
            className={style.stopIt}
            src="/stop-get-some-help.gif"
            alt="stop it!"
          />
        </picture>
      )}
    </div>
  );
}

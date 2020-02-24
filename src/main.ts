import { Main } from "./app/app";

const size = Math.min(window.innerHeight, window.innerWidth, 800);

const main = new Main(document.body, size, size);

import * as PIXI from "pixi.js";
import { Stack } from "./util/stack";
import { State } from "./util/state";
import { Game } from "./game";

export class Main {
	private app: PIXI.Application;
	private mainStack: Stack<State>;
	private interactionManager: PIXI.interaction.InteractionManager;

	constructor(parent: HTMLElement, width: number, height: number) {
		this.mainStack = new Stack<State>();
		this.app = new PIXI.Application({
			width,
			height,
			backgroundColor: 0xd0d0d0,
			antialias: true
		});
		this.interactionManager = new PIXI.interaction.InteractionManager(
			this.app.renderer
		);
		parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR

		this.app.ticker.add(delta => this.update(delta));
		this.mainStack.push(
			new Game(this.app.renderer, this.app.stage, this.interactionManager)
		);
	}

	update(delta) {
		this.mainStack.peek().update(delta);
		this.render(delta);
	}

	render(delta) {
		this.mainStack.peek().render(delta);
	}
}

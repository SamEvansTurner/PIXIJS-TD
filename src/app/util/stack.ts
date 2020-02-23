export class Stack<Type> {
	stack = [];
	constructor() {
		this.stack = [];
	}

	length() {
		return this.stack.length;
	}

	push(item: Type) {
		this.stack.push(item);
	}

	pop() {
		if (this.stack.length > 0) {
			return this.stack.pop();
		} else {
			return null;
		}
	}

	peek() {
		if (this.stack.length > 0) {
			return this.stack.slice(-1)[0];
		} else {
			return null;
		}
	}
}

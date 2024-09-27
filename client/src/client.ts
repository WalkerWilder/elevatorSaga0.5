export enum gameEvents {
	update = "update",
}

export enum objectTypes {
	elevator = "elevator",
	floor = "floor",
}

export enum directions {
	up = "up",
	down = "down",
	stopped = "stopped",
}

export enum elevatorEvents {
	idle = "idle",
	floorButtonPressed = "floor_button_pressed",
	passingFloor = "passing_floor",
	stoppedAtFloor = "stopped_at_floor",
}

interface idle {
	(): void;
}
interface floorButtonPressed {
	(floorNum: number): void;
}
interface passingFloor {
	(floorNum: number, direction: directions): void;
}
interface stoppedAtFloor {
	(floorNum: number): void;
}

interface elevator {
	id: number;
	goToFloor: (floor: number, immediate?: boolean) => void;
	stop: () => void;
	currentFloor: () => number;
	goingUpIndicator: (enable?: boolean) => boolean;
	goingDownIndicator: (enable?: boolean) => boolean;
	maxPassengerCount: () => number;
	loadFactor: () => number;
	destinationDirection: () => directions;
	destinationQueue: number[];
	checkDestinationQueue: () => void;
	getPressedFloors: () => number[];
	on: (
		event: elevatorEvents,
		f: idle | floorButtonPressed | passingFloor | stoppedAtFloor
	) => void;
}

export enum floorButtons {
	up = "up",
	down = "down",
}

export enum floorEvents {
	upButtonPressed = "up_button_pressed",
	downButtonPressed = "down_button_pressed",
}

interface floor {
	id: number;
	floorNum: () => number;
	on: (event: floorEvents, f: () => void) => void;
}

const clientCode = {
	init: async function (elevators: elevator[], floors: floor[]) {
		elevators.forEach((elevator, i) => {
			elevator.id = i;
			// elevator.on(elevatorEvents.idle, () => this.elevatorEventIdle(i));
			// elevator.on(elevatorEvents.floorButtonPressed, (floorNum: number) =>
			// 	this.elevatorEventFloorButtonPressed(i, floorNum)
			// );
			// elevator.on(
			// 	elevatorEvents.passingFloor,
			// 	(floorNum: number, direction: directions) =>
			// 		this.elevatorEventPassingFloor(i, floorNum, direction)
			// );
			// elevator.on(elevatorEvents.stoppedAtFloor, (floorNum: number) =>
			// 	this.elevatorEventStoppedAtFloor(i, floorNum)
			// );
		});

		floors.forEach((floor) => {
			floor.id = floor.floorNum();
			// floor.on(floorEvents.upButtonPressed, () =>
			// 	this.floorEventButtonPressed(floor.floorNum(), floorButtons.up)
			// );
			// floor.on(floorEvents.upButtonPressed, () =>
			// 	this.floorEventButtonPressed(floor.floorNum(), floorButtons.down)
			// );
		});

		await this.connect();
		await this.sendObjectState(elevators, floors);
	},
	connect: async function () {
		const wsUrl = "ws://localhost:9000?id=asdf";
		this.socket = new WebSocket(wsUrl);
		this.socket.onopen = () => {
			console.log("open");
		};
	},
	elevatorEventIdle: async function (id: number) {
		return this.sendEvent(objectTypes.elevator, id, "idle");
	},
	elevatorEventFloorButtonPressed: async function (
		id: number,
		floorNum: number
	) {
		return this.sendEvent(objectTypes.elevator, id, "floorButtonPressed", {
			floorNum,
		});
	},
	elevatorEventPassingFloor: async function (
		id: number,
		floorNum: number,
		direction: string
	) {
		return this.sendEvent(objectTypes.elevator, id, "passingFloor", {
			floorNum,
			direction,
		});
	},
	elevatorEventStoppedAtFloor: async function (id: number, floorNum: number) {
		return this.sendEvent(objectTypes.elevator, id, "stoppedAtFloor", {
			floorNum,
		});
	},
	floorEventButtonPressed: async function (id: number, button: string) {
		return this.sendEvent(objectTypes.floor, id, "buttonPressed", {
			button,
		});
	},
	messageServer: async function (
		type: string,
		id: number,
		event: string,
		data?: object
	) {
		if (this.socket?.readyState === 1) {
				const message = { type, id, event, ...data };
				return this.socket?.send(JSON.stringify(message));
		}
		const apiUrl = `http://localhost:9000/${type}/${id}/${event}`;
		fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
	},
	sendEvent: async function (
		type: objectTypes,
		n: number,
		event: string,
		data?: object
	) {
		return this.messageServer(type, n, event, data);
	},
	sendObjectState: function (elevators: elevator[], floors: floor[]) {
		const idObj = { type: "game", event: gameEvents.update, id: 0 };
		const url = `game/${gameEvents.update}`;
		return this.messageServer("game", 0, gameEvents.update, {
			elevators,
			floors,
		});
	},
	socket: null as null | WebSocket,
	update: function (dt: number, elevators: elevator[], floors: floor[]) {
		// this.sendObjectState(elevators, floors);
	},
};

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

export enum floorEvents {
	upButtonPressed = "up_button_pressed",
	downButtonPressed = "down_button_pressed",
}

interface floor {
	floorNum: () => number;
	on: (event: floorEvents, f: () => void) => void;
}

const clientCode = {
	init: async function (elevators: elevator[], floors: floor[]) {
		elevators.forEach((elevator, i) => {
			elevator.id = i;
			elevator.on(elevatorEvents.idle, () => {
				elevator.goToFloor(0);
				elevator.goToFloor(1);
				elevator.goToFloor(2);
			});
		});

		await this.connect();
		await this.sendObjectState(elevators, floors);
	},
	connect: async function () {
		const wsUrl = "ws://localhost:9000";
		this.socket = new WebSocket(wsUrl);
		this.socket.addEventListener("open", this.setWsConnected);
		this.socket.addEventListener("close", this.setWsDisconnected);
	},
	sendObjectState: function (elevators: elevator[], floors: floor[]) {
		if (this.wsConnected) {
			return this.sendObjectStateWs(elevators, floors);
		}
		return this.sendObjectStateApi(elevators, floors);
	},
	sendObjectStateApi: async function (elevators: elevator[], floors: floor[]) {
		const apiUrl = "http://localhost:9000/gameUpdate";
		const data = { type: "objectState", elevators, floors };
		fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
	},
	sendObjectStateWs: async function (elevators: elevator[], floors: floor[]) {
		this.socket?.send({ type: "objectState", elevators, floors } as any);
	},
	setWsConnected: function () {
		this.wsConnected = true;
	},
	setWsDisconnected: function () {
		this.wsConnected = false;
	},
	socket: null as null | WebSocket,
	update: function (dt: number, elevators: elevator[], floors: floor[]) {
		// this.sendObjectState(elevators, floors);
	},
	wsConnected: false,
};

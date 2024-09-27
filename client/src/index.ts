import * as fs from "fs";
import * as path from "path";
import {
	directions,
	elevatorEvents,
	floorButtons,
	floorEvents,
	gameEvents,
	objectTypes,
} from "./client";

const inputFilePath = path.join(__dirname, "client.js");
const outputFilePath = path.join(__dirname, "../rawClient.txt");

const processedEnums = {
	directions,
	elevatorEvents,
	floorButtons,
	floorEvents,
	gameEvents,
	objectTypes,
};

function extractClientCode(content: string): string | null {
	const clientCodeMatch = content.match(
		/const\s+clientCode\s*=\s*({[\s\S]*?});\s*$/
	);

	if (clientCodeMatch && clientCodeMatch[1]) {
		return clientCodeMatch[1];
	}

	return null;
}

function replaceEnumValues(
	code: string,
	enumName: string,
	enumObj: any
): string {
	const regex = new RegExp(`${enumName}\\.\\w+`, "g");

	return code.replace(regex, (match) => {
		const memberName = match.split(".")[1];
		const value = enumObj[memberName];
		return value ? `"${value}"` : match;
	});
}

fs.readFile(inputFilePath, "utf8", (err, data) => {
	if (err) {
		console.error("Found an issue trying to read source:", err);
		return;
	}

	const clientCodeValue = extractClientCode(data);

	if (clientCodeValue) {
		let code = clientCodeValue;

		Object.entries(processedEnums).forEach(([enumName, enumObj]) => {
			code = replaceEnumValues(code, enumName, enumObj);
		});

		fs.writeFile(outputFilePath, code, "utf8", (err) => {
			if (err) {
				console.error("Found an issue while trying to write:", err);
				return;
			}
		});
	} else {
		console.error("Invalid format, clientCode not found");
	}
});

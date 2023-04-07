import { isEqual } from "lodash";

export interface Point {
    x: number;
    y: number;
}
export interface Line {
    start: Point;
    end: Point;
}
export interface StateUpdate {
    newLine: Line | null;
    heading: string | null;
    message: string | null;
}
export interface GameStatus {
    msg: string;
    body: StateUpdate | Point | string;
}

export function isPointOnLine(point: Point, line: Line): boolean {
    const { start, end } = line;
    const { x: px, y: py } = point;

    const lineLength = Math.sqrt(
        (end.x - start.x) ** 2 + (end.y - start.y) ** 2
    );
    const distToStart = Math.sqrt((px - start.x) ** 2 + (py - start.y) ** 2);
    const distToEnd = Math.sqrt((px - end.x) ** 2 + (py - end.y) ** 2);

    // Check if the point is within a certain tolerance distance to the line
    const tolerance = 0.0001;
    return Math.abs(distToStart + distToEnd - lineLength) < tolerance;
}

export function checkCross(line1: Line, line2: Line): boolean {
    const {
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 },
    } = line1;
    const {
        start: { x: x3, y: y3 },
        end: { x: x4, y: y4 },
    } = line2;

    const det = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (det === 0) {
        // lines are parallel, check if they share a common part
        if (isPointOnLine(line2.end, line1)) {
            return true;
        } else {
            // lines do not share a common part and are therefore parallel and non-intersecting
            return false;
        }
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / det;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / det;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        const x = x1 + t * (x2 - x1);
        const y = y1 + t * (y2 - y1);
        const intersectPoint = { x, y };
        if (isEqual(intersectPoint, line2.start)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false; // lines do not intersect
    }
}

export default class Game {
    private lines: Line[] = [];
    private startPoint: Point | null = null;
    private isFirstPlayer: boolean = true;
    status: GameStatus = {
        msg: "INITIALIZE",
        body: {
            newLine: null,
            heading: this.heading,
            message: "Awaiting Player 1's Move",
        },
    };

    private get heading() {
        return this.isFirstPlayer ? "Player 1" : "Player 2";
    }

    clickPoint(point: Point) {
        if (!this.startPoint) {
            this.trySetStartNode(point);
        } else {
            this.tryAddLine({ start: this.startPoint, end: point });
        }
    }

    validateNode(node: Node) {
        return true;
    }

    trySetStartNode(point: Point) {
        if (this.startPoint) {
            throw new Error();
        }
        if (this.lines.length === 0) {
            this.startPoint = point;
        } else {
            const startEdge = this.lines[0].start;
            const endEdge = this.lines[this.lines.length - 1].end;
            if (isEqual(point, startEdge) || isEqual(point, endEdge)) {
                this.startPoint = point;
            }
        }
        if (this.startPoint) {
            this.status = {
                msg: "VALID_START_NODE",
                body: {
                    newLine: null,
                    heading: this.heading,
                    message: "Select a second node to complete the line.",
                },
            };
        } else {
            this.status = {
                msg: "INVALID_START_NODE",
                body: {
                    newLine: null,
                    heading: this.heading,
                    message: "Not a valid starting position.",
                },
            };
        }
    }

    checkNextLine(nextLine: Line) {
        let isValidNextLine = false;
        if (
            !isEqual(nextLine.start, nextLine.end) &&
            (nextLine.start.x === nextLine.end.x ||
                nextLine.start.y === nextLine.end.y ||
                Math.abs(nextLine.end.x - nextLine.start.x) ===
                    Math.abs(nextLine.end.y - nextLine.start.y))
        ) {
            isValidNextLine = true;
            for (const line of this.lines) {
                if (checkCross(line, nextLine)) {
                    isValidNextLine = false;
                    break;
                }
            }
        }
        return isValidNextLine;
    }

    tryAddLine(nextLine: Line) {
        if (this.checkNextLine(nextLine)) {
            this.lines.push(nextLine);
            this.startPoint = null;
            if (this.checkGameOver()) {
                this.status = {
                    msg: "GAME_OVER",
                    body: {
                        newLine: nextLine,
                        heading: "Game Over",
                        message: `${this.heading} Wins!`,
                    },
                };
            } else {
                this.isFirstPlayer = !this.isFirstPlayer;
                this.status = {
                    msg: "VALID_END_NODE",
                    body: {
                        newLine: nextLine,
                        heading: this.heading,
                        message: null,
                    },
                };
            }
        } else {
            this.startPoint = null;
            this.status = {
                msg: "INVALID_END_NODE",
                body: {
                    newLine: null,
                    heading: this.heading,
                    message: "Invalid move!",
                },
            };
        }
    }

    checkGameOver() {
        const startEdge = this.lines[0].start;
        const endEdge = this.lines[this.lines.length - 1].end;
        for (let x = 0; x < 4; x += 1) {
            for (let y = 0; y < 4; y += 1) {
                if (
                    this.checkNextLine({ start: startEdge, end: { x, y } }) ||
                    this.checkNextLine({ start: endEdge, end: { x, y } })
                ) {
                    return false;
                }
            }
        }
        return true;
    }
}

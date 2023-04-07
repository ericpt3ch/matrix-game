import { checkCross, isPointOnLine } from "./game";

describe("game logic", () => {
    describe("check point on line", () => {
        it("point on horizontal line", () => {
            const line = { start: { x: 1, y: 1 }, end: { x: 1, y: 3 } };
            expect(isPointOnLine({ x: 1, y: 2 }, line)).toBeTruthy();
            expect(isPointOnLine({ x: 1, y: 4 }, line)).toBeFalsy();
            expect(isPointOnLine({ x: 2, y: 2 }, line)).toBeFalsy();
        });

        it("point on vertical line", () => {
            const line = { start: { x: 1, y: 1 }, end: { x: 3, y: 1 } };
            expect(isPointOnLine({ x: 2, y: 1 }, line)).toBeTruthy();
            expect(isPointOnLine({ x: 4, y: 2 }, line)).toBeFalsy();
            expect(isPointOnLine({ x: 2, y: 2 }, line)).toBeFalsy();
        });

        it("point on octilinear line", () => {
            const line = { start: { x: 1, y: 1 }, end: { x: 3, y: 3 } };
            expect(isPointOnLine({ x: 2, y: 2 }, line)).toBeTruthy();
            expect(isPointOnLine({ x: 1, y: 2 }, line)).toBeFalsy();
            expect(isPointOnLine({ x: 4, y: 4 }, line)).toBeFalsy();
        });
    });

    describe("check crossed lines", () => {
        it("vertical and horizontal lines", () => {
            const line1 = { start: { x: 1, y: 2 }, end: { x: 3, y: 2 } };
            const line2 = { start: { x: 2, y: 1 }, end: { x: 2, y: 4 } };
            const line3 = { start: { x: 4, y: 1 }, end: { x: 4, y: 4 } };
            expect(checkCross(line1, line2)).toBeTruthy();
            expect(checkCross(line1, line3)).toBeFalsy();
        });

        it("two octilinear lines", () => {
            const line1 = { start: { x: 1, y: 1 }, end: { x: 2, y: 2 } };
            const line2 = { start: { x: 1, y: 2 }, end: { x: 2, y: 1 } };
            const line3 = { start: { x: 1, y: 2 }, end: { x: 2, y: 3 } };
            expect(checkCross(line1, line2)).toBeTruthy();
            expect(checkCross(line1, line3)).toBeFalsy();
        });

        it("joint lines", () => {
            const line1 = { start: { x: 1, y: 1 }, end: { x: 2, y: 2 } };
            const line2 = { start: { x: 2, y: 2 }, end: { x: 2, y: 3 } };
            const line3 = { start: { x: 2, y: 3 }, end: { x: 2, y: 2 } };
            expect(checkCross(line1, line2)).toBeFalsy();
            expect(checkCross(line1, line3)).toBeTruthy();
        })

        it("horizontal lines share same part", () => {
            const line1 = { start: { x: 1, y: 1 }, end: { x: 1, y: 3 } };
            const line2 = { start: { x: 1, y: 3 }, end: { x: 1, y: 2 } };
            const line3 = { start: { x: 1, y: 3 }, end: { x: 1, y: 4 } };
            expect(checkCross(line1, line2)).toBeTruthy();
            expect(checkCross(line1, line3)).toBeFalsy();
        });

        it("octilinear lines share same part", () => {
            const line1 = { start: { x: 1, y: 1 }, end: { x: 3, y: 3 } };
            const line2 = { start: { x: 4, y: 4 }, end: { x: 2, y: 2 } };
            const line3 = { start: { x: 3, y: 3 }, end: { x: 4, y: 4 } };
            expect(checkCross(line1, line2)).toBeTruthy();
            expect(checkCross(line1, line3)).toBeFalsy();
        });
    });
});

// This file loads all the modules in order to mantain a consistent structure
// and avoid undefined errors

var GTE = (function () {
    "use strict";
    var GTE = {};
    GTE.UI = {};
    GTE.TREE = {};

    GTE.CONSTANTS = {
      CIRCLE_SIZE: 20,
      DIST_BETWEEN_LEVELS: 150,
      LINE_THICKNESS: 3,
      MAX_HORIZONTAL_DISTANCE_BW_NODES: 250,
      TEXT_NODE_MARGIN: 30
    };

    GTE.MODE = 0;
    GTE.MODES = {
      ADD: 0,
      DELETE: 1,
    };
    if (Object.freeze) {
      Object.freeze(GTE.MODES);
    }

    GTE.COLOURS = {
        AQUA: "#00FFFF",
        AZURE: "#F0FFFF",
        BEIGE: "#F5F5DC",
        BLACK: "#000000",
        BLUE: "#0000FF",
        BROWN: "#A52A2A",
        CYAN: "#00FFFF",
        DARKBLUE: "#00008B",
        DARKCYAN: "#008B8B",
        DARKGREY: "#A9A9A9",
        DARKGREEN: "#006400",
        DARKKHAKI: "#BDB76B",
        // DARKMAGENTA: "#8B008B",
        DARKOLIVEGREEN: "#556B2F",
        DARKORANGE: "#FF8C00",
        DARKORCHID: "#9932CC",
        DARKRED: "#8B0000",
        DARKSALMON: "#E9967A",
        DARKVIOLET: "#9400D3",
        FUCHSIA: "#FF00FF",
        GOLD: "#FFD700",
        GREEN: "#008000",
        INDIGO: "#4B0082",
        KHAKI: "#F0E68C",
        LIGHTBLUE: "#ADD8E6",
        LIGHTCYAN: "#E0FFFF",
        LIGHTGREEN: "#90EE90",
        LIGHTGREY: "#D3D3D3",
        LIGHTPINK: "#FFB6C1",
        // LIGHTYELLOW: "#FFFFE0",
        LIME: "#00FF00",
        MAGENTA: "#FF00FF",
        MAROON: "#800000",
        NAVY: "#000080",
        OLIVE: "#808000",
        ORANGE: "#FFA500",
        PINK: "#FFC0CB",
        PURPLE: "#800080",
        VIOLET: "#800080",
        RED: "#FF0000",
        SILVER: "#C0C0C0",
        // WHITE: "#FFFFFF",
        YELLOW: "#FFFF00"
    };
    if (Object.freeze) {
      Object.freeze(GTE.COLOURS);
    }

    GTE.PLAYERS = {
        DEFAULT_CHANCE_NAME: "Chance",
        DEFAULT_PLAYER_NAME: "Player"
    };

    return GTE;
}());

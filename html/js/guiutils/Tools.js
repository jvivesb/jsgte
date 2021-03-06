GTE.UI = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Tools object.
    * @class
    */
    function Tools() {
        this.activePlayer = -1;
    }

    /**
    * Function called when New button is pressed.
    * It creates a new Tree and draws it
    */
    Tools.prototype.newTree = function() {
        this.resetPlayers();
        this.activePlayer = -1;
        this.isetToolsRan = false;
        var root = new GTE.TREE.Node(null);
        var child1 = new GTE.TREE.Node(root);
        var child2 = new GTE.TREE.Node(root);
        GTE.tree = new GTE.TREE.Tree(root);

        this.addChancePlayer();
        this.addPlayer();
        this.addPlayer();

        // GTE.tree.updatePositions();
        // Create a node and draw it
        GTE.tree.draw();
        this.switchMode(GTE.MODES.ADD);
    };

    /**
    * Function that switches mode to the one specified by the button pressed
    * @param {Button} button Button pressed that will activate mode
    */
    Tools.prototype.switchMode = function(modeToSwitch){
        // Remove active class from current active button
        var activeButton = document.getElementsByClassName("active button")[0];
        if (activeButton !== undefined) {
            activeButton.className =
                activeButton.className.replace(/\bactive\b/,'');
        }

        // Change the class of the button to active
        var buttonToSwitch = "";
        switch (modeToSwitch) {
            case GTE.MODES.ADD:
                buttonToSwitch = "button-add";
                break;
            case GTE.MODES.DELETE:
                buttonToSwitch = "button-remove";
                break;
            case GTE.MODES.PLAYER_ASSIGNMENT:
                buttonToSwitch = "button-player-" + this.activePlayer;
                break;
            case GTE.MODES.MERGE:
                if (this.ableToSwitchToISetEditingMode()) {
                    buttonToSwitch = "button-merge";
                    // If iset tools have never been chosen
                    if (!this.isetToolsRan) {
                        // Assign singleton isets to each node with no iset
                        GTE.tree.initializeISets();
                        this.isetToolsRan = true;
                    }
                } else {
                    window.alert("Assign a player to every node first.");
                    return;
                }
                break;
            case GTE.MODES.DISSOLVE:
                if (this.ableToSwitchToISetEditingMode()) {
                    buttonToSwitch = "button-dissolve";
                } else {
                    window.alert("Assign a player to every node first.");
                    return;
                }
                break;
            default:
        }
        document.getElementById(buttonToSwitch).className += " " + "active";

        GTE.MODE = modeToSwitch;
        if (GTE.MODE === GTE.MODES.PLAYER_ASSIGNMENT ||
            GTE.MODE === GTE.MODES.MERGE ||
            GTE.MODE === GTE.MODES.DISSOLVE) {
            GTE.tree.hideLeaves();
        } else {
            GTE.tree.showLeaves();
        }

        if (GTE.MODE !== GTE.MODES.PLAYER_ASSIGNMENT) {
            this.activePlayer = -1;
        }
    };
    /**
    * Function that creates the strategic form and
    * renders the strategic form to the canvas
    */
    Tools.prototype.toStrategicForm = function () {
        GTE.tree.clear();
        GTE.tree.matrix = new GTE.TREE.Matrix();
        GTE.tree.matrix.initialise();
    };

    /**
    * Function that creates a strategic form independent 
    * of the game tree.
    */
    Tools.prototype.createStrategicForm = function (x, y) {
        GTE.tree.clear();
        GTE.tree.matrix = new GTE.TREE.Bimatrix();
        GTE.tree.matrix.initialise(x, y);
        GTE.tree.clear(); // TODO: THIS IS A BIT OF A HACK, WITHOUT IT WE GET OVERLAYED PAYOFFS
        GTE.tree.matrix.drawMatrix()
        console.log(GTE.tree.matrix);
    };

    /**
    * Function that creates a strategic form independent 
    * of the game tree.
    */
    Tools.prototype.createIndependentStrategicForm = function (x, y) {
        GTE.tree.clear();
        this.isetToolsRan = false;
        this.resetPlayers();
        this.activePlayer = -1;
        var root = new GTE.TREE.Node(null);
        GTE.tree = new GTE.TREE.Tree(root);
        this.addChancePlayer();
        this.addPlayer();
        this.addPlayer();
        root.assignPlayer(GTE.tree.players[1]);
        for(var i = 0; i<x; i++) {
            GTE.tree.addChildNodeTo(root);
            root.children[i].assignPlayer(GTE.tree.players[2]);
        }
        for(var i = 0; i<root.children.length; i++) {
            for(var j = 0; j<y; j++) {
                GTE.tree.addChildNodeTo(root.children[i]);
            }
        }
        GTE.tree.draw();
        this.switchMode(GTE.MODES.MERGE);
        GTE.tree.multiActionLines[0].onClick();
        GTE.tree.draw();
        this.switchMode(GTE.MODES.ADD);
        this.toStrategicForm();
        this.hidePlayerButtons();
    };

    Tools.prototype.hidePlayerButtons = function() {
        document.getElementById('button-player-0').style.display = 'none'
        document.getElementById('button-player-1').style.display = 'none'
        document.getElementById('button-player-2').style.display = 'none'
    }
    /**
    * Function that selects a player
    * @param {Player} player Player to be set as active
    */
    Tools.prototype.selectPlayer = function (player) {
        // Set player as active player and mode to PLAYERS mode
        this.activePlayer = player;
        this.switchMode(GTE.MODES.PLAYER_ASSIGNMENT);
    };

    /**
    * Handles player buttons onclicks
    * @param {Number|String} playerId Player to be selected
    */
    Tools.prototype.buttonPlayerHandler = function(playerId) {
        return function () {
            GTE.tools.selectPlayer(parseInt(playerId));
        };
    };

    /**
    * Function that adds a player button to the toolbar
    */
    Tools.prototype.addPlayer = function () {
        if (GTE.tree.numberOfPlayers() < GTE.CONSTANTS.MAX_PLAYERS) {
            // Create a new player
            var player = GTE.tree.newPlayer();
            if (player !== null) {
                if (player.id == GTE.CONSTANTS.MIN_PLAYERS + 1) {
                    document.getElementById("button-player-less").className =
                        document.getElementById("button-player-less").className
                                                    .replace(/\bdisabled\b/,'');
                }
                if (player.id == GTE.CONSTANTS.MAX_PLAYERS) {
                    document.getElementById("button-player-more")
                                                .className += " " + "disabled";
                }
                // Get the last player button
                var playerButtons = document.getElementById("player-buttons");
                var lastPlayer = playerButtons.lastElementChild;
                // Insert a new button after the last button
                lastPlayer.insertAdjacentHTML("afterend",
                    "<li><button style='color:"+ player.colour +
                    "' id='button-player-" + player.id +
                    "' class='button button--sacnite button--inverted button-player'" +
                    " alt='Player " + player.id +
                    "' title='Player " + player.id +
                    "' player='" + player.id +
                    "'><i class='icon-user'></i></button></li>");
                // Get the newly added button
                lastPlayer = playerButtons.lastElementChild;
                // And add a click event that will call the selectPlayer function
                lastPlayer.firstElementChild.addEventListener("click",
                                        this.buttonPlayerHandler(player.id));
            }
        }
    };

    Tools.prototype.addChancePlayer = function () {
        var player = GTE.tree.newPlayer(GTE.tools.getColour(0));
        if (player !== null) {
            var playerButtons = document.getElementById("player-buttons");
            playerButtons.innerHTML =
                "<li><button style='color:"+ player.colour +
                "' id='button-player-" + player.id +
                "' class='button button--sacnite button--inverted button-player'" +
                " alt='Chance player' title='Chance'" +
                "' player='" + player.id +
                "'><i class='icon-dice'></i></button></li>";
        }
    };


    /**
    * Function that removes last player from the Toolbar
    */
    Tools.prototype.removeLastPlayer = function () {
        if (GTE.tree.numberOfPlayers() > GTE.CONSTANTS.MIN_PLAYERS) {
            // Remove last player from the list of players
            var playerId = GTE.tree.removeLastPlayer();
            // Activate more players button again
            if (playerId == GTE.CONSTANTS.MAX_PLAYERS) {
                document.getElementById("button-player-more").className =
                    document.getElementById("button-player-more").className
                                                    .replace(/\bdisabled\b/,'');
            }
            // Remove button
            var playerButtons = document.getElementById("player-buttons");
            var lastPlayer = playerButtons.lastElementChild.lastElementChild;
            this.removePlayerButton(lastPlayer);
        }
    };

    /**
    * Returns the colour correspondent to a given index. It is used to get the
    * player colour. Player id would be the same as colourIndex
    * @param  {Number} colourIndex  Colour index in the list of colours
    * @return {Colour} colour       Colour hex code
    */
    Tools.prototype.getColour = function (colourIndex) {
        var colours = JSON.parse(GTE.STORAGE.settingsPlayersColours);
        return colours[colourIndex];
    };

    /**
    * Function that gets the active player (the player button that is selected)
    * @return {Player} activePlayer Currently selected player
    */
    Tools.prototype.getActivePlayer = function () {
        return this.activePlayer;
    };

    /**
    * Checks if it is possible to switch to information sets modes. This function is basically
    * a wrapper that checks that all nodes have a player assigned.
    * @return {Boolean} True if it is possible to switch to information set mode
    */
    Tools.prototype.ableToSwitchToISetEditingMode = function () {
        return GTE.tree.recursiveCheckAllNodesHavePlayer();
    };

    /**
    * Removes the player button from the toolbar
    * @param {Button} button Button HTML object to remove
    */
    Tools.prototype.removePlayerButton = function (button) {
        var playerId = parseInt(button.getAttribute("player"));
        // get the <li>
        var parent = button.parentNode;
        // remove the <li> from the <ul>
        parent.parentNode.removeChild(parent);
        // If there are only two players (Chance, Player 1),
        // disable the remove button
        if (playerId === GTE.CONSTANTS.MIN_PLAYERS + 1) {
            document.getElementById("button-player-less").className += " disabled";
        }
        // If the removed player was the active one, select the previous one
        if (playerId === this.activePlayer) {
            this.selectPlayer(this.activePlayer-1);
        }
    };

    /**
    * Removes all players from the toolbar
    */
    Tools.prototype.resetPlayers = function () {
        var buttons = document.getElementsByClassName("button-player");
        while(buttons.length > 2) {
            this.removePlayerButton(buttons[buttons.length-1]);
        }
    };

    Tools.prototype.changePlayerColour = function (playerId, colour) {
        var playerButton = document.getElementById("button-player-" + playerId);
        playerButton.style.color = colour;
    };

    /**
    *  Zooms out the canvas
    */
    Tools.prototype.zoomOut = function () {
        GTE.canvas.viewbox(0, 0, GTE.canvas.viewbox().width*1.2, GTE.canvas.viewbox().height*1.2);
    };

    Tools.prototype.parseMatrix = function (mat1, mat2) {
        mat1 = mat1.trim();
        mat2 = mat2.trim();
        mat1 = mat1.split("\n");
        mat2 = mat2.split("\n");
        if(mat1.length != mat2.length) {
            alert("The size of both matrices should be same");
            return false;
        }
        for(var i = 0;i<mat1.length; i++) {
            mat1[i] = mat1[i].trim();
            mat2[i] = mat2[i].trim();
            mat1[i] = mat1[i].split(" ");
            mat2[i] = mat2[i].split(" ");
        }
        var length = mat1[0].length;
        for(var i = 0;i<mat1.length; i++) {
            if(mat1[i].length != length || mat2[i].length != length) {
                alert("the length of matrices should be same");
                return false;
            }
        }
        var dim = [];
        dim.push(mat1.length, mat1[0].length);
        return dim;
    };

    // Add class to parent module
    parentModule.Tools = Tools;

    return parentModule;
}(GTE.UI)); // Add to GTE.UI sub-module

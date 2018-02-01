// Select color input
// Select size input

// When size is submitted by the user, call makeGrid()

// $("#flippy").mouseenter(this.toggleClass("flip"))
// $('#flippy').mouseleave($('#flippy').removeClass("flip"))
//
// let color="#000";
// let mouseState="up";
//
// $("#colorPicker").change(function (){color=$(this).val();})
//
//
// $("#sizePicker").children().last().click(
// function makeGrid() {
//   const h=$("#input_height").val();
//   const w=$("#input_width").val();
//   const t=$("#pixel_canvas");
//   let string="";
//   t.children().remove();
//   for(let r=0; r<h; r++)
//   {
//     string="<tr>";
//     for(let c=0; c<w; c++)
//     {
//       string+="<td></td>";
//     }
//     string+="</tr>";
//     t.append(string);
//   }
//   $("td").mousedown(function(){
//     $(this).attr("bgcolor",color);
//     mouseState="down"
//   });
//   t.mouseup(function(){mouseState="up"});
//   t.mouseleave(function(){mouseState="up"});
//   $("td").mouseover(function(){//)mouseover(function (){
//     if(mouseState==="down"){
//       $(this).attr("bgcolor",color);
//     }
//   });
// });

// Included are main characteristics for draving new cells
// Cell size is not included since is defined in advance and is also global variable
let characteristics = {
    // type: "", // "formatted" or "fashape" string value taken from const FORMATS..[0]
    activePalete: "", // active color palette Nr
    colorNr: "", //Color number in the palette selected 0..4
    color: "", //hex code taken from COLOR_PALETTES
    activeBgPalette: "",  //active bgColor palette
    bgColorNr:"", //BgColor number in the palette.
    bgColor: "", //hex number in the palette. Warning! representation in "mixie" is mirrored!
    dynamicStringId: "", //Used for formatting purposes /This is not only Nr but whole string/Id
    dynamicsString: "",
    formatArrayId:"format0", //initialize with initial value format0
    formatArray:"",
    // styleName: "", // used only for first 12 formats, when type:"formatted". Link to CSS styles cell-format-1..12
    // faString: "", //only string taken from FORMATS
    // faStringFull: "" //Generated <i> string to be put in cell - Size is also included although taken from cellSize(outside this object)
};


// Selectors all starts with 'select'
let selectRangeX = $('#range-x');
let selectRangeY = $('#range-y');

// Values and constants
let gridXmax = 20; //Maximum grid size alowed. Can be changed depending on cursor size
let gridYmax = 20; // Same as X ^
let gridX = 60;
let gridY = 50;
const CANVAS_X_SIZE_PX = 1500; //Used to calculate maximum horizontal cells depending of cell size
const CANVAS_Y_SIZE_PX = 800;  //Used to calculate maximum vertical cells depending of cell size
const table = $("#drawing-canvas");
const cell = (".cell");


// List of available color values
// selected from  http://www.color-hex.com/color-palettes/
// TODO adding 'erase' color e.g. no color ''- undefined is planned. Include them together with black, white and ?? ??
const COLOR_PALETTES = [
    //One color palettes
    ["#fffcb8", "#fffba7", "#fff988", "#fef65b", "#fbf028", "The Yellows of Dodie"],
    ["#fff100", "#ffdf00", "#ffce00", "#ffac00", "#ff9b00", "Demons Eye Orange"],
    ["#fdd3dc", "#fcbbc8", "#fba3b4", "#fa8aa0", "#f9728d", "on wednesdays we wear pink"],
    ["#ff8585", "#ff4747", "#ff0000", "#e30000", "#ba0000", "Blushing Reds"],
    ["#de97ec", "#ce8fd6", "#b589ce", "#9672c3", "#7d559f", "grapeness"],
    ["#f3eef8", "#e6dbf1", "#d9c9ea", "#ccb7e3", "#bfa4dc", "brumal lavender"],
    ["#dcfffc", "#acfdff", "#8ef6ff", "#67e8fb", "#31e3fd", "Summer sky blues"],
    ["#00e4ff", "#00b1ff", "#0070ff", "#004aff", "#0009ff", "blue swirl"],
    ["#d5ff87", "#b6ff87", "#a1ff79", "#82ff59", "#cdff5a", "Baby Green"],
    ["#8dcf8a", "#5aac56", "#328a2e", "#156711", "#034500", "Green stava"],
    ["#fff5e0", "#c9a063", "#b28247", "#7f4f21", "#40220f", "Sun Sauce"],
    ["#eeeeee", "#dddddd", "#cccccc", "#bbbbbb", "#aaaaaa", "mygrayscale"],
    //    Speciffic pallettes
    ["#fb0000", "#f2f407", "#10ee08", "#0106f2", "#ff00e7", "flat neon"],
    ["#f69601", "#54a910", "#9e00b5", "#ac0b35", "#0c7cac", "Bounding"],
    ["#b13030", "#e41f4c", "#ffa071", "#ffba00", "#ff9e9e", "Intrusive berries"],
    ["#ef4aa7", "#d21b29", "#249ccb", "#b9b93c", "#fad049", "Sayulita Beach"],
    ["#559641", "#bde1a0", "#d41f1f", "#f6d443", "#fdbc40", "autumn bouquet"],
    ["#f69601", "#54a910", "#9e00b5", "#ac0b35", "#0c7cac", "Bounding Color"],
    ["#e1da44", "#aecc5a", "#fda02e", "#ab1010", "#7a2762", "Fruit Salad"],
    ["#3b7c98", "#c33333", "#b39348", "#76523c", "#4d3c32", "Resistance Hope"],
    ["#edf9dc", "#fec1cb", "#ea7ba1", "#7e1e85", "#654994", "Coastal Limeade"],
    ["#ffead3", "#b93546", "#fffafa", "#f6e2b3", "#b49982", "white chocolate raspberry almond"],
    ["#db5461", "#698f3f", "#fbfaf7", "#e7decd", "#804e49", "Dipped Strawberry"],
    ["#6eb6be", "#387277", "#8e0d0d", "#664c3e", "#f0d8bb", "Rustice"],
    ["#33919e", "#d8b2ad", "#dbcdb5", "#335b9e", "#9e4033", "Flower Wedding"]
];

const FORMATS = {
     format0:  ["formatted","","cell-format-1"],
     format1:  ["formatted","inset 0 0 0 0.1em","cell-format-2"],
     format2:  ["formatted","inset 0 0 0 0.2em","cell-format-3"],
     format3:  ["formatted","inset 0 0 0 0.3em","cell-format-4"],
     format4:  ["formatted","inset 0 0 0 0.4em","cell-format-5"],
     format5:  ["formatted","inset 0 0 0 0.5em","cell-format-6"],
     format6:  ["formatted","inset 0 0 0.4em 0.0em","cell-format-7"],
     format7:  ["formatted","inset 0 0 0.2em 0.1em","cell-format-8"],
     format8:  ["formatted","inset 0 0 0.3em 0.2em","cell-format-9"],
     format9:  ["formatted","inset 0 0 0.4em 0.3em","cell-format-10"],
     format10: ["formatted","inset 0 0 0.45em 0.35em", "cell-format-11"],
     format11: ["formatted","inset 0 0 0.45em 0.45em", "cell-format-12"],
     format12: ["fashape", "fas fa-paw"],
     format13: ["fashape", "fas fa-adjust"],
     format14: ["fashape", "fas fa-asterisk"],
     format15: ["fashape", "fas fa-bars"],
     format16: ["fashape", "fas fa-align-justify"],
     format17: ["fashape", "fas fa-th-large"],
     format18: ["fashape", "fas fa-circle"],
     format19: ["fashape", "far fa-circle"],
     format20: ["fashape", "fas fa-bell"],
     format21: ["fashape", "far fa-bell"],
     format22: ["fashape", "far fa-snowflake"],
     format23: ["fashape", "fas fa-cloud"],
     format24: ["fashape", "fas fa-futbol"],
     format25: ["fashape", "fas fa-umbrella"],
     format26: ["fashape", "fas fa-cube"],
     format27: ["fashape", "fas fa-cubes"],
     format28: ["fashape", "fas fa-rocket"],
     format29: ["fashape", "fas fa-plane"],
     format30: ["fashape", "fas fa-tree"],
     format31: ["fashape", "fas fa-leaf"],
     format32: ["fashape", "fas fa-anchor"],
     format33: ["fashape", "fas fa-gift"],
     format34: ["fashape", "fas fa-birthday-cake"],
     format35: ["fashape", "fas fa-paper-plane"],
     format36: ["fashape", "fas fa-heart"],
     format37: ["fashape", "far fa-heart"],
     format38: ["fashape", "fas fa-moon"],
     format39: ["fashape", "far fa-moon"],
     format40: ["fashape", "fas fa-smile"],
     format41: ["fashape", "far fa-smile"],
     format42: ["fashape", "fas fa-sun fa-fw"],
     format43: ["fashape", "far fa-sun fa-fw"],
     format44: ["fashape", "fas fa-square"],
     format45: ["fashape", "far fa-square"],
     format46: ["fashape", "fas fa-lemon"],
     format47: ["fashape", "far fa-lemon fa-fw"],
     format48: ["fashape", "fa fa-dot-circle"],
     format49: ["fashape", "far fa-dot-circle"],
     format50: ["fashape", "fas fa-bullseye"],
     format51: ["fashape", "fas fa-star"],
     format52: ["fashape", "far fa-star"],
     format53: ["fashape", "fa fa-spinner fa-pulse fa-fw"],
     format54: ["fashape", "fa fa-asterisk fa-spin fa-fw"],
     format55: ["fashape", "far fa-snowflake fa-spin fa-fw"],
     format56: ["fashape", "fa fa-life-ring fa-spin fa-fw"],
     format57: ["fashape", "far fa-life-ring fa-spin fa-fw"],
     format58: ["fashape", "far fa-sun fa-spin fa-fw"],
     format59: ["fashape", "fa fa-sun fa-spin fa-fw"],
     format60: ["fashape", "fa fa-certificate fa-spin fa-fw"],
     format61: ["fashape", "fa fa-circle-notch fa-spin fa-fw"],
     format62: ["fashape", "fa fa-cog fa-spin fa-fw"],
     format63: ["fashape", "fa fa-futbol fa-spin fa-fw"],
     format64: ["fashape", "fa fa-compass fa-spin fa-fw"],
     format65: ["fashape", "far fa-compass fa-spin fa-fw"]
};

const DYNAMICS = {
    "dynamics0": "animated infinite flip",
    "dynamics1": "animated infinite flash",
    "dynamics2": "animated infinite pulse",
    "dynamics3": "animated infinite rubberBand",
    "dynamics4": "animated infinite bounce",
    "dynamics5": "animated infinite shake",
    "dynamics6": "animated infinite swing",
    "dynamics7": "animated infinite tada",
    "dynamics8": "animated infinite wobble",
    "dynamics9": "animated infinite jello"
};

//To be deletted TODO
// const shapeList = {
//     shape1: ['formatted', ".cell-format-1"],
//     shape2: ['formatted', ".cell-format-2"],
//     shape3: ['formatted', ".cell-format-3"],
//     shape4: ['formatted', ".cell-format-4"],
//     shape5: ['formatted', ".cell-format-5"],
//     shape6: ['formatted', ".cell-format-6"],
//     shape7: ['formatted', ".cell-format-7"],
//     shape9: ['formatted', ".cell-format-8"],
//     shape10: ['formatted', ".cell-format-9"],
//     shape11: ['shape', "paw"],
//     shape12: ['shape', "adjust"],
//     shape13: ['shape', "asterisk"],
//     shape14: ['shape', "bars"],
//     shape15: ['shape', "cloud"],
//     shape16: ['shape', "circle"],
//     shape17: ['shape', "circle-o"],
//     shape18: ['shape', "circle-thin"],
//     shape19: ['shape', "soccer-ball-o"],
//     shape20: ['shape', "snowflake-o"],
//     shape21: ['shape', "sun-o"],
//     shape22: ['shape', "heart"],
//     shape23: ['shape', "heart-o"],
//     shape24: ['shape', "moon-o"],
//     shape25: ['shape', "smile-o"],
//     shape26: ['shape', "spinner"],
//     shape27: ['shape', "square"],
//     shape28: ['shape', "square-o"],
//     shape29: ['shape', "star"],
//     shape30: ['shape', "star-o"],
//     shape31: ['shape', "spinner fa-spin fa-fw"],
//     shape32: ['shape', "circle-o-notch fa-spin"],
//     shape33: ['shape', "refresh fa-spin fa-fw"],
//     shape34: ['shape', "cog fa-spin fa-fw"],
//     shape35: ['shape', "spinner fa-pulse fa-fw"]
// }


// Used to set 5 diferent cell sizes - related to the sizes of Fonts awesome icons
const CELL_SIZE_LIST = [16, 32, 48, 64, 80];
let cellSizeNumber = 3; // Value between 1 and 5
let cellSize = 48;
// Select random background from all palettes colours
//Warning - 'erase' e.g. undefined color will be added later, therefore check based on backgroundColor are not suitable.
let initialBackground = function () {
    document.body.style.backgroundColor = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)][Math.floor(Math.random() * 5)];
};

// Determines initial random size of cells in the grid and other random initial values.
let initialSize = function () {
    cellSizeNumber = Math.floor(Math.random() * 5) + 1;
    cellSize = CELL_SIZE_LIST[cellSizeNumber - 1];
    gridXmax = Math.floor(CANVAS_X_SIZE_PX / cellSize);
    selectRangeX.attr("max", gridXmax);
    gridYmax = Math.floor(CANVAS_Y_SIZE_PX / cellSize);
    selectRangeY.attr("max", gridYmax);
    characteristics.colorNr = Math.floor(Math.random() * 5);
    //TODO set selected cell animated
    characteristics.bgColorNr = Math.floor(Math.random() * 5);
    //TODO set selected cell animated
    visualizeSizeSelected();
    let tempNr = Math.floor(Math.random() * COLOR_PALETTES.length);
    $("input#radio-colors"+tempNr.toString()).prop("checked",true);
    selectColorPalette(tempNr);
    characteristics.activePalete = tempNr;
    tempNr = Math.floor(Math.random() * COLOR_PALETTES.length);
    $("input#radio-bg-colors"+tempNr.toString()).prop("checked",true);
    selectBgColorPalette(tempNr);
    characteristics.activeBgPalette = tempNr;
};

// Main buttons (Not all are functional yet) TODO

$('#show-left-sidebar').on("click", function () {
    $('#left-sidebar').toggle("slow");
    console.log("SHOW/HIDE SIDEBAR")
});

// $('#show-grid').on("click", function () {
//     //TODO turn on / off grid(border)
// });

$('#reset').on("click", function () {
    // $("#left-sidebar").hide("slow");
    table.addClass("animated rotateOutDownLeft");
    $('#grid-creator-popup').removeClass("rotateOutDownLeft").addClass("rotateIn"); //("lightSpeedOut");
});

$("#show-grid").on("click", function() {

  alert("Border off");
  $("#drawing-canvas>tr").toggleClass("border-off");
  $("#drawing-canvas>td").toggleClass("border-off");
});

$("#eraser").on("click", function() {
    // alert("Eraser started?");
    emptyCellsRandom();

});

// Change whole page background from colors-grid table
$("#colors-grid").on("click", "td.colorbg", function () {
    let bgColor = $(this).css('backgroundColor');
    console.log(bgColor);
    console.log("Color changed!!! COLORS-GRID");
    document.body.style.backgroundColor = bgColor;
});

// Select radio button for changing drawing color:
$("#colors-grid").on("click", "input.select-color-palette", function () {
    //Get table color row - tr id for ex. "colrow0"
    let trId = $(this).closest('tr').attr('id'); // table row ID
    let trIdNum = getNrOnly(trId);
    // alert("color selected:" + trId.toString()+"   Nr: "+trIdNum.toString());
    //All other tasks are don in separate function which can be used also for initialisation:
    selectColorPalette(trIdNum);
});

let selectColorPalette = function (paletteNr) {
    //Set palette as characteristics.palette if changed
    //Set color as characteristics.color
    if (characteristics.activePalete !== paletteNr) {
        //Set color as characteristics.color
        characteristics.activePalete = paletteNr;
        characteristics.color = COLOR_PALETTES[paletteNr][characteristics.colorNr];
        // alert(characteristics.activePalete, characteristics.color,COLOR_PALETTES[paletteNr],COLOR_PALETTES[paletteNr][characteristics.colorNr]);
        //Change "pixie" colors
        $("#pixie0").css("color", COLOR_PALETTES[paletteNr][0]);
        $("#pixie1").css("color", COLOR_PALETTES[paletteNr][1]);
        $("#pixie2").css("color", COLOR_PALETTES[paletteNr][2]);
        $("#pixie3").css("color", COLOR_PALETTES[paletteNr][3]);
        $("#pixie4").css("color", COLOR_PALETTES[paletteNr][4]);
        //Draw cursor between pixie and mixie (this is sample drawing) - external function
        //TODO when all other parts are finished also adjust.
        // alert("Draw sample cursor!")
    }
    //Change "pixie" colors
    //Draw cursor between pixie and mixie (this is sample drawing) - external function
};

// Select radio button for changing drawing background color:
$("#colors-grid").on("click", "input.select-background-palette", function () {
    //Get table color row - tr id for ex. "colrow0"
    let trId = $(this).closest('tr').attr('id'); // table row ID
    let trIdNum = getNrOnly(trId);
    // alert("color selected:" + trId.toString()+"   Nr: "+trIdNum.toString());
    //All other tasks are don in separate function which can be used also for initialisation:
    selectBgColorPalette(trIdNum);
    // alert("Message colorBG selected")
});

let selectBgColorPalette = function (paletteNr) {
    //Set palette as characteristics.palette if changed
    //Set color as characteristics.color
    if (characteristics.activeBgPalette !== paletteNr) {
        //Set color as characteristics.color
        characteristics.activeBgPalette = paletteNr;
        characteristics.bgColor = COLOR_PALETTES[paletteNr][characteristics.bgColorNr];
        // alert(characteristics.activeBgPalette, characteristics.bgColor,COLOR_PALETTES[paletteNr],COLOR_PALETTES[paletteNr][characteristics.bgColorNr]);
        //Change "pixie" colors
        $("#mixie0").css("background-color", COLOR_PALETTES[paletteNr][0]);
        $("#mixie1").css("background-color", COLOR_PALETTES[paletteNr][1]);
        $("#mixie2").css("background-color", COLOR_PALETTES[paletteNr][2]);
        $("#mixie3").css("background-color", COLOR_PALETTES[paletteNr][3]);
        $("#mixie4").css("background-color", COLOR_PALETTES[paletteNr][4]);
        //Draw cursor between pixie and mixie (this is sample drawing) - external function
        //TODO when all other parts are finished.
        // alert("Draw sample cursor!")
    }
    //Change "pixie" colors
    //Draw cursor between pixie and mixie (this is sample drawing) - external function
};

// language=JQuery-CSS
$("#dynamics-grid").on("click", "td", function () {
    //Get cell Id
    let trId = $(this).attr('id'); // table row ID
    let trIdNum = getNrOnly(trId);
    // alert(trIdNum.toString()+"     "+trId.toString());
    console.log(trIdNum, trId);
    if (characteristics.dynamicsString !== DYNAMICS[trId]) {
        // alert("YAY, they are different! Dynamics to be changed");
        // characteristics.type = FORMATS[trId][0];
        // alert(DYNAMICS[trId], characteristics.dynamicsString);
        if (characteristics.dynamicStringId !=="") {
            $(("#" + characteristics.dynamicStringId.toString())).css("background-color", "");
        }
        characteristics.dynamicStringId = trId;
        $(("#" + characteristics.dynamicStringId.toString())).css("background-color", "red");
        characteristics.dynamicsString = DYNAMICS[trId];
        // characteristics.faString = FORMATS[trId][1];
        // characteristics.styleName = FORMATS[trId][1];
        //TODO change characteristic.faStringFull to include in class dynamics      at least when faform, if formatted TBD
    } else {
        // Remove white background!!!first
        // alert("dynamics deleted!");
        $("#"+characteristics.dynamicStringId).css("background-color", "");
        characteristics.dynamicStringId = "";
        characteristics.dynamicsString = "";

    }
    //Draw cursor between pixie and mixie (this is sample drawing) - external function
    // alert("Message dynamics WAS selected")
});

$("#format-grid").on("click", "td", function () {
    //Get cell Id
    let trId = $(this).attr('id'); // table row ID
    let trIdNum = getNrOnly(trId);
    if (characteristics.formatArray !== FORMATS[trId]) {
        // alert("YAY, they are different! Dynamics to be changed");
        $("#"+characteristics.formatArrayId.toString()).css("background-color", "");
        characteristics.formatArrayId = trId;
        $("#"+characteristics.formatArrayId.toString()).css("background-color", "red");
        characteristics.formatArray = FORMATS[trId];
        // alert(FORMATS[trId]);
        //TODO change characteristic.faStringFull to include in class dynamics      at least when faform, if formatted TBD
    }
    //Draw cursor between pixie and mixie (this is sample drawing) - external function
    // alert("Message format selected")
});

$("#pixie-mixie").on("click", "td", function () {
    //Exclude Id="cursor" from the event
    //Get cell Id
    let trId = $(this).attr('id'); // table row ID
    let trIdNum = getNrOnly(trId);
    let trIdNonNum = getNonNrOnly(trId);
    console.log(trId, trIdNum,trIdNonNum);
    if (trIdNonNum === "pixie") {
        if (trIdNum != characteristics.colorNr) {
            changeColorFromPalette(trIdNum)
        }

    } else if (trIdNonNum === "mixie") {
        if (trIdNum != characteristics.bgColorNr) {
            changeBgColorFromPalette(trIdNum)
        }

    }

    //Draw cursor between pixie and mixie (this is sample drawing) - external function

});

let changeColorFromPalette = function (newColNr) {
    console.log(characteristics.colorNr, newColNr);
    if (characteristics.colorNr !== "") {
        $("#pixie"+characteristics.colorNr.toString(
        )).removeClass()
    }

    $("#pixie"+newColNr.toString(
        )).addClass("animated infinite flipInX");
    characteristics.colorNr = newColNr;
    characteristics.color = COLOR_PALETTES[characteristics.activePalete][newColNr];

}

let changeBgColorFromPalette = function (newBgColNr) {
    console.log(characteristics.bgColorNr, newBgColNr);
    if (characteristics.bgColorNr !== "") {
        $("#mixie"+characteristics.bgColorNr.toString(
        )).removeClass()
    }

    $("#mixie"+newBgColNr.toString(
        )).addClass("animated infinite flipInX");
    characteristics.bgColorNr = newBgColNr;
    characteristics.bgColor = COLOR_PALETTES[characteristics.activeBgPalette][newBgColNr];
}

// $(cell).on("click",function () {
//     alert("I'm drawing!");
// });

  table.on('mousedown', cell, function(event) {
    event.preventDefault();
    drawCell(this);
    if (event.buttons == 2) {
      eraseCell(this);
    }
  });
  table.on('mouseover', cell, function(event) {
    if (event.buttons == 1) {
      drawCell(this);
    } else if (event.buttons == 2) {
      eraseCell(this);
      // table.css
    }
  });


  let drawCell = function (thisCell) {
      // alert("Draw cell");
      // $(thisCell).css("background-color",characteristics.color);
      if (characteristics.formatArray[0] === "formatted") {
          eraseCell(thisCell);
          $(thisCell).css("background-color",characteristics.color);
          $(thisCell).css("box-shadow", characteristics.formatArray[1] +" "+characteristics.bgColor);
          $(thisCell).addClass(characteristics.dynamicsString);
      } else {
          eraseShape(thisCell);
          let istring = "<i class=\'"+characteristics.formatArray[1]+ " fa-"+cellSizeNumber+"x "+ characteristics.dynamicsString+" \'></i>"
                // <i class="fa fa-cog fa-spin fa-3x" aria-hidden="true"></i>
          $(thisCell).append(istring);
          $(thisCell).css("background-color",characteristics.color);
          $(thisCell).css("color",characteristics.bgColor);
      }
  };

    let eraseCell = function (thisCell) {
      // Remove background color
      $(thisCell).css('background-color',"");
      // Remove color
      $(thisCell).css('color',"");
      // Remove content
      $(thisCell).empty();
      //Remove all classes but .cell
      $(thisCell).removeClass().addClass("cell");
      // Remove box-shadow
      // $(thisCell).css("box-shadow","");

  };
// This erase deletes only div content i.e. i-tag with fa-shape. Therefore it leaves box shadow and box-shadow animation from first 12 styles/formats
// to fully delete formatting - use right mouse click!
let eraseShape = function (thisCell) {
      // Remove background color
      // $(thisCell).css('background-color',"");
      // Remove color
      // $(thisCell).css('color',"");
      // Remove content
      $(thisCell).empty();
      //Remove all classes but .cell
      // $(thisCell).removeClass().addClass("cell");
      // Remove box-shadow
      // $(thisCell).css("box-shadow","");

  };

let emptyCellsRandom = function () {
    let gridArray = [];
    for (let index = 0; index < gridX ; index++) {
        for (let index2 = 0; index2 < gridY; index2++) {
            gridArray.push([index, index2]);
            // console.log(gridArray);
            
        }
        
    }
    console.log(gridArray);
    // Math.floor(Math.random() * 5)
    let ind = gridArray.length
    console.log(ind);
    setTimeout(function() {;},1650);
    while (ind > 0) {
        let rand = Math.floor(Math.random() * ind);
        console.log(gridArray.length,rand );
        let tbl = table[0];
        let tblcell = tbl.rows[gridArray[rand][1]].cells[gridArray[rand][0]];
        // $(tblcell).css("background-color", "red");
        let divcell = tblcell.childNodes;
        setTimeout(function () {
        $(divcell).css("background-color", "");
        }, 1850);
        gridArray.splice(rand,1);
        console.log(ind);
        console.log(ind);
        ind--
    }
};

  // Arrow function with implied return used to extract numbers from ID's
let getNrOnly = str => Number(str.replace(/\D/g,''));

let getNonNrOnly = str => str.replace(/\d/g,'');

//Uses global variable! Visualizes cell size selection.
let visualizeSizeSelected = function () {
    let sizeString = '';
    for (let i = 1; i < 6; i++) {
        console.log("CellSizeNumber= ", cellSizeNumber);
        let forReplacing = "#size" + i.toString();
        if (cellSizeNumber === i) {
            // If this size is selected:
            sizeString = "<i class=\"fa fa-adjust fa-spin fa-" + i.toString() + "x \" aria-hidden=\"true\">";
            if (sizeString !== $(forReplacing)) {
                $(forReplacing).empty();
                $(forReplacing).append(sizeString);
                console.log("Difference > " + "#size" + i.toString())
            } else {
                console.log("Equal - no change!")
            }
        } else {
            // If size is not selected
            console.log("Cell not the size>>>>");
            sizeString = "<i class=\"fa fa-adjust fa-" + i.toString() + "x\" aria-hidden=\"true\">";
            if (sizeString !== $(forReplacing)) {
                $(forReplacing).empty();
                $(forReplacing).append(sizeString);
            }
        }
        console.log(sizeString);
        // console.log($(("#size"+toString(i)).html());
    }
};

/* initialSize();*/

$('#size1').on("click", function () {
    cellSizeNumber = 1;
    cellSize = CELL_SIZE_LIST[cellSizeNumber - 1];
    visualizeSizeSelected();
    gridXmax = Math.floor(CANVAS_X_SIZE_PX / cellSize);
    selectRangeX.attr("max", gridXmax);
    gridYmax = Math.floor(CANVAS_Y_SIZE_PX / cellSize);
    selectRangeY.attr("max", gridYmax);
});

$('#size2').on("click", function () {
    cellSizeNumber = 2;
    cellSize = CELL_SIZE_LIST[cellSizeNumber - 1];
    visualizeSizeSelected();
    gridXmax = Math.floor(CANVAS_X_SIZE_PX / cellSize);
    selectRangeX.attr("max", gridXmax);
    gridYmax = Math.floor(CANVAS_Y_SIZE_PX / cellSize);
    selectRangeY.attr("max", gridYmax);
});

$('#size3').on("click", function () {
    cellSizeNumber = 3;
    cellSize = CELL_SIZE_LIST[cellSizeNumber - 1];
    visualizeSizeSelected();
    gridXmax = Math.floor(CANVAS_X_SIZE_PX / cellSize);
    selectRangeX.attr("max", gridXmax);
    gridYmax = Math.floor(CANVAS_Y_SIZE_PX / cellSize);
    selectRangeY.attr("max", gridYmax);
});

$('#size4').on("click", function () {
    cellSizeNumber = 4;
    cellSize = CELL_SIZE_LIST[cellSizeNumber - 1];
    visualizeSizeSelected();
    gridXmax = Math.floor(CANVAS_X_SIZE_PX / cellSize);
    selectRangeX.attr("max", gridXmax);
    gridYmax = Math.floor(CANVAS_Y_SIZE_PX / cellSize);
    selectRangeY.attr("max", gridYmax);
});

$('#size5').on("click", function () {
    cellSizeNumber = 5;
    cellSize = CELL_SIZE_LIST[cellSizeNumber - 1];
    visualizeSizeSelected();
    gridXmax = Math.floor(CANVAS_X_SIZE_PX / cellSize);
    selectRangeX.attr("max", gridXmax);
    gridYmax = Math.floor(CANVAS_Y_SIZE_PX / cellSize);
    selectRangeY.attr("max", gridYmax);
});

//TODO to be deleted later
// let visualizeSizeSelectedString = function(size) {
//     if (cellSizeNumber=size) {
//
//     } else {
//
//     }
//
// }

let initColorsGrid = function () {
    // console.log("SOME LENGTH" + COLOR_PALETTES.length)
    for (let row = 0; row < COLOR_PALETTES.length; row++) {
        // console.log("Row nr" + row);
        $("#colors-grid").append(
            "<tr id=\'colrow" + row + "\'>" + "TEXTTODO" +
            "<td class=\'colorbg\' bgcolor=\'" + COLOR_PALETTES[row][0] + "\'></td>" +
            "<td class=\'colorbg\' bgcolor=\'" + COLOR_PALETTES[row][1] + "\'></td>" +
            "<td class=\'colorbg\' bgcolor=\'" + COLOR_PALETTES[row][2] + "\'></td>" +
            "<td class=\'colorbg\' bgcolor=\'" + COLOR_PALETTES[row][3] + "\'></td>" +
            "<td class=\'colorbg\' bgcolor=\'" + COLOR_PALETTES[row][4] + "\'></td>" +
            "<td><input id=\'radio-colors"+ row + "\' class='select-color-palette radio' type='radio' name='radio-color'></td>" +
            "<td><input id=\'radio-bg-colors"+ row + "\' class='select-background-palette radio' type='radio' name='radio-bg-color'></td>" +
            "</tr>"
        )
    }


};

//Range slider

$('input[type="range"]').on('input', function() {

  var control = $(this),
    controlMin = control.attr('min'),
    controlMax = control.attr('max'),
    controlVal = control.val(),
    controlThumbWidth = control.data('thumbwidth');

  var range = controlMax - controlMin;

  var position = ((controlVal - controlMin) / range) * 100;
  var positionOffset = Math.round(controlThumbWidth * position / 100) - (controlThumbWidth / 2);
  var output = control.next('output');

  output
    .css('left', 'calc(' + position + '% - ' + positionOffset + 'px)')
    // .text(controlVal);

});

$(document).ready(function () {
    initialBackground();
    // console.log("Now is the table");
    initColorsGrid();
    initialSize();

});

// TODO remove later
// pxmx.selectRangeX.attr(max,20);
// $('range-x').attr("max",'20');
// console.log('xmax changed!');

//Generate grid
$('#btn-generate-grid').on("click", function () {

    $('#grid-creator-popup').removeClass("rotateIn").addClass("rotateOutDownLeft"); //("lightSpeedOut");
    gridX = selectRangeX.val();
    gridY = selectRangeY.val();
    generateGrid(gridX, gridY);
    // console.log("Someone pressed grid create!");
});

let generateGrid = function (gridX, gridY) {
    const effects = ['fadeInDownBig', 'fadeInLeftBig', 'fadeInRightBig', 'fadeInUpBig'];
    let gridContent = '';
    // gridContent+="<div class=\'animated flip\'>";
    for (let y = 0; y < gridY; y++) {
        // const element = array y];
        gridContent += "<tr class=\'animated " + effects[y % 2 + 1] + "\'>>";
        for (let x = 0; x < gridX; x++) {
            let bgcol = "style= \"background-color: rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",1);\"";
            // console.log(bgcol);
            // const element = array y];
            gridContent += ("<td ><div class=\'cell\' " + bgcol + " ></div></td>");
            // console.log("Bla bla inside table")
        }
        gridContent += ("</tr>");
    }
    table.empty();
    table.removeClass("animated rotateOutDownLeft");
    table.append(gridContent);
    $(".cell").height(cellSize.toString() + "px");
    $(".cell").width(cellSize.toString() + "px");
    // emptyCellsRandom();

// TODO this need to create gradual color change - same otherwise can be done with jQueryUI
//     setTimeout(function () {
//         for (let z = 0; z < 20; z++) {
//             $(".cell").css("background-color", "rgba(0,0,0," + ((20 - z) / 20 - 0.05) + ")");
//             console.log(z)
//             setTimeout(function () {
//                 // console.log("time");
//             }, 800)
//         }
//     }, 2000);

    // $("#left-sidebar").show("slow")

};
var $ = function( id ) { return document.getElementById( id ); };

function typedemo(){
    type("A 60 second demo!",$("input"));
    setTimeout(function(){type("6 colors + 4 numbers",$("input"))},10000)
    setTimeout(function(){type("Font: roboto black",$("input"))},20000)
    setTimeout(function(){type("SHA1 = colors+code",$("input"))},30000)
    setTimeout(function(){type("Rev\nSpace",$("input"))},35000)
    setTimeout(function(){type("hackerspaces.nl",$("input"))},40000)
    setTimeout(function(){type("Jochem, Anouk",$("input"))},45000)
    setTimeout(function(){type("Stitch, Claudia",$("input"))},50000)
    setTimeout(function(){type("Get creative!",$("input"))},60000)
    setTimeout(function(){type("Type and test...",$("input"))},55000)
    setTimeout(defaultText(),60000)
}


function type(string,element){
    (function writer(i){
        if(string.length <= i++){
            element.value = string;
            return;
        }
        element.value = string.substring(0,i);
        if( element.value[element.value.length-1] != " " )element.focus();
        var rand = Math.floor(Math.random() * (100)) + 140;
        setTimeout(function(){writer(i);},rand);
        hash();
    })(0)
}


function focusinput(){
    $("input").focus();
    defaultText(decodeURIComponent(location.search.split('input=')[1]));
}

function changeFontSize(){
	$("htmlpanes").style.fontSize = $("slider").value+"px";
	$("htmlpanes").style.height = $("slider").value*4.7+"px";
}

function hash(){
    output = sha1($("input").value);
    $("htmlpanes").value = $("input").value;
    $("SHA1_normal").value = output;
    $("SHA1_uppercase").value = output.toUpperCase();
    $("SHA1_split").value = splitper(output,2,":");
    $("SHA1_gradient").value = shaflaggradient(output);



    // to make this site more colorful and happy, we convert the hex we get to HTML colors following the infamous freedom flag :)
    flag = "#" + splitper(output,6," #");
    flagcolors = flag.split(" "); // a flag is postfixed with remaining, not html safe colors, such as + C0
    if (flagcolors[flagcolors.length-1].length < 7){
        flagcolors[flagcolors.length-1] = flagcolors[flagcolors.length-1].replace("#","+");
    }
    flag = flagcolors.join(" ");
    $("SHA1_freedomflag").value = flag;
    
    var happyColors = "";
    
    asciiNeeded = (flagcolors[flagcolors.length-1].length < 7);
    
    if (flagcolors.length > 1) {
        for (j=0;j<flagcolors.length;j++){
            if (j < flagcolors.length-2) {
                happyColors += "<span class='flagblock' style='background-color: "+flagcolors[j]+"'>&nbsp;</span>";
            } else {
                if (asciiNeeded){
                    happyColors += "<span class='flagblock' style='background-color: "+flagcolors[j]+"'><span class='flagcode'>" +flagcolors[(j+1)]+ "</span></span>";
                    break;
                } else {
                    happyColors += "<span class='flagblock' style='background-color: "+flagcolors[j]+"'>&nbsp;</span>";
                }
            }
        }
    }
    $("SHA1_flag").innerHTML = happyColors;
	$("logo").innerHTML = happyColors;
	$("textcode").innerHTML = flagcolors[flagcolors.length-1];
	
	$("logotext").innerHTML = $("input").value.substring(0,3);

    // all different sizes
    outputs = ["800x600", "1024x768", "1920x1080", "1230x410", "600x600", "468x60","728x90", "88x31", "800x300", "600x1"]

    for (i=0; i<outputs.length; i++)
        toCanvas(outputs[i], $("input").value, flagcolors, $("textslider").value, $("codeslider").value, $("showtext").checked, $("showcode").checked)

}

function shaflaggradient(hex) {
  return "- not yet implemented, view source here: https://wiki.sha2017.org/w/MediaWiki:Common.js";
}

// with 11061 spaces, you have SHA( *11061) 2017 that has a flag with +2017 
// also one at 26832 (happy colors), 30439, , in the 64000 in lowercase.
// Only SHA: not really happening...???  It happens at 113971 = ccabcee090094019a34ea96a0a5ae3d55c392017
function shabrute(){
	padding = "";
	answer = "";

	while (1){
		padding += " "
		bla = sha1("SHA" + padding)
		answer = bla.substring(36)
		if (answer == "2017")
			alert(padding.length)
	}
	
}

function splitper(value, n, separator){
    var returnValue = "";
    
    for (j=0; j<value.length; j += n){
        returnValue += value.substr(j,n) + separator;        
    }
    
    return returnValue.substr(0,returnValue.length-(separator.length));
}


// downloads canvas things...
// http://stackoverflow.com/questions/923885/capture-html-canvas-as-gif-jpg-png-pdf#3514404
function download(id) {
    var canvas = document.getElementById(id);
    window.location.href = canvas.toDataURL("image/png");
}


// todo: http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
// todo: font size
// todo: inform about installing the roboto black font...
function toCanvas(id, text, flagcolors, size, codeproportion, showtext, showcode){
    var c = document.getElementById(id);
    var ctx = c.getContext("2d");
    var width = c.width / 6; // or something like this...

    // ctx.beginPath();
    ctx.fillStyle = flagcolors[0];
    ctx.fillRect(0, 0, width, c.height);
    ctx.fillStyle = flagcolors[1];
    ctx.fillRect(width, 0, width, c.height);
    ctx.fillStyle = flagcolors[2];
    ctx.fillRect((width * 2), 0, width, c.height);
    ctx.fillStyle = flagcolors[3];
    ctx.fillRect((width * 3), 0, width, c.height);
    ctx.fillStyle = flagcolors[4];
    ctx.fillRect((width * 4), 0, width, c.height);
    ctx.fillStyle = flagcolors[5];
    ctx.fillRect((width * 5), 0, width, c.height);


    ctx.fillStyle = "#ffffff";

    // your message
    if (showtext){
        ctx.font = size+"px 'Roboto-Black'";
        ctx.textAlign = "center";
        ctx.textBaseline= "middle";
        //ctx.alignment-baseline = "middle";
        ctx.fillText(text,c.width/2,c.height/2); // also include the half of the font size...
    }

    // and the rest of the hash, minimal 10, 1/3rd of the input size. Ratio can be adjusted?
    if (showcode){
        size = size / (codeproportion / 10);
        minsize = size > 6 ? size : 6;
        ctx.font = minsize+"px 'Roboto-Black'";
        ctx.textAlign = "right"
        ctx.textBaseline= "alphabetic";

        // on very small images, take into account that 10px might not be available.
        bottom = c.height > 40 ? c.height - 10 : c.height - 1;
        right = c.height > 40 ? c.width - 10 : c.width - 1;

        ctx.fillText(flagcolors[6], right ,bottom); // align right...
    }
}

function defaultText(text){

    if (text != "undefined" && text != "" && text != null)
        $("input").value = text;
    else
        $("input").value = "SHA2017 STYLEGUIDE";
    hash();
    return;
        $("input").value = "SHA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     2017"
    hash();
}
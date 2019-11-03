function AddRow() {
	//alert(elem.parentNode.children.length)

	form = document.getElementById('form');
	form.insertAdjacentHTML('afterbegin', `
<div>
<button type="button" onclick="AddColumn(this)">+</button>
<button type="button" onclick="RemoveColumn(this)">-</button>
<input type="text" id="keys" value="keys" />
</div>
`);	
	AddColumn(form.children[0].children[0]);
}

function RemoveRow() {
	if (form.children.length > 4) {
		form.removeChild(form.children[0]);
	}		
}

function AddColumn(elem) {
	elem.parentNode.insertAdjacentHTML('afterbegin', `
<div class="pair">
	<select name="Input Type" id="type">
		<option value="bPressed" selected>Button Pressed</option>
		<option value="bReleased">Button Released</option>
		<option value="bDown">Button Down</option>
		<option value="tPressed">Touch Pressed</option>
		<option value="tReleased">Touch Released</option>
		<option value="tDown">Touch Down</option>
		<option value="sPressed">Stick Pressed</option>
		<option value="sReleased">Stick Released</option>
		<option value="sDown">Stick Down</option>
	</select>
	<select name="Input Button" id="button">
		<option value="bA">A</option>
		<option value="bB">B</option>
		<option value="bX">X</option>
		<option value="bY">Y</option>
		<option value="bMenu">Menu</option>
		<option value="bRThumb">Right Thumbstick Click</option>
		<option value="bLThumb">Left Thumbstick Click</option>
		<option value="tLThumbRest">TOUCH ONLY Left Thumb Rest</option>
		<option value="tRThumbRest">TOUCH ONLY Right Thumb Rest</option>
		<option value="sLUp">STICK ONLY Left Up</option>
		<option value="sLDown">STICK ONLY Left Stick Down</option>
		<option value="sLLeft">STICK ONLY Left Stick Left</option>
		<option value="sLRight">STICK ONLY Left Stick Right</option>
		<option value="sRUp">STICK ONLY Right Stick Up</option>
		<option value="sRDown">STICK ONLY Right Stick Down</option>
		<option value="sRLeft">STICK ONLY Right Stick Left</option>
		<option value="sRRight">STICK ONLY Right Stick Right</option>
	</select>
</div>		
`);
}

function RemoveColumn(elem) {
	if (elem.parentNode.children.length > 4) {
		elem.parentNode.removeChild(elem.parentNode.children[0]);
	}
}

function Submit() {
	form = document.getElementById('form');
	rows = form.querySelectorAll(':scope > div');
	
	fullText = ""
	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];

		var text = ""

		columns = row.querySelectorAll(':scope > .pair');
		for (var j = 0; j < columns.length; j++) {
			var column = columns[j];
			text += column.querySelector('#type').value + "|" + column.querySelector('#button').value + ",";
		}

		keys = row.querySelector(':scope > #keys').value;
		text += keys
		fullText += text + "\r\n"
	}

	var link = document.getElementById('downloadlink');
	 link.href = makeTextFile(fullText);
	 link.style.display = 'block';
}

var textFile = null
makeTextFile = function (text) {
	var data = new Blob([text], {type: 'text/plain'});

	if (textFile !== null) {
		window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	return textFile;
};

window.onload = function() {
	AddRow();
};
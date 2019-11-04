function AddRow() {
	//alert(elem.parentNode.children.length)

	form = document.getElementById('form');
	form.insertAdjacentHTML('afterbegin', `
<div class="row">
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
	<select name="Input Type" id="type" onchange="InputChanged(this)">
		<option value="b" selected>Button</option>
		<option value="t">Touch</option>
		<option value="s">Stick</option>
	</select>
	<select name="Input Edge" id="edge">
		<option value="Pressed" selected>Pressed</option>
		<option value="Released">Released</option>
		<option value="Down">Down</option>
	</select>
	<select name="Input Button" id="button">
		<option value="bA">A</option>
		<option value="bB">B</option>
		<option value="bX">X</option>
		<option value="bY">Y</option>
		<option value="bMenu">Menu</option>
		<option value="bLThumb">Left Thumbstick</option>
		<option value="bRThumb">Right Thumbstick</option>
		<option value="tLThumbRest">Left Thumb Rest</option>
		<option value="tRThumbRest">Right Thumb Rest</option>
		<option value="sLUp">Left Stick Up</option>
		<option value="sLDown">Left Stick Down</option>
		<option value="sLLeft">Left Stick Left</option>
		<option value="sLRight">Left Stick Right</option>
		<option value="sRUp">Right Stick Up</option>
		<option value="sRDown">Right Stick Down</option>
		<option value="sRLeft">Right Stick Left</option>
		<option value="sRRight">Right Stick Right</option>
	</select>
</div>		
`);

	InputChanged(elem.parentNode.children[0].children[0]);
}

function RemoveColumn(elem) {
	if (elem.parentNode.children.length > 4) {
		elem.parentNode.removeChild(elem.parentNode.children[0]);
	}
}

function InputChanged(elem) {
	var buttonInput = elem.parentNode.querySelector("#button");
	elemChar = elem.value.charAt(0);
	for (var i = 0; i < buttonInput.children.length; i++) {
		var option = buttonInput.children[i];
		optionChar = option.value.charAt(0);
		option.disabled = (elemChar != "t" && optionChar == "t") || 
											(elemChar != "s" && optionChar == "s") ||
											(elemChar == "s" && optionChar != "s");
	}
	var temp = buttonInput.value
	if (buttonInput.querySelector(`[value=${temp}]`).disabled) {
		buttonInput.value = buttonInput.querySelector(":not([disabled])").value;
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
			text += column.querySelector('#type').value + column.querySelector('#edge').value + "|" + column.querySelector('#button').value + ",";
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
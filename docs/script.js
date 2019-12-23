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
	<input name="Input Type" type="checkbox" id="type" onclick="InputChanged(this)">
	<label for="type">Capacitive</label>
	<input name="Input Type" type="checkbox" id="not" onclick="InputChanged(this)">
	<label for="not">Not</label>


	<select name="Input Edge" id="edge">
		<option value="Pressed" selected>Pressed</option>
		<option value="Released">Released</option>
		<option value="Down">Down</option>
	</select>

	<select name="Input Button" id="button">
		<option value="bA">                          A                 </option>
		<option value="bB">                          B                 </option>
		<option value="bX">                          X                 </option>
		<option value="bY">                          Y                 </option>

		<option value="bMenu" class="bOnly">         Menu              </option>
		<option value="bLTrig" class="bOnly">        Left Trigger      </option>
		<option value="bRTrig" class="bOnly">        Right Trigger     </option>
		<option value="bLGrip" class="bOnly">        Left Grip         </option>
		<option value="bRGrip" class="bOnly">        Right Grip        </option>

		<option value="bLThumb">                     Left Thumbstick   </option>
		<option value="bRThumb">                     Right Thumbstick  </option>

		<option value="bLUp" class="bOnly">          Left Stick Up     </option>
		<option value="bLDown" class="bOnly">        Left Stick Down   </option>
		<option value="bLLeft" class="bOnly">        Left Stick Left   </option>
		<option value="bLRight" class="bOnly">       Left Stick Right  </option>
		<option value="bRUp" class="bOnly">          Right Stick Up    </option>
		<option value="bRDown" class="bOnly">        Right Stick Down  </option>
		<option value="bRLeft" class="bOnly">        Right Stick Left  </option>
		<option value="bRRight" class="bOnly">       Right Stick Right </option>

		<option value="tLThumbRest" class="tOnly">   Left Thumb Rest   </option>
		<option value="tRThumbRest" class="tOnly">   Right Thumb Rest  </option>
		<option value="tLTrigger" class="tOnly">     Left Trigger      </option>
		<option value="tRTrigger" class="tOnly">     Right Trigger     </option>
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
	elemType = elem.checked;
	for (var i = 0; i < buttonInput.children.length; i++) {
		var option = buttonInput.children[i];
		optionChar = option.value;
		optionType = option.className;
		option.disabled = (!elemType && optionType == "tOnly") || 
											(elemType && optionType == "bOnly")
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
			text += (column.querySelector('#type').checked ? "t" : "b")
						 + column.querySelector('#edge').value + "|"
						 + column.querySelector('#button').value + "|"
						 +(column.querySelector('#not').checked ? "1" : "0") + ",";
		}

		keys = row.querySelector(':scope > #keys').value;
		text += keys
		fullText += text + "\r\n"
	}

	var link = document.getElementById('downloadlink');
	 link.href = makeTextFile(fullText);
	 link.style.display = 'block';
}

var textFile = null;
makeTextFile = function (text) {
	var data = new Blob([text], {type: 'text/plain'});

	if (textFile !== null) {
		window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	return textFile;
};

function Load(files) {
	// Add all of the files into a big string
 lines = "";
 for (var i = 0, f; f = files[i]; i++) {
	 readFileContent(f).then(function(result) {
		 lines = lines.concat(result, "\r\n");
	 })
 }
 setTimeout(() => {
	 lines = lines.split("\r\n");

	 // Create binding object
	 bindings = [];
	 for (var i = 0, l; l = lines[i]; i++) {
		 sections = l.split(",");
		 binding = []
		 binding.push(sections.pop());
		 for (var j = 0, s; s = sections[j]; j++) {
			 binding.push(s.split("|"));
		 }
		 bindings.push(binding);
	 }

	 // Clear out the current stuff
	 while (form.children.length > 4) {
		 RemoveRow();
	 }

	 // Import binding object
	 for (var i = bindings.length - 1, b; b = bindings[i]; i--) { // Items are added from bottom to top so do it in reverse for consistency.
		 // Create new row
		 AddRow(document.getElementById("add"));
		 row = document.getElementsByClassName("row")[0];

		 // Add the correct number of columns
		 for (var j = 2; j < b.length; j++) {
			 AddColumn(row.childNodes[0]);
		 }

		 // Loop over each pair
		 for (var j = 1, p; p = b[j]; j++) {
			 pair = row.children[j-1];
			 pair.children[0].checked = p[0][0] == "t"; // Capacitive
			 pair.children[2].checked = p[2] == 1; // Not
			 pair.children[4].value = p[0].slice(1); // Edge
			 pair.children[5].value = p[1]; // Button
		 }

		 // Add keystrokes
		 row.children[row.children.length - 1].value = b[0];
	 }
 }, 100);
}

function readFileContent(file) { // This is wizardry and i don't know how it works
 const reader = new FileReader()
 return new Promise((resolve, reject) => {
	 reader.onload = event => resolve(event.target.result)
	 reader.onerror = error => reject(error)
	 reader.readAsText(file)
 })
}

window.onload = function() {
	AddRow();
};
#Singleinstance force
SetWorkingDir %A_ScriptDir%

hModule := DllCall("LoadLibrary", "Str", "auto_oculus_touch.dll", "Ptr")

Menu, tray, NoStandard
Menu, tray, add, Reload, Reload
Menu, tray, Default, Reload
Reload() {
	Reload
}
Menu, tray, add, Exit, Exit
Exit() {
	ExitApp
}

; Menu, tray, add, Save, Save

; GET RID OF THIS IN RELEASES
Menu, Tray, Icon, icon.png

; Start the Oculus sdk.
DllCall("auto_oculus_touch\initOculus", "UInt") ;InitOculus()

; Buttons
bA      := 0x00000001
bB      := 0x00000002
bRThumb := 0x00000004
bX      := 0x00000100
bY      := 0x00000200
bLThumb := 0x00000400
bMenu   := 0x00100000

; Thumb Sticks
bLUp    := 0x00001000
bLDown  := 0x00002000
bLLeft  := 0x00004000
bLRight := 0x00008000
bRUp    := 0x00010000
bRDown  := 0x00020000
bRLeft  := 0x00040000
bRRight := 0x00080000

; Grips / Trigers
bLTrigger := 0x00000010
bRTrigger := 0x00000020
bLGrip    := 0x00000040
bRGrip    := 0x00000080

; Capacitive Sensors
tRThumbRest := 0x00000008
tLThumbRest := 0x00000800
tLTrigger   := 0x00001000
tRTrigger   := 0x00000010

; Read Settings
Load()
{
	global bindings := []
	if (A_Args.Length() > 0)
	{
		for n, param in A_Args
		{
 		  LoadFile(param) ; Load from dragged file
		}
	} else
	{
		LoadFile("settings.txt") ; Load from defult file
	}
}

LoadFile(filePath)
{
	global bindings
	FileRead, file, %filePath%
	l := StrSplit(file, "`r`n")
	for i, v in l ; Looop on newlines
	{
		if (v = "") ; Ignore empty lines
			continue
		sections := StrSplit(v, ",")
		binding := []
		binding.Push(sections.Pop()) ; Add keystrokes
		for j, w in sections ; Add each button
		{
			binding.Push(StrSplit(w, "|"))
		}
		bindings.Push(binding)
	}
}

Load()

Loop {
	DllCall("auto_oculus_touch\poll")

	bDown := DllCall("auto_oculus_touch\getButtonsDown")

	tDown := DllCall("auto_oculus_touch\getTouchDown")
	tPressed := DllCall("auto_oculus_touch\getTouchPressed")
	tReleased := DllCall("auto_oculus_touch\getTouchReleased")

	leftX := DllCall("auto_oculus_touch\getThumbStick", "Int", 0, "Int", 0, "Float")
	leftY := DllCall("auto_oculus_touch\getThumbStick", "Int", 0, "Int", 1, "Float")
	rightX := DllCall("auto_oculus_touch\getThumbStick", "Int", 1, "Int", 0, "Float")
	rightY := DllCall("auto_oculus_touch\getThumbStick", "Int", 1, "Int", 1, "Float")
	
	; Get thumbstick states
	if LeftX < -0.5
		bDown += bLLeft
	if LeftX > 0.5
		bDown += bLRight
	if LeftY < -0.5
		bDown += bLDown
	if leftY > 0.5
		bDown += bLUp
	
	if RightX < -0.5
		bDown += bRLeft
	if RightX > 0.5
		bDown += bRRight
	if RightY < -0.5
		bDown += bRDown
	if RightY > 0.5
		bDown += bRUp

	; Get trigger / grip states
	;DllCall("auto_oculus_touch\getTrigger", "Int", hand, "Int", trigger, "Float")
	; 
	if DllCall("auto_oculus_touch\getTrigger", "Int", 0, "Int", 0, "Float") > 0.7
		bDown += bLTrigger
	if DllCall("auto_oculus_touch\getTrigger", "Int", 1, "Int", 0, "Float") > 0.7
		bDown += bRTrigger
	
	; Grips
	if DllCall("auto_oculus_touch\getTrigger", "Int", 0, "Int", 1, "Float") > 0.7
		bDown += bLGrip
	if DllCall("auto_oculus_touch\getTrigger", "Int", 1, "Int", 1, "Float") > 0.7
		bDown += bRGrip

	bPressed := bDown & ~lbDown
	bReleased := ~bDown & lbDown
	lbDown := bDown

	for i, v in bindings
	{
		passed := True
		loop % v.MaxIndex() - 1
		{
			t := v[A_Index + 1][1] ; State
			t := %t%
			
			k := v[A_Index + 1][2] ; Key
			k := %k%

			n := v[A_Index + 1][3] ; Not

			key := (t & k)
			; MsgBox, % (key and !n) or (!key and n)

			if (key and n) or (!key and !n)
			{
				passed := False
			}
		}

		if passed {
			key := v[1]
			Send, %key%
		}
	}

	Sleep, 10
}

#Singleinstance force
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

Menu, Tray, Icon, icon.png

; Start the Oculus sdk.
DllCall("auto_oculus_touch\initOculus", "UInt") ;InitOculus()

bA := 0x00000001
bB := 0x00000002
bRThumb := 0x00000004
bX := 0x00000100
bY := 0x00000200
bLThumb := 0x00000400
bMenu := 0x00100000
	
; Capacitive Sensors
tA              := 0x00000001
tB              := 0x00000002
tRThumb         := 0x00000004
tRThumbRest     := 0x00000008
tRIndexTrigger  := 0x00000010
tX              := 0x00000100
tY              := 0x00000200
tLThumb         := 0x00000400
tLThumbRest     := 0x00000800
tLIndexTrigger  := 0x00001000

; Read Settings
Load()
{
	FileRead, file, settings.txt
	l := StrSplit(file, "`r`n")
	global bindings := []
	for i, v in l
	{
		if (v = "")
			continue
		sections := StrSplit(v, ",")
		binding := []
		binding.Push(sections.Pop()) ;Add keystrokes
		for j, w in sections
		{
			binding.Push(StrSplit(w, "|"))
		}
		bindings.Push(binding)
	}
}

; Save()
; {
; 	global bindings
; 	t := ""
; 	for i, v in bindings
; 	{
; 		a := v[1]
; 		loop % v.MaxIndex() - 1
; 		{
; 			t := t . v[A_Index + 1][1] . "|" . v[A_Index + 1][2]
; 		}
; 		t := t . "," . v[1]
; 		if !(i = bindings.MaxIndex())
; 		{
; 			t := t . "`r`n"
; 		}
; 	}

; 	FileDelete, settings.txt
; 	FileAppend, %t%, settings.txt

; 	Load()
; }

Load()

Loop {
	DllCall("auto_oculus_touch\poll")

	leftX := DllCall("auto_oculus_touch\getThumbStick", "Int", 0, "Int", 0, "Float")
	leftY := DllCall("auto_oculus_touch\getThumbStick", "Int", 0, "Int", 1, "Float")

	bDown := DllCall("auto_oculus_touch\getButtonsDown")
	bPressed := DllCall("auto_oculus_touch\getButtonsPressed")
	bReleased := DllCall("auto_oculus_touch\getButtonsReleased")

	tDown := DllCall("auto_oculus_touch\getTouchDown")
	tPressed := DllCall("auto_oculus_touch\getTouchPressed")
	tReleased := DllCall("auto_oculus_touch\getTouchReleased")
	
	for i, v in bindings
	{
		passed := True
		loop % v.MaxIndex() - 1
		{
			t := v[A_Index + 1][1]
			t := %t%
			
			k := v[A_Index + 1][2]
			k := %k%

			if !(t & k)
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

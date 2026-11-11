tell application "Cursor" to activate

tell application "System Events"
	-- Open DevTools directly on Console
	keystroke "i" using {command down, option down}
	delay 0.3

	-- Run previous command
	key code 126
	key code 36

	-- Close DevTools
	delay 0.2
	keystroke "i" using {command down, option down}
end tell
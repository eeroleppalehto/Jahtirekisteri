# HUNSPELL DICTIONARY MAINTAINER INSTALLER WITH MODERN UI
# =======================================================

# Include Modern UI

  !include "MUI2.nsh"

# --- Include end

# General

  # The name of the application, installer file name and character encoding
  Name "Jahtirekisteri "
  OutFile "Jahtirekisteri.exe"
  Unicode True

  # Default installation folder: user's application data directory
  InstallDir "$LOCALAPPDATA\Jahtirekisteri"
  
  # Get installation information from registry if available (reinstall)
  InstallDirRegKey HKCU "Software\Jahtirekisteri" ""

  # Request application privileges for Windows Vista or later
  RequestExecutionLevel user

# --- General end

# Variable declarations

  Var StartMenuFolder

# --- Variable definitions end

# Interface Settings

  # A Message box to show when user cancels the installation dialog
  !define MUI_ABORTWARNING

  # Add a bitmap (150 x 57 px) for a logo into the header of the installer page, must be a bmp file
  # !define MUI_HEADERIMAGE
  # !define MUI_HEADERIMAGE_BITMAP "Jerksoft3.bmp"

  # Show all languages defined, despite user's language settings
  !define MUI_LANGDLL_ALLLANGUAGES

# --- end Interface settings

# Language Selection Dialog Settings

  # Remember the installer language -> language not asked when installer restarted
  !define MUI_LANGDLL_REGISTRY_ROOT "HKCU" 
  !define MUI_LANGDLL_REGISTRY_KEY "Software\Jahtirekisteri" 
  !define MUI_LANGDLL_REGISTRY_VALUENAME "Installer Language"

# --- Language Selection Dialog Settings end

# Pages to show in the installer
  !insertmacro MUI_PAGE_WELCOME

  # License file containing the GNU GPL 3 information, the name of the file is LICENSE (created by Github)
  !insertmacro MUI_PAGE_LICENSE "LICENSE"
  
  # Pages for choosing components and the installation directory
  !insertmacro MUI_PAGE_COMPONENTS
  !insertmacro MUI_PAGE_DIRECTORY
  
  # Registry keys and values for the current user
  !define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKCU" 
  !define MUI_STARTMENUPAGE_REGISTRY_KEY "Software\Jahtirekisteri" 
  !define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "Start Menu Folder"
  
  # Start Menu definitons: folder and program starters
  !insertmacro MUI_PAGE_STARTMENU Application $StartMenuFolder
  !insertmacro MUI_PAGE_INSTFILES

  # Start Menu unistaller definitons
  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES

# --- Pages end

# Languages, 1st is the default, add more if needed
 
  !insertmacro MUI_LANGUAGE "Finnish"
  !insertmacro MUI_LANGUAGE "English"

# --- Languages end

# Installer Sections (Choises what to install -> chceck boxes in the installer)

# Section for choosing the program (Dictionary Maintainer) to be installed -> named section SecProgram
Section "Dictionary Maintainer" SecProgram

  SetOutPath "$INSTDIR"
  
  # Files to put into the installation directory: all files and folders from the distribution folder where pyinstaller stores the app
  File /r "dist\Jahtirekisteri\"

  # Store installation folder to registry
  WriteRegStr HKCU "Software\Jahtirekisteri" "" $INSTDIR
  
  # Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  # Add items to the Start Menu
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
    
    # Create shortcuts for the Start Menu: A folder name, the program to start and the uninstaller
    CreateDirectory "$SMPROGRAMS\$StartMenuFolder"
    CreateShortcut "$SMPROGRAMS\$StartMenuFolder\Jahtirekisteri.lnk" "$INSTDIR\Jahtirekisteri.exe"
    CreateShortcut "$SMPROGRAMS\$StartMenuFolder\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
  
  !insertmacro MUI_STARTMENU_WRITE_END

SectionEnd

# Section for optional dictionaries to be installed
Section "Dictionaries" SecDictionaries
    SetOutPath "$INSTDIR\Dictionaries"
  
  # Dictionary files to put into subdirectory Dictionaries from the projects root folder
  File "*.dic"
  File "*.aff"
SectionEnd

# --- # Installer Sections end

# Installer Functions

# A function for asking the installation language at startup
Function .onInit
  
  !insertmacro MUI_LANGDLL_DISPLAY

FunctionEnd

# --- Installer Functions


# Descriptions

  # Strings to be shown in the description area in different installation languages
  LangString DESC_SecProgram ${LANG_FINNISH} "Varsinainen ohjelma"
  LangString DESC_SecProgram ${LANG_ENGLISH} "The program file"
  LangString DESC_SecDictionaries ${LANG_FINNISH} "Hunspell-sanakirjat. Kopioi tiedostot taitto-ohjelman sanakirjakansioon"
  LangString DESC_SecDictionaries ${LANG_ENGLISH} "Original dictionaries. Copy files after installation to DTP application's dictionaries folder"

  # Assign those strings to sections
  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
    !insertmacro MUI_DESCRIPTION_TEXT ${SecProgram} $(DESC_SecProgram)
    !insertmacro MUI_DESCRIPTION_TEXT ${SecDictionaries} $(DESC_SecDictionaries)
  !insertmacro MUI_FUNCTION_DESCRIPTION_END
 
# --- Descriptions end

# Uninstaller Section
Section "Uninstall"

  # Remove all files and folders from installation directory, if not successfull remove after reboot
  RMDir /r /REBOOTOK $INSTDIR
  
  !insertmacro MUI_STARTMENU_GETFOLDER Application $StartMenuFolder

  # Remove start menu items  
  Delete "$SMPROGRAMS\$StartMenuFolder\Jahtirekisteri.lnk"
  Delete "$SMPROGRAMS\$StartMenuFolder\Uninstall.lnk"
  RMDir "$SMPROGRAMS\$StartMenuFolder"
  
  # Clean the registry by removing all keys under Hunspell Dictionary Maintainer
  DeleteRegKey HKCU "Software\Jahtirekisteri"

SectionEnd

#--- Uninstaller Section end

# A function for the uninstaller's language
Function un.onInit

  !insertmacro MUI_UNGETLANGUAGE
  
FunctionEnd

# --- Unistaller language function end
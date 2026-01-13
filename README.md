# Iconified: Custom File Icons Extension

**Set your own custom icons for files and folders in VS Code!**

## Features

- **Custom File Icons**: Assign icons to file extensions (e.g., `ts.svg` → `.ts` files)
- **Custom Folder Icons**: Assign icons to folder names (e.g., `src.svg` → `src` folders)
- **Easy Management**: Open icon folders directly from Command Palette
- **Auto-refresh**: Icons update automatically when you add/remove icon files

## Installation

1. Open VS Code and Download from the extensions tab

2. Activate the icon theme:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "File Icon Theme"
   - Select "Iconified"

## Usage

### Adding File Icons

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run: **Custom Icons: Open File Icons Folder**
3. Add your icon files (SVG or PNG format) with these naming conventions:
   - **For file extensions**: Name the icon file as the extension
     - Example: `ts.svg` → applies to `.ts` files
     - Example: `py.svg` → applies to `.py` files
   - **For specific filenames**: Use the full filename
     - Example: `package.json.svg` → applies only to `package.json`
     - Example: `build.ninja.svg` → applies only to `build.ninja`

### Adding Folder Icons

1. Open Command Palette
2. Run: **Custom Icons: Open Folder Icons Folder**
3. Add your icon files named after folder names:
   - Example: `src.svg` → applies to `src` folders
   - Example: `include.svg` → applies to `include` folders
   - Example: `node_modules.svg` → applies to `node_modules` folders

### Manual Refresh

If icons don't update automatically, use:

- **Custom Icons: Refresh Icons** from Command Palette

## Icon Format

- **Recommended**: SVG format (scalable, crisp at any size)
- **Also supported**: PNG format
- **Size recommendation**: 16x16 to 32x32 pixels for PNG

## Coexistence with Other Icon Themes

Yes! This extension registers itself as an icon theme. You can:

- Switch between "Custom Icons" and other icon themes anytime
- Keep multiple icon themes installed
- Only your custom theme is active when selected

To switch themes:

1. Press `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Type "File Icon Theme"
3. Select your preferred theme

## File Structure

```sh
iconified-custom-icons/
├── default-icons/        # Default icons (never modified)
│   ├── file-icons/       # Default file icons
│   └── folder-icons/     # Default folder icons
|   (↑)[planned for future]
├── icons/                # Working directory (copied from defaults)
│   ├── file-icons/       # Your active file icons
│   ├── folder-icons/     # Your active folder icons
│   └── iconified-icon-theme.json
├── src/
│   └── extension.ts
├── package.json
└── tsconfig.json
```

## Example Icons

For a `build.ninja` file:

- Create an icon named `build.ninja.svg` in the file-icons folder

For all `.ninja` extension files:

- Create an icon named `ninja.svg` in the file-icons folder

For an `include` folder:

- Create an icon named `include.svg` in the folder-icons folder

## Troubleshooting

**Icons not showing?**

1. Make sure "Custom Icons" theme is selected (File Icon Theme)
2. Run "Custom Icons: Refresh Icons"
3. Reload VS Code window

**Want to reset?**

- Delete all files from `icons\file-icons\` and `icons\folder-icons\`
- Run "Custom Icons: Refresh Icons"

## License

MIT

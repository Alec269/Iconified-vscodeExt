import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let fileIconsPath: string;
let folderIconsPath: string;
let iconsPath: string;
let extensionPath: string;

type IconTheme = {
    iconDefinitions: Record<string, { iconPath: string }>;
    file: string;
    folder: string;
    folderExpanded: string;
    fileExtensions: Record<string, string>;
    fileNames: Record<string, string>;
    folderNames: Record<string, string>;
    folderNamesExpanded: Record<string, string>;
    _file: { iconPath: string };
    _folder: { iconPath: string };
    _folder_open: { iconPath: string };
};


export function activate(context: vscode.ExtensionContext) {
    // Set up paths
    extensionPath = context.extensionPath;
    iconsPath = path.join(extensionPath, 'icons');
    fileIconsPath = path.join(iconsPath, 'file-icons');
    folderIconsPath = path.join(iconsPath, 'folder-icons');

    // Create directories if they don't exist
    ensureDirectories();

    // Generate initial icon theme
    generateIconTheme();

    // Watch for changes in icon folders
    watchIconFolders();

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('iconified.openFileIconsFolder', () => {
            vscode.env.openExternal(vscode.Uri.file(fileIconsPath));
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('iconified.openFolderIconsFolder', () => {
            vscode.env.openExternal(vscode.Uri.file(folderIconsPath));
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('iconified.refreshIcons', () => {
            generateIconTheme();
            vscode.window.showInformationMessage('Custom icons refreshed!');
        })
    );

    vscode.window.showInformationMessage(
        'Iconified activated! Use Command Palette to open icon folders.'
    );
}

function ensureDirectories() {
    const defaultFileIconsPath = path.join(extensionPath, 'default-icons', 'file-icons');
    const defaultFolderIconsPath = path.join(extensionPath, 'default-icons', 'folder-icons');

    if (!fs.existsSync(iconsPath)) {
        fs.mkdirSync(iconsPath, { recursive: true });
    }

    if (!fs.existsSync(fileIconsPath)) {
        fs.mkdirSync(fileIconsPath, { recursive: true });

        // Copy default file icons if they exist
        if (fs.existsSync(defaultFileIconsPath)) {
            copyDirectory(defaultFileIconsPath, fileIconsPath);
        }

        // Create a README
        fs.writeFileSync(
            path.join(fileIconsPath, 'README.txt'),
            'Place your file icons here (SVG format recommended).\n' +
            'Name them after file extensions, e.g., "ts.svg" for TypeScript files.\n' +
            'For exact filenames, use the full name, e.g., "package.json.svg"\n\n' +
            'Default icons have been copied here. Feel free to replace or add more!'
        );
    }

    if (!fs.existsSync(folderIconsPath)) {
        fs.mkdirSync(folderIconsPath, { recursive: true });

        // Copy default folder icons if they exist
        if (fs.existsSync(defaultFolderIconsPath)) {
            copyDirectory(defaultFolderIconsPath, folderIconsPath);
        }

        fs.writeFileSync(
            path.join(folderIconsPath, 'README.txt'),
            'Place your folder icons here (SVG format recommended).\n' +
            'Name them after folder names, e.g., "src.svg" for src folders.\n\n' +
            'Default icons have been copied here. Feel free to replace or add more!'
        );
    }
}

function copyDirectory(src: string, dest: string) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function watchIconFolders() {
    const fileWatcher = fs.watch(fileIconsPath, (eventType) => {
        if (eventType === 'rename' || eventType === 'change') {
            generateIconTheme();
        }
    });

    const folderWatcher = fs.watch(folderIconsPath, (eventType) => {
        if (eventType === 'rename' || eventType === 'change') {
            generateIconTheme();
        }
    });
}

function generateIconTheme() {
    const fileAssociations: { [key: string]: string } = {};
    const folderAssociations: { [key: string]: string } = {};
    const iconDefinitions: { [key: string]: { iconPath: string } } = {};

    // Process file icons
    const fileIcons = fs.readdirSync(fileIconsPath).filter(f =>
        f.endsWith('.svg') || f.endsWith('.png')
    );

    for (const icon of fileIcons) {
        const iconName = path.parse(icon).name;
        const iconId = `file_${iconName.replace(/\./g, '_')}`;
        const relPath = `./file-icons/${icon}`;

        iconDefinitions[iconId] = { iconPath: relPath };

        // If icon name contains a dot, treat as exact filename match
        if (iconName.includes('.')) {
            fileAssociations[iconName] = iconId;
        } else {
            // Otherwise treat as file extension
            fileAssociations[iconName] = iconId;
        }
    }

    // Process folder icons
    const folderIcons = fs.readdirSync(folderIconsPath).filter(f =>
        f.endsWith('.svg') || f.endsWith('.png')
    );

    for (const icon of folderIcons) {
        const iconName = path.parse(icon).name;
        const iconId = `folder_${iconName}`;
        const relPath = `./folder-icons/${icon}`;

        iconDefinitions[iconId] = { iconPath: relPath };
        folderAssociations[iconName] = iconId;
    }

    // Build the icon theme JSON
    const iconTheme: IconTheme = {
        iconDefinitions,
        file: "_file",
        folder: "_folder",
        folderExpanded: "_folder_open",
        fileExtensions: fileAssociations,
        fileNames: {} as Record<string, string>,
        folderNames: folderAssociations,
        folderNamesExpanded: {} as Record<string, string>,
        // Default icons (you can customize these)
        _file: { iconPath: "" },
        _folder: { iconPath: "" },
        _folder_open: { iconPath: "" }
    };

    // Add exact filename matches to fileNames
    for (const [name, iconId] of Object.entries(fileAssociations)) {
        if (name.includes('.')) {
            iconTheme.fileNames[name] = iconId;
            delete iconTheme.fileExtensions[name];
        }
    }

    // Write the icon theme file
    const themePath = path.join(iconsPath, 'iconified-icon-theme.json');
    fs.writeFileSync(themePath, JSON.stringify(iconTheme, null, 2));
}

export function deactivate() { }
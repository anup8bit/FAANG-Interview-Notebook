export interface FileProps {
    name: string;
    files?: FileProps[];
}

export const sortFilesByFolderAndFilename = (data: FileProps[]): FileProps[] => {
    return [...data]
        .sort((a, b) => {
            const aIsFolder = Array.isArray(a.files) && a.files.length > 0;
            const bIsFolder = Array.isArray(b.files) && b.files.length > 0;

            //Folder first
            if (aIsFolder && !bIsFolder) return -1;
            if (!aIsFolder && bIsFolder) return 1;


            // Then return by name (case insensitive)
            return a.name.localeCompare(b.name, undefined, {
                sensitivity: 'base',
            });
        }).map ((item) => {
            // Recursively sort childrens if present
            if (Array.isArray(item.files) && item.files.length > 0) {
              return {
                ...item, files: sortFilesByFolderAndFilename(item.files)
              };
            }
            return item;
        });
}


export const files: FileProps[] = [
    {
        name: "dist",
        files: [
            {
                name: "builds",
                files: [
                    {name: "main.12h3gt.builds.js"},
                    {name: "Home.12h3gt.chunk.js"},
                    {name: "Profile.12h3gt.chunk.js"},
                    {name: "Settings.12h3gt.chunk.js"},
                    {name: "app.12h3gt.builds.js"},
                ]
            }
        ]
    },
    {
        name: "public",
        files: [
            {name: "styles.css"},
            {
                name: "images",
                files: [
                    {name: "profile-pic.png"},
                    {name: "pic1.jpeg"},
                    {name: "package.png"},
                    {name: "package2.jpg"},

                ]
            }
        ]
    },
    {name: "package.json"},
    {name: "package-lock.json"},
    {name: "tsconfig.json"},
    {name: ".env"}
]
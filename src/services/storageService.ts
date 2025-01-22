const storagePath = "storage/";

export async function saveFileAndGetPath(file?: File) {
    if (!file) {
        console.log("got here")
        return null;
    }
    const extension = file.name.split('.').pop();
    console.log(file.type)
    const newFilePath = `${storagePath}${crypto.randomUUID()}.${extension}`
    await Bun.write(newFilePath, file);
    return newFilePath;


}

export async function deleteFileIfExists(path: string | null) {
    if (path == null) {
        return;
    }
}
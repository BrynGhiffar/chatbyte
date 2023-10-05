export const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
});

export const toImageSrc = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});
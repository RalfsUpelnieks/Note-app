export function ConvertTime(time: string) {
    const date = new Date(time);
    return date.toLocaleString();
};

export function GetTimeISO(){
    let currentTime = new Date();
    return currentTime.toISOString();
}

export function formatDate(date) {
    return date.toLocaleString('en-GB', { day: '2-digit', month: 'short' });
}
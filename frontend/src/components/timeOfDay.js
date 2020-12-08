function TimeOfDay({ time }) {
    let hour = time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
    const meridian = time.getHours() >= 12 ? "pm" : "am";
    const minutes = String(time.getMinutes()).padStart(2, '0');
    if (hour === 0) {
        hour = 12;
    }
    return `${hour}:${minutes} ${meridian}`;
}

export default TimeOfDay;

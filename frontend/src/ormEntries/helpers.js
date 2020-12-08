export const calculateOneRepMax = ({ weight, repetitions }) => {
    const pct = 1.0267192118226645 + -.030815052439218941 * repetitions + .00045874384236455567 * repetitions * repetitions;
    return weight / pct;
};
export const globalState = {
    var1: 1,
    var2: null,
    var3: null,
    var4: null,
    
};
export function updateGlobalState(index, value) {
    if (index >= 0 && index < globalState.length) {
        globalState[index] = value;
        console.log(`globalState[${index}] updated to: ${value}`);
    }
}
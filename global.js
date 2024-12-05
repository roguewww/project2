// Initialize globalState from sessionStorage or default values
const initialState = JSON.parse(sessionStorage.getItem("globalState")) || {
    var1: 1,
    var2: null,
    var3: null,
    var4: null,
};

const listeners = [];

// Reactive globalState with sessionStorage persistence
export const globalState = new Proxy(initialState, {
    set(target, property, value) {
        if (target[property] !== value) {
            target[property] = value;

            // Persist updated state to sessionStorage
            sessionStorage.setItem("globalState", JSON.stringify(target));

            // Notify listeners about the change
            listeners.forEach(listener => listener(property, value));
            console.log(`globalState.${property} updated to: ${value}`);
        }
        return true;
    }
});

/**
 * Registers a listener function to react to globalState changes.
 * @param {Function} listener - A function that receives `property` and `value`.
 */
export function addStateListener(listener) {
    listeners.push(listener);
}
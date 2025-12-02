let Cred = false;

// --- GETTERS ---
export const getCred = () =>{
     return Cred;
    }

// --- SETTERS (used by bootstrap only) ---
export const __setCred = (data) => { 
    Cred = data;
 };
let Cred = false;

// --- GETTERS ---
export const getCred = () =>{
    console.log(Cred);
     return Cred;
    }

// --- SETTERS (used by bootstrap only) ---
export const __setCred = (data) => { 
    Cred = data;
 };
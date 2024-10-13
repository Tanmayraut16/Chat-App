
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCd9Ce6s7yVdWDAUe9MPoKO-VVRpZpx2Ow",
  authDomain: "chat-app-8aea9.firebaseapp.com",
  projectId: "chat-app-8aea9",
  storageBucket: "chat-app-8aea9.appspot.com",
  messagingSenderId: "952904117593",
  appId: "1:952904117593:web:e28d6c19c6aac4a3c37048"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username,email,password)=>{
    try{
        const res = await createUserWithEmailAndPassword(auth,email,password)
        const user = res.user;
        await setDoc(doc(db, "users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey There I am using Whatsapp",
            lastSeen:Date.now()
        })
        await setDoc(doc(db, "chats",user.uid),{
            chatsData:[]
        })
    } catch (err){
        console.error(err);
        toast.error(err.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email, password) => {
    try{
        await signInWithEmailAndPassword(auth, email,password);
    } catch(err){
        console.error(err);
        toast.error(err.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () => {
    try {

        await signOut(auth);
        
    } catch (error) {

        console.error(err);
        toast.error(err.code.split('/')[1].split('-').join(" "));

    }
    
}


const resetPass = async (email) => {
    if (!email) {
        toast.error('Please enter enter your email');
        return null;
    }
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef,where("email" , "==", email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth,email);
            toast.success('Password reset email sent successfully');
        }
        else {
            toast.error('No user found with this email');
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
}

export {signup,login,logout,auth,db,resetPass};
import * as Firebase from 'firebase/app';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getReactNativePersistence, initializeAuth, AuthErrorCodes, signOut as fireOut } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question, User } from './Types';
import { getItem } from './LocalStore';

export const FireStatusCodes = {
    SUCCESS: 10,
    EMAIL_INVALID: 21,
    NO_USER: 20,
    NO_DATA: 1,
    LOGIN_INVALID: 32,
    ERROR_BAD: 99,
}

const firebaseApp = Firebase.initializeApp({
    apiKey: "AIzaSyBeqt7ybbWEClIPuLr0F7eemLNBcVfP4W4",
    authDomain: "cyberlearner.firebaseapp.com",
    projectId: "cyberlearner",
    storageBucket: "cyberlearner.appspot.com",
    messagingSenderId: "341550292926",
    appId: "1:341550292926:web:6101950d0e55b009f0e3ef"
});

const auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(firebaseApp);
auth.onAuthStateChanged(change => {
    const nullCheck = change === null;
    console.log('Firestore: auth change:', nullCheck ? change : 'user is set');
    nullCheck ? null : change.getIdToken(true);
    //console.log('Firestore: auth change:', change);
});

export async function signIn(username: string, password: string) {
    try {
        const user = (await signInWithEmailAndPassword(auth, username, password)).user;
        const userDoc = doc(db, 'users', user.uid);
        return { status: FireStatusCodes.SUCCESS, data: await getDoc(userDoc), user: user };
    } catch (error: any) {
        console.error(error);
        if (error.code === AuthErrorCodes.USER_DELETED) {
            return { status: FireStatusCodes.NO_USER };
        } else if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
            return { status: FireStatusCodes.LOGIN_INVALID };
        } else {
            return { status: FireStatusCodes.ERROR_BAD }
        }
    }
}

export async function signOut() {
    fireOut(auth);
}

export async function reauthenticate() {
    const user = auth.currentUser;
    if (user == undefined || user == null) {
        const newUser = await getItem('@fireUser');
        if (newUser == undefined || newUser == null) {
            console.log('Firestore: no past user tokens. logging out of app');
            return false;
        }
        console.log('Firestore: loading user as', newUser.email);
        auth.updateCurrentUser(newUser).catch(_err => {
            //console.log('Firestore: ignore', _err);
        });
        return true;
    } else {
        user.getIdToken(true).catch(_err => { }).finally(() =>
            console.log('Firestore: token refresh'));
        return true;
    }
}

export async function signUp(newUser: User, password: string) {
    try {
        const user = (await createUserWithEmailAndPassword(auth, newUser.email, password)).user;
        await setDoc(doc(db, "users", user.uid), newUser);
        console.log("User ID:", user.uid);
        console.log("Document written");
        return { status: FireStatusCodes.SUCCESS, data: user };
    } catch (error: any) {
        if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
            return { status: FireStatusCodes.EMAIL_INVALID, data: null };
        } else {
            console.log("Firestore: returning unknown error:", error.code);
            return { status: FireStatusCodes.ERROR_BAD, data: null };
        }
    }
}

export async function addQAS(newQuestion: Question) {
    try {
        await addDoc(collection(db, 'qas'), newQuestion);
    } catch (_err) {
        console.error(_err);
    }
}

export async function getQuestions() {
    try {
        const docs = await getDocs(collection(db, 'qas'));
        if (docs.empty) {
            return null;
        }
        const questionArray = Array<Question>();
        docs.forEach(result => {
            questionArray.push(result.data() as Question);
        });
        return questionArray;
    } catch (_err) {
        console.error(_err);
        return null;
    }
}

export async function addDesc(newDesc: { cve_id: string, description: string }) {
    try {

    } catch (_err) {
        console.error(_err);
    }
}

export async function getDescription(cve_id: string) {
    try {

    } catch (_err) {
        console.error(_err);
    }
}

export async function getAllDescriptions() {
    try {

    } catch (_err) {
        console.error(_err);
    }
}
